'use server';

import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import type { Priority, Status } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assigneeId?: string;
}) {
  const { session, tenant } = await requireTenantMembership();
  const userId = session.user?.id;

  if (!userId) throw new Error('User ID not found');

  if (!data.title) throw new Error('Title is required');
  if (!data.projectId) throw new Error('Project is required');

  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      projectId: data.projectId,
      assigneeId: data.assigneeId || undefined,
      tenantId: tenant.id,
      creatorId: userId,
    },
  });

  redirect('/projects');
}

export async function createProject(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();
  const userId = (session.user as { id: string })?.id;

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) throw new Error('Project name is required');

  await prisma.project.create({
    data: {
      name,
      description: description || null,
      status: 'ACTIVE',
      tenantId: tenant.id,
      ownerId: userId,
    },
  });

  redirect('/projects');
}

export async function deleteProject(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const id = formData.get('id') as string;

  if (!id) throw new Error('Project ID is required');

  const project = await prisma.project.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!project) throw new Error('Project not found');

  // Delete all tasks in the project first
  await prisma.task.deleteMany({
    where: { projectId: id },
  });

  // Then delete the project
  await prisma.project.delete({
    where: { id },
  });

  redirect('/projects');
}
