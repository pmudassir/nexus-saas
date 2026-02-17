"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Circle,
  Check,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createTask, updateTaskStatus, deleteTask } from "@/actions/tasks";
import type { Status, Priority } from "@prisma/client";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  project: { id: string; name: string };
  assignee: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
};

type Project = { id: string; name: string };
type TeamMember = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

interface TasksClientProps {
  initialTasks: Task[];
  projects: Project[];
  teamMembers: TeamMember[];
  stats: { total: number; completed: number; inProgress: number; todo: number };
  userName: string;
}

const statusColors: Record<Status, string> = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

const statusLabels: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "In Review",
  DONE: "Completed",
};

const priorityColors: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

export function TasksClient({
  initialTasks,
  projects,
  teamMembers,
  stats,
  userName,
}: TasksClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateString = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const filteredTasks =
    filter === "ALL"
      ? initialTasks
      : initialTasks.filter((t) => t.status === filter);

  const handleCreateTask = async (formData: FormData) => {
    startTransition(async () => {
      await createTask(formData);
      setIsCreateOpen(false);
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    const formData = new FormData();
    formData.set("taskId", taskId);
    formData.set("status", newStatus);

    startTransition(async () => {
      await updateTaskStatus(formData);
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const formData = new FormData();
    formData.set("taskId", taskId);

    startTransition(async () => {
      await deleteTask(formData);
      setSelectedTask(null);
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm font-medium">
              {dayName}, {dateString}
            </p>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              {greeting}! {userName?.split(" ")[0] || "there"},
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-full h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 bg-white rounded-full px-8 py-4 w-fit shadow-soft border border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-bold text-lg">{stats.completed}</span>
            <span className="text-muted-foreground text-sm">Completed</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-lg">{stats.inProgress}</span>
            <span className="text-muted-foreground text-sm">In Progress</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-gray-400" />
            <span className="font-bold text-lg">{stats.todo}</span>
            <span className="text-muted-foreground text-sm">To Do</span>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-4xl p-6 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display">My Tasks</h2>
            <span className="text-muted-foreground text-sm">
              ({filteredTasks.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(["ALL", "TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === status
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {status === "ALL" ? "All" : statusLabels[status]}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50/50 rounded-2xl mb-2 text-sm font-medium text-muted-foreground">
          <div className="col-span-5 flex items-center gap-2">
            <span>✎</span> Task Name
          </div>
          <div className="col-span-2 items-center gap-2 hidden md:flex">
            Project
          </div>
          <div className="col-span-2 items-center gap-2 hidden md:flex">
            <Users className="h-4 w-4" /> Assignee
          </div>
          <div className="col-span-2 items-center gap-2 hidden md:flex">
            Priority
          </div>
          <div className="col-span-1 items-center gap-2 hidden md:flex">
            Status
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-muted-foreground font-medium">
                No tasks found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === "ALL"
                  ? "Create your first task to get started"
                  : `No tasks with status "${statusLabels[filter as Status]}"`}
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                variant="outline"
                className="mt-4 rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50/50 rounded-2xl transition-colors items-center border border-transparent hover:border-gray-100 cursor-pointer"
              >
                <div className="col-span-12 md:col-span-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(
                          task.id,
                          task.status === "DONE" ? "TODO" : "DONE",
                        );
                      }}
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === "DONE"
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {task.status === "DONE" && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={`font-medium ${
                        task.status === "DONE"
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2 hidden md:flex">
                  <span className="text-sm text-muted-foreground truncate">
                    {task.project.name}
                  </span>
                </div>
                <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                  {task.assignee ? (
                    <>
                      <Avatar
                        src={task.assignee.image || undefined}
                        fallback={
                          task.assignee.name?.[0] || task.assignee.email[0]
                        }
                        className="h-6 w-6"
                      />
                      <span className="text-sm font-medium hidden lg:inline truncate">
                        {task.assignee.name || task.assignee.email}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </div>
                <div className="col-span-6 md:col-span-2 hidden md:flex">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-6 md:col-span-1 hidden md:flex">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      statusColors[task.status]
                    }`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Create New Task
            </DialogTitle>
            <DialogDescription>
              Add a new task to your project. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreateTask} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Task Title *
              </label>
              <input
                name="title"
                required
                placeholder="What needs to be done?"
                className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Add more details..."
                className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Project *
                </label>
                <select
                  name="projectId"
                  required
                  className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all"
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Assignee
                </label>
                <select
                  name="assigneeId"
                  className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  defaultValue="MEDIUM"
                  className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  type="date"
                  className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Create Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent size="lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedTask.id,
                        selectedTask.status === "DONE" ? "TODO" : "DONE",
                      )
                    }
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedTask.status === "DONE"
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {selectedTask.status === "DONE" && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <DialogTitle
                    className={`text-2xl font-display ${
                      selectedTask.status === "DONE"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {selectedTask.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="mt-2">
                  {selectedTask.description || "No description provided"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Project
                    </p>
                    <p className="font-medium">{selectedTask.project.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Assignee
                    </p>
                    {selectedTask.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={selectedTask.assignee.image || undefined}
                          fallback={
                            selectedTask.assignee.name?.[0] ||
                            selectedTask.assignee.email[0]
                          }
                          className="h-6 w-6"
                        />
                        <span className="font-medium">
                          {selectedTask.assignee.name ||
                            selectedTask.assignee.email}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-400">Unassigned</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Priority
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                        priorityColors[selectedTask.priority]
                      }`}
                    >
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Status
                    </p>
                    <select
                      value={selectedTask.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedTask.id,
                          e.target.value as Status,
                        )
                      }
                      className="rounded-xl bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">In Review</option>
                      <option value="DONE">Completed</option>
                    </select>
                  </div>
                </div>

                {selectedTask.dueDate && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Due Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {new Date(selectedTask.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="rounded-full px-6 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                >
                  Delete Task
                </Button>
                <Button
                  onClick={() => setSelectedTask(null)}
                  className="rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
