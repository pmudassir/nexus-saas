import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { updateTask, deleteTask } from "@/actions/tasks";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { tenant } = await requireTenantMembership();
  const { taskId } = await params;

  const [task, users] = await Promise.all([
    prisma.task.findFirst({
      where: { id: taskId, tenantId: tenant.id },
      include: { project: true, assignee: true },
    }),
    prisma.tenantUser.findMany({
      where: { tenantId: tenant.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  if (!task) {
    notFound();
  }

  return (
    <Shell>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
          <h1 className="text-2xl font-bold font-display mb-6">Edit Task</h1>

          <form action={updateTask} className="space-y-6">
            <input type="hidden" name="taskId" value={task.id} />

            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                name="title"
                defaultValue={task.title}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={task.description || ""}
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  name="priority"
                  defaultValue={task.priority}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  name="dueDate"
                  type="date"
                  defaultValue={
                    task.dueDate
                      ? new Date(task.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <select
                name="assigneeId"
                defaultValue={task.assigneeId || ""}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Unassigned</option>
                {users.map((membership) => (
                  <option key={membership.user.id} value={membership.user.id}>
                    {membership.user.name || membership.user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <form action={deleteTask}>
                <input type="hidden" name="taskId" value={task.id} />
                <Button
                  type="submit"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete Task
                </Button>
              </form>

              <Button type="submit" className="bg-black text-white hover:bg-gray-800 px-8">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
