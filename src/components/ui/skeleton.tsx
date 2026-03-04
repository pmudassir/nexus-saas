import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800", className)}
      {...props}
    />
  )
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-[#24272d] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-[#24272d] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        <div className="xl:col-span-6">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="xl:col-span-4">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, CardSkeleton, TableRowSkeleton, TableSkeleton, DashboardSkeleton }
