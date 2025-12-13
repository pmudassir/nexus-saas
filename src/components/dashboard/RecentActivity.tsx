"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const activity = [
  {
    id: 1,
    user: {
      name: "Alex Morgan",
      image: "https://github.com/shadcn.png",
      initials: "AM",
    },
    action: "created a new project",
    target: "Website Redesign",
    time: "2m ago",
    type: "project",
  },
  {
    id: 2,
    user: {
      name: "Sarah Chen",
      image: "",
      initials: "SC",
    },
    action: "completed task",
    target: "Update dependencies",
    time: "15m ago",
    type: "task",
  },
  {
    id: 3,
    user: {
      name: "Mike Ross",
      image: "",
      initials: "MR",
    },
    action: "uploaded a file",
    target: "Q4 Report.pdf",
    time: "1h ago",
    type: "file",
  },
  {
    id: 4,
    user: {
      name: "System",
      image: "",
      initials: "SYS",
    },
    action: "generated invoice",
    target: "#INV-2023-001",
    time: "2h ago",
    type: "system",
  },
];

export function RecentActivity({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {activity.map((item, i) => (
        <div
          key={item.id}
          className="group flex items-center justify-between p-4 rounded-3xl bg-white border border-border/50 shadow-sm hover:shadow-soft transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar 
                src={item.user.image} 
                fallback={item.user.initials}
                className="h-10 w-10 border-2 border-white shadow-sm"
              />
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                i === 0 ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"
              )} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">
                <span className="font-bold">{item.user.name}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                 {item.action} <span className="text-foreground/80 font-medium">• {item.time}</span>
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
            {item.type}
          </div>
        </div>
      ))}
    </div>
  );
}
