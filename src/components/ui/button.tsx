import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#e9590c] hover:bg-[#e9590c]/90 text-white rounded-full shadow-lg shadow-[#e9590c]/20",
        secondary:
          "bg-[#e9590c]/10 hover:bg-[#e9590c]/20 text-[#e9590c] rounded-full",
        destructive:
          "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 rounded-full",
        outline:
          "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full",
        ghost:
          "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-medium",
        link:
          "text-[#e9590c] underline-offset-4 hover:underline",
        glass:
          "bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-white/5 text-foreground hover:bg-white dark:hover:bg-slate-800 shadow-soft rounded-full",
        glow:
          "bg-[#e9590c]/10 text-[#e9590c] border border-[#e9590c]/20 hover:bg-[#e9590c]/20 shadow-[0_0_15px_rgba(233,89,12,0.3)] transition-all duration-300 rounded-full",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
