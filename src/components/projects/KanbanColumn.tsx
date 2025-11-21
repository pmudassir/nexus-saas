import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  assignees?: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  progress?: number;
  comments?: number;
  attachments?: number;
  tags?: string[];
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col min-w-[320px] h-full rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {title} ({tasks.length})
        </h3>
        <div
          className={`h-2 w-2 rounded-full transition-colors ${
            isOver ? "bg-primary" : "bg-transparent"
          }`}
        />
      </div>
      <SortableContext items={tasks}>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              dueDate={task.dueDate}
              assignees={task.assignees}
              progress={task.progress}
              comments={task.comments}
              attachments={task.attachments}
              tags={task.tags}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
