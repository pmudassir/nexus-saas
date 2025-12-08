import { Shell } from "@/components/layout/Shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export default async function ProjectsPage() {
  const { tenant } = await requireTenantMembership();
  // const tenant = { id: "default-tenant-id" }; // Hardcoded for debugging

  const tasks = await prisma.task.findMany({
    where: { tenantId: tenant.id },
    include: {
      project: true,
      creator: true,
    },
  });

  // Simple hash function for deterministic "random" values
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Transform database tasks to match our rich UI format
  const richTasks = tasks.map((task) => {
    const hash = hashCode(task.id);
    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      priority: task.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      dueDate: task.dueDate?.toISOString(),
      assignees: [
        {
          alt: task.creator?.name || "User",
          fallback: task.creator?.name?.charAt(0) || "U",
        },
        {
          fallback: "JD",
        },
      ],
      progress: hash % 100, // Deterministic progress based on ID
      comments: hash % 10,
      attachments: hash % 5,
      tags: ["Design", "Frontend", "High Priority"].slice(0, (hash % 3) + 1),
    };
  });

  return (
    <Shell>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and tasks with an intuitive Kanban board.
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>
        <KanbanBoard initialTasks={richTasks} />
      </div>
    </Shell>
  );
}
