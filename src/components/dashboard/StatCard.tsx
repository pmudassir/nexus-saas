import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl glass-card p-6 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors blur-xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-semibold text-muted-foreground/80 tracking-wide">
              {title}
            </h3>
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <div className="text-3xl font-display font-bold tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{value}</div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
