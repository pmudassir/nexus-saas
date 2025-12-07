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
        "group relative rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
