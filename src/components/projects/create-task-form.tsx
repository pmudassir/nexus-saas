"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createTask } from "@/actions/projects";

interface Project {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export function CreateTaskForm({ projects, users }: { projects: Project[]; users: User[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: projects[0]?.id || "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    assigneeId: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.title) {
        setError("Title is required");
        return;
    }
    if (!formData.projectId) {
        setError("Project is required");
        return;
    }

    startTransition(async () => {
        try {
            await createTask({
                title: formData.title,
                description: formData.description,
                projectId: formData.projectId,
                priority: formData.priority as any,
                status: formData.status as any,
                dueDate: formData.dueDate,
                assigneeId: formData.assigneeId
            });
            router.push("/projects");
            router.refresh();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to create task");
        }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Task
          </h1>
          <p className="text-muted-foreground">
            Add a new task to your project board.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6 space-y-6">
        {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                {error}
            </div>
        )}

        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Task Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Redesign Homepage"
                    className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Project</label>
                    <select
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="" disabled>Select Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Assignee</label>
                    <select
                        name="assigneeId"
                        value={formData.assigneeId}
                        onChange={handleChange}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Link href="/projects">
                <Button variant="ghost">Cancel</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Creating..." : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Task
                    </>
                )}
            </Button>
        </div>
      </div>
    </div>
  );
}
