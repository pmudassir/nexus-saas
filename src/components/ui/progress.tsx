import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "info";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantClasses = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
};

export function Progress({
  value = 0,
  max = 100,
  showLabel = false,
  size = "md",
  variant = "default",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1 text-sm text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  variant = "default",
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-out",
            variantColors[variant]
          )}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}
