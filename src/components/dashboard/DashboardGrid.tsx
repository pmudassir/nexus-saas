import { StatCard } from "./StatCard";
import { DollarSign, Users, CheckSquare, TrendingUp } from "lucide-react";

export function DashboardGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$45,231.89"
        description="+20.1% from last month"
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 20.1, isPositive: true }}
      />
      <StatCard
        title="Active Projects"
        value="12"
        description="+2 new this week"
        icon={<CheckSquare className="h-5 w-5" />}
        trend={{ value: 18, isPositive: true }}
      />
      <StatCard
        title="Total Clients"
        value="24"
        description="+4 new clients"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 16.7, isPositive: true }}
      />
      <StatCard
        title="Task Completion"
        value="84%"
        description="+12% completion rate"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
