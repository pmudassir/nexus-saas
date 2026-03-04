"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

/* ── Linear Progress ── */

const progressVariants = cva("h-full rounded-full transition-all duration-500", {
  variants: {
    variant: {
      default: "bg-[#e9590c]",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      error: "bg-rose-500",
      info: "bg-sky-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  showLabel?: boolean
  size?: "sm" | "default" | "lg"
}

const sizeMap = {
  sm: "h-1",
  default: "h-1.5",
  lg: "h-2.5",
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant, showLabel, size = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {showLabel && (
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div className={cn("w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", sizeMap[size])}>
          <div
            className={cn(progressVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

/* ── Circular Progress ── */

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "success" | "warning" | "error"
  showValue?: boolean
}

const circularColorMap = {
  default: "text-[#e9590c]",
  success: "text-emerald-500",
  warning: "text-amber-500",
  error: "text-rose-500",
}

function CircularProgress({
  value = 0,
  max = 100,
  size = 128,
  strokeWidth = 3,
  variant = "default",
  showValue = true,
  className,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }} {...props}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-slate-200 dark:text-slate-800"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray="100, 100"
          strokeWidth={strokeWidth}
        />
        <path
          className={circularColorMap[variant]}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${percentage}, 100`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold dark:text-white">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

export { Progress, CircularProgress }
