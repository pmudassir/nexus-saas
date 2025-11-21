import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Calendar, MoreHorizontal } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}

export function TaskCard({ id, title, priority, dueDate }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    LOW: "bg-blue-500/10 text-blue-500",
    MEDIUM: "bg-yellow-500/10 text-yellow-500",
    HIGH: "bg-red-500/10 text-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-md hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
            priorityColors[priority]
          )}
        >
          {priority}
        </span>
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <h4 className="font-medium text-sm mb-3">{title}</h4>
      {dueDate && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{dueDate}</span>
        </div>
      )}
    </div>
  );
}
