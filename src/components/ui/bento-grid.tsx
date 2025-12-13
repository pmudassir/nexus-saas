import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 floating-card p-6 justify-between flex flex-col space-y-4 relative overflow-hidden group/bento",
        className
      )}
    >
      <div className="relative z-10">
        {header}
        <div className="group-hover/bento:translate-y-[-4px] transition duration-300 mt-6 ease-out">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2.5 w-fit rounded-xl bg-orange-50 text-primary">
               {icon}
             </div>
             <div className="font-display font-bold text-foreground text-xl tracking-tight">
                {title}
             </div>
          </div>
          <div className="font-sans font-medium text-muted-foreground text-sm leading-relaxed pl-1">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};
