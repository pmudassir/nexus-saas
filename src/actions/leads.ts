'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

// Lead Management
export async function createLead(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  
  await prisma.lead.create({
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      company: formData.get('company') as string || null,
      source: formData.get('source') as string || null,
      value: formData.get('value') ? parseFloat(formData.get('value') as string) : null,
      tenantId: tenant.id,
    },
  });

  revalidatePath('/crm/leads');
}

export async function updateLeadStage(formData: FormData) {
  const leadId = formData.get('leadId') as string;
  const stage = formData.get('stage') as string;
  
  const updateData: Record<string, unknown> = { stage };
  
  if (stage === 'WON') {
    updateData.wonDate = new Date();
  } else if (stage === 'LOST') {
    updateData.lostReason = formData.get('lostReason') as string;
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
  });

  revalidatePath('/crm/leads');
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function updateLeadScore(formData: FormData) {
  const leadId = formData.get('leadId') as string;
  const score = parseInt(formData.get('score') as string);
  
  await prisma.lead.update({
    where: { id: leadId },
    data: { score: Math.min(100, Math.max(0, score)) },
  });

  revalidatePath('/crm/leads');
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function addLeadActivity(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  
  await prisma.leadActivity.create({
    data: {
      leadId: formData.get('leadId') as string,
      type: formData.get('type') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string || null,
      tenantId: tenant.id,
    },
  });

  revalidatePath('/crm/leads');
  revalidatePath(`/crm/leads/${formData.get('leadId')}`);
}

export async function scheduleFollowUp(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const leadId = formData.get('leadId') as string;
  const type = formData.get('type') as string;
  const subject = formData.get('subject') as string;
  const description = (formData.get('description') as string) || null;
  const dueDateStr = formData.get('dueDate') as string;

  if (!leadId || !type || !subject || !dueDateStr) {
    throw new Error('Lead, type, subject, and due date are required');
  }

  await prisma.leadActivity.create({
    data: {
      leadId,
      type,
      subject,
      description,
      dueDate: new Date(dueDateStr),
      completed: false,
      tenantId: tenant.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'FOLLOW_UP_SCHEDULED',
      entity: 'LeadActivity',
      metadata: { leadId, type, subject, dueDate: dueDateStr },
    },
  });

  revalidatePath('/crm/leads');
  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath('/crm/today');
}

export async function completeActivity(formData: FormData) {
  const activityId = formData.get('activityId') as string;

  if (!activityId) {
    throw new Error('Activity ID is required');
  }

  const activity = await prisma.leadActivity.update({
    where: { id: activityId },
    data: { completed: true },
  });

  revalidatePath('/crm/leads');
  revalidatePath(`/crm/leads/${activity.leadId}`);
  revalidatePath('/crm/today');
}

export async function deleteLead(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const leadId = formData.get('leadId') as string;

  if (!leadId) {
    throw new Error('Lead ID is required');
  }

  // Delete activities first (cascade)
  await prisma.leadActivity.deleteMany({ where: { leadId } });
  
  await prisma.lead.delete({ where: { id: leadId } });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'LEAD_DELETED',
      entity: 'Lead',
      entityId: leadId,
    },
  });

  revalidatePath('/crm/leads');
}
