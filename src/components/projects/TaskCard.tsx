"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageSquare, Paperclip, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { AvatarStack } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
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

export function TaskCard({
  id,
  title,
  description,
  priority,
  dueDate,
  assignees = [],
  progress,
  comments = 0,
  attachments = 0,
  tags = [],
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityMap: Record<string, "low" | "medium" | "high" | "urgent"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent",
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-xl border border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 shadow-premium hover:shadow-premium-md transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 dark:hover:bg-black/50 rounded">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      {typeof progress === "number" && (
        <div className="mb-3">
          <Progress value={progress} size="sm" showLabel />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {dueDate && (
            <div
              className={`flex items-center gap-1 ${
                isOverdue ? "text-error" : ""
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(dueDate), "MMM d")}</span>
            </div>
          )}
          {comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{comments}</span>
            </div>
          )}
          {attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              <span>{attachments}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={priorityMap[priority]} size="sm" />
          {assignees.length > 0 && (
            <AvatarStack avatars={assignees} max={3} size="xs" />
          )}
        </div>
      </div>
    </div>
  );
}
