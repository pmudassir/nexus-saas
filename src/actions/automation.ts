'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

const TRIGGER_ACTIONS: Record<string, { trigger: string; action: string }> = {
  'new-lead': { trigger: 'New Contact Created', action: 'Send Email Notification' },
  'invoice-overdue': { trigger: 'Invoice Due Date Passed', action: 'Send Reminder Email' },
  'task-completed': { trigger: 'Task Marked Complete', action: 'Notify Project Owner' },
  'low-stock': { trigger: 'Product Stock Low', action: 'Create Purchase Order Alert' },
  'leave-approved': { trigger: 'Leave Request Approved', action: 'Notify HR and Employee' },
};

export async function createAutomation(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();
  const userId = (session.user as { id: string }).id;

  const name = formData.get('name') as string;
  const triggerType = formData.get('triggerType') as string;

  if (!name || !triggerType) {
    throw new Error('Name and trigger type are required');
  }

  const triggerAction = TRIGGER_ACTIONS[triggerType];
  if (!triggerAction) {
    throw new Error('Invalid trigger type');
  }

  await prisma.automation.create({
    data: {
      name,
      trigger: triggerAction.trigger,
      action: triggerAction.action,
      isActive: true,
      tenantId: tenant.id,
      creatorId: userId,
    },
  });

  revalidatePath('/automation');
}

export async function toggleAutomation(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const id = formData.get('id') as string;
  if (!id) throw new Error('Automation ID is required');

  const automation = await prisma.automation.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!automation) throw new Error('Automation not found');

  await prisma.automation.update({
    where: { id },
    data: {
      isActive: !automation.isActive,
    },
  });

  revalidatePath('/automation');
}

export async function deleteAutomation(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const id = formData.get('id') as string;
  if (!id) throw new Error('Automation ID is required');

  const automation = await prisma.automation.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!automation) throw new Error('Automation not found');

  await prisma.automation.delete({ where: { id } });

  revalidatePath('/automation');
}

export async function getAutomationTriggers() {
  return Object.entries(TRIGGER_ACTIONS).map(([key, value]) => ({
    id: key,
    label: `${value.trigger} → ${value.action}`,
    ...value,
  }));
}
