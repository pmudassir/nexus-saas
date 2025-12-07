import { cn } from "@/lib/utils";

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Widget({
  title,
  description,
  icon,
  children,
  className,
  ...props
}: WidgetProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 flex flex-col rounded-2xl",
        className
      )}
      {...props}
    >
      {(title || icon) && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-display font-semibold text-lg tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
