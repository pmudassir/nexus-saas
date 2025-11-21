import { Shell } from "@/components/layout/Shell";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { Button } from "@/components/ui/button"; // Assuming we might add this later, but for now standard button
import { Plus } from "lucide-react";

export default function ProjectsPage() {
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
        <KanbanBoard />
      </div>
    </Shell>
  );
}
