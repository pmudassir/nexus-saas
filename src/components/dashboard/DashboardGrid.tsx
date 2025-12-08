import { StatCard } from "./StatCard";
import { DollarSign, Users, CheckSquare, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  totalClients: number;
  taskCompletionRate: number;
}

export function DashboardGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue)}
        description="Total paid invoices"
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 0, isPositive: true }} // TODO: Calculate trend
      />
      <StatCard
        title="Active Projects"
        value={stats.activeProjects.toString()}
        description="Currently active"
        icon={<CheckSquare className="h-5 w-5" />}
        trend={{ value: 0, isPositive: true }}
      />
      <StatCard
        title="Total Clients"
        value={stats.totalClients.toString()}
        description="Total contacts"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 0, isPositive: true }}
      />
      <StatCard
        title="Task Completion"
        value={`${stats.taskCompletionRate}%`}
        description="All time completion"
        icon={<TrendingUp className="h-5 w-5" />}

      />
    </div>
  );
}
