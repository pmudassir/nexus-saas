import { Widget } from "./Widget";
import { DollarSign, Users, CheckSquare, TrendingUp } from "lucide-react";

export function DashboardGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Widget
        title="Total Revenue"
        description="+20.1% from last month"
        icon={<DollarSign className="h-5 w-5" />}
      >
        <div className="text-2xl font-bold">$45,231.89</div>
      </Widget>
      <Widget
        title="Active Projects"
        description="+2 new this week"
        icon={<CheckSquare className="h-5 w-5" />}
      >
        <div className="text-2xl font-bold">12</div>
      </Widget>
      <Widget
        title="Total Clients"
        description="+4 new clients"
        icon={<Users className="h-5 w-5" />}
      >
        <div className="text-2xl font-bold">24</div>
      </Widget>
      <Widget
        title="Task Completion"
        description="+12% completion rate"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <div className="text-2xl font-bold">84%</div>
      </Widget>
    </div>
  );
}
