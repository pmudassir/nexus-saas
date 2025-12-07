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
          className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar 
                src={item.user.image} 
                fallback={item.user.initials}
                className="h-9 w-9 border border-white/10 dark:border-white/5 shadow-sm"
              />
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-900",
                i === 0 ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"
              )} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">
                <span className="font-semibold">{item.user.name}</span>{" "}
                <span className="text-muted-foreground font-normal">{item.action}</span>
              </p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {item.target}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground/50 font-medium">
            {item.time}
          </div>
        </div>
      ))}
    </div>
  );
}
