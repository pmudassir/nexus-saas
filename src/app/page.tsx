import { Shell } from "@/components/layout/Shell";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Widget } from "@/components/dashboard/Widget";
import { Activity, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const recentActivity = [
    {
      id: 1,
      action: "New project created",
      time: "2 hours ago",
      type: "project",
    },
    {
      id: 2,
      action: "Invoice #1234 paid",
      time: "4 hours ago",
      type: "finance",
    },
    {
      id: 3,
      action: "Meeting scheduled",
      time: "6 hours ago",
      type: "calendar",
    },
    { id: 4, action: "New contact added", time: "1 day ago", type: "crm" },
  ];

  const ongoingProjects = [
    { name: "Website Redesign", progress: 75, status: "On Track" },
    { name: "Mobile App Development", progress: 45, status: "In Progress" },
    { name: "Marketing Campaign", progress: 90, status: "Almost Done" },
  ];

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your workspace. Here&apos;s what&apos;s happening
            today.
          </p>
        </div>

        <DashboardGrid />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Widget
            title="Recent Activity"
            icon={<Activity className="h-5 w-5" />}
          >
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Widget>

          {/* Ongoing Projects */}
          <Widget title="Ongoing Projects" icon={<Clock className="h-5 w-5" />}>
            <div className="space-y-4">
              {ongoingProjects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge
                      variant={
                        project.progress > 70
                          ? "success"
                          : project.progress > 40
                          ? "info"
                          : "warning"
                      }
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <Progress
                    value={project.progress}
                    size="sm"
                    variant={
                      project.progress > 70
                        ? "success"
                        : project.progress > 40
                        ? "default"
                        : "warning"
                    }
                  />
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </Shell>
  );
}
