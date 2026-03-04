import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#e9590c]/10 text-[#e9590c] px-3 py-1",
        secondary:
          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1",
        success:
          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1",
        warning:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1",
        error:
          "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-3 py-1",
        info:
          "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 px-3 py-1",
        outline:
          "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1",
        ghost:
          "text-slate-500 dark:text-slate-400 px-2 py-1",
        purple:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1",
      },
      size: {
        default: "text-xs px-3 py-1",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

function Badge({ className, variant, size, dot, dotColor, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            dotColor || (
              variant === "success" ? "bg-emerald-500" :
              variant === "warning" ? "bg-amber-500" :
              variant === "error" ? "bg-rose-500" :
              variant === "info" ? "bg-sky-500" :
              "bg-[#e9590c]"
            )
          )}
        />
      )}
      {props.children}
    </div>
  )
}

// Convenience composites
const STATUS_MAP: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
  active: { variant: "success", label: "Active" },
  completed: { variant: "success", label: "Completed" },
  paid: { variant: "success", label: "Paid" },
  pending: { variant: "warning", label: "Pending" },
  in_progress: { variant: "warning", label: "In Progress" },
  overdue: { variant: "error", label: "Overdue" },
  failed: { variant: "error", label: "Failed" },
  cancelled: { variant: "error", label: "Cancelled" },
  suspended: { variant: "warning", label: "Suspended" },
  draft: { variant: "secondary", label: "Draft" },
  inactive: { variant: "secondary", label: "Inactive" },
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_MAP[status.toLowerCase().replace(/\s+/g, '_')] || {
    variant: "secondary" as const,
    label: status,
  }
  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}

const PRIORITY_MAP: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
  high: { variant: "error", label: "High Priority" },
  urgent: { variant: "error", label: "Urgent" },
  medium: { variant: "warning", label: "Medium Priority" },
  low: { variant: "info", label: "Low Priority" },
  none: { variant: "secondary", label: "No Priority" },
}

function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const config = PRIORITY_MAP[priority.toLowerCase()] || {
    variant: "secondary" as const,
    label: priority,
  }
  return (
    <Badge variant={config.variant} size="sm" className={cn("uppercase tracking-wide", className)}>
      {config.label}
    </Badge>
  )
}

export { Badge, badgeVariants, StatusBadge, PriorityBadge }
