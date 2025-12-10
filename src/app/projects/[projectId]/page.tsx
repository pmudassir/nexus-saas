import { Shell } from "@/components/layout/Shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { notFound } from "next/navigation";

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { tenant } = await requireTenantMembership();
  const { projectId } = await params;

  // Fetch project and its tasks
  const project = await prisma.project.findFirst({
    where: { id: projectId, tenantId: tenant.id },
  });

  if (!project) {
    notFound();
  }

  const tasks = await prisma.task.findMany({
    where: { projectId, tenantId: tenant.id },
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
      ],
      progress: hash % 100,
      comments: hash % 10,
      attachments: hash % 5,
      tags: ["Design", "Frontend", "High Priority"].slice(0, (hash % 3) + 1),
    };
  });

  return (
    <Shell>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">
                {project.description || "Manage tasks for this project"}
              </p>
            </div>
          </div>
          <Link href={`/projects/new?projectId=${projectId}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Tasks Yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first task to get started.
              </p>
              <Link href={`/projects/new?projectId=${projectId}`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Task
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <KanbanBoard initialTasks={richTasks} />
        )}
      </div>
    </Shell>
  );
}
