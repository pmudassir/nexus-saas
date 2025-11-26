import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[rgba(235,236,252,1)] text-[rgb(69,75,230)]", // Indigo soft
        secondary:
          "bg-[rgba(227,226,224,0.5)] text-[#32302c]", // Gray soft
        success: "bg-[rgba(219,237,219,1)] text-[rgb(28,56,41)]", // Green soft
        warning: "bg-[rgba(250,222,201,1)] text-[rgb(73,41,14)]", // Orange soft
        error: "bg-[rgba(255,226,221,1)] text-[rgb(93,23,21)]", // Red soft
        info: "bg-[rgba(227,226,224,0.5)] text-[#32302c]", // Default to gray for info or use blue
        outline: "border border-[#E9E9E8] text-[#37352f]",
        ghost: "hover:bg-[rgba(55,53,47,0.08)] text-[#37352f]",
      },
      size: {
        sm: "text-[10px] px-1 py-0",
        md: "text-xs px-1.5 py-0.5",
        lg: "text-sm px-2 py-1",
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
      {icon && <span className="inline-flex mr-1">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-0.5 inline-flex h-3 w-3 items-center justify-center rounded-sm hover:bg-black/5 transition-colors"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status:
    | "active"
    | "inactive"
    | "pending"
    | "completed"
    | "cancelled"
    | "lead"
    | "in_stock"
    | "low_stock"
    | "out_of_stock"
    | "paid"
    | "overdue"
    | "on_leave";
  size?: BadgeProps["size"];
  className?: string;
}

export function StatusBadge({ status, size, className }: StatusBadgeProps) {
  const variants: Record<
    typeof status,
    { variant: BadgeProps["variant"]; label: string }
  > = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "secondary", label: "Cancelled" },
    lead: { variant: "default", label: "Lead" },
    in_stock: { variant: "success", label: "In Stock" },
    low_stock: { variant: "warning", label: "Low Stock" },
    out_of_stock: { variant: "error", label: "Out of Stock" },
    paid: { variant: "success", label: "Paid" },
    overdue: { variant: "error", label: "Overdue" },
    on_leave: { variant: "warning", label: "On Leave" },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
  size?: BadgeProps["size"];
  className?: string;
}

export function PriorityBadge({
  priority,
  size,
  className,
}: PriorityBadgeProps) {
  const variants: Record<
    typeof priority,
    { variant: BadgeProps["variant"]; label: string }
  > = {
    low: { variant: "secondary", label: "Low" },
    medium: { variant: "default", label: "Medium" },
    high: { variant: "warning", label: "High" },
    urgent: { variant: "error", label: "Urgent" },
  };

  const config = variants[priority];

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
