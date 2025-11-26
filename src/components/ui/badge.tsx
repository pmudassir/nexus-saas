import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100",
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
        success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100",
        warning: "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100",
        error: "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100",
        info: "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
        ghost: "hover:bg-slate-100 text-slate-700",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
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
          className="ml-1 -mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="h-3 w-3" />
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
    completed: { variant: "info", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
    lead: { variant: "info", label: "Lead" },
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
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
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
    medium: { variant: "info", label: "Medium" },
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
