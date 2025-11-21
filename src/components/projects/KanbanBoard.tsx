"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

const initialData = {
  TODO: [
    {
      id: "1",
      title: "Research market trends",
      priority: "HIGH",
      dueDate: "Oct 12",
    },
    {
      id: "2",
      title: "Draft project proposal",
      priority: "MEDIUM",
      dueDate: "Oct 14",
    },
  ],
  IN_PROGRESS: [
    {
      id: "3",
      title: "Design system architecture",
      priority: "HIGH",
      dueDate: "Oct 20",
    },
  ],
  REVIEW: [
    {
      id: "4",
      title: "Client meeting preparation",
      priority: "LOW",
      dueDate: "Oct 10",
    },
  ],
  DONE: [
    { id: "5", title: "Initial setup", priority: "MEDIUM", dueDate: "Oct 1" },
  ],
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<any>(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination containers
    const sourceContainer = findContainer(activeId);
    const destContainer =
      findContainer(overId) ||
      (Object.keys(tasks).includes(overId) ? overId : null);

    if (
      !sourceContainer ||
      !destContainer ||
      sourceContainer === destContainer
    ) {
      setActiveId(null);
      return;
    }

    // Move task
    setTasks((prev: any) => {
      const sourceTasks = [...prev[sourceContainer]];
      const destTasks = [...prev[destContainer]];
      const taskIndex = sourceTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      destTasks.push(movedTask);

      return {
        ...prev,
        [sourceContainer]: sourceTasks,
        [destContainer]: destTasks,
      };
    });

    setActiveId(null);
  }

  function findContainer(id: string) {
    if (Object.keys(tasks).includes(id)) return id;
    return Object.keys(tasks).find((key) =>
      tasks[key].find((t: any) => t.id === id)
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-12rem)] gap-6 overflow-x-auto pb-4">
        {Object.keys(tasks).map((key) => (
          <KanbanColumn
            key={key}
            id={key}
            title={key.replace("_", " ")}
            tasks={tasks[key]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <TaskCard id={activeId} title="Moving..." priority="MEDIUM" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
