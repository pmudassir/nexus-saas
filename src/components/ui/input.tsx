import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
          <input
            type={type}
            className={cn(
              "flex w-full pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#e9590c]/20 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100 outline-none",
              error && "bg-rose-50 dark:bg-rose-900/10 border border-rose-500 focus:ring-rose-500/10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex w-full px-6 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-full text-sm font-medium transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#e9590c]/20 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100 outline-none",
          error && "bg-rose-50 dark:bg-rose-900/10 border border-rose-500 focus:ring-rose-500/10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
