import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "bg-success/10 text-success hover:bg-success/20",
        warning: "bg-warning/10 text-warning hover:bg-warning/20",
        error: "bg-error/10 text-error hover:bg-error/20",
        info: "bg-info/10 text-info hover:bg-info/20",
        outline: "border border-current bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant,
  size,
  onRemove,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "completed" | "cancelled";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<
    typeof status,
    { variant: BadgeProps["variant"]; label: string }
  > = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
    completed: { variant: "info", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variants: Record<
    typeof priority,
    { variant: BadgeProps["variant"]; label: string }
  > = {
    low: { variant: "secondary", label: "Low" },
    medium: { variant: "info", label: "Medium" },
    high: { variant: "warning", label: "High" },
    urgent: { variant: "error", label: "Urgent" },
  };

  const config = variants[priority];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
