import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const tasks = await prisma.task.findMany({
    include: {
      project: true,
      creator: true,
    },
  });

  // Transform DB tasks to the format KanbanBoard expects
  const initialTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString().split("T")[0],
  }));

  return (
    <Shell>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your tasks and workflows.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
        <KanbanBoard initialTasks={initialTasks} />
      </div>
    </Shell>
  );
}
