import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-4 rounded-2xl border border-gray-100">
      <div className="col-span-5 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="col-span-2 hidden md:flex items-center">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="col-span-2 hidden md:flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="col-span-2 hidden md:flex items-center">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="col-span-1 hidden md:flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, TableRowSkeleton, TableSkeleton, DashboardSkeleton };
