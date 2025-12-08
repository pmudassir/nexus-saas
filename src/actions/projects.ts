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
