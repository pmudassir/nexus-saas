import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Folder } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { updateProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { tenant } = await requireTenantMembership();
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, tenantId: tenant.id },
  });

  if (!project) {
    notFound();
  }

  return (
    <Shell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">
              Update project details and settings.
            </p>
          </div>
        </div>

        <Card className="p-6">
          <form action={updateProject} className="space-y-6">
            <input type="hidden" name="id" value={project.id} />

            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{project.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Created {project.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input name="name" defaultValue={project.name} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={project.description || ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                placeholder="Project description..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={project.status}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href="/projects">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
