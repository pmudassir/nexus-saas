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
        "row-span-1 rounded-md group/bento hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-4 bg-white border border-[#E9E9E8] justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        {icon}
        <div className="font-sans font-semibold text-[#37352f] mb-1 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-[#9B9A97] text-xs">
          {description}
        </div>
      </div>
    </div>
  );
};
