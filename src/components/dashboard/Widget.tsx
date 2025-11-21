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
        "rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md transition-all hover:bg-white/10",
        className
      )}
      {...props}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold leading-none tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="h-full">{children}</div>
    </div>
  );
}
