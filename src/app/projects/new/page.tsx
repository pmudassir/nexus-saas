import { Shell } from "@/components/layout/Shell";
import { CreateTaskForm } from "@/components/projects/create-task-form";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export default async function NewTaskPage() {
  const { tenant } = await requireTenantMembership();

  const projects = await prisma.project.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true }
  });

  const tenantUsers = await prisma.tenantUser.findMany({
    where: { tenantId: tenant.id },
    include: { user: true }
  });

  const users = tenantUsers.map(tu => ({
    id: tu.user.id,
    name: tu.user.name,
    email: tu.user.email
  }));

  return (
    <Shell>
      <CreateTaskForm projects={projects} users={users} />
    </Shell>
  );
}
