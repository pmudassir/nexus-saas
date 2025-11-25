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
  
  const updateData: any = { stage };
  
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
}

export async function updateLeadScore(formData: FormData) {
  const leadId = formData.get('leadId') as string;
  const score = parseInt(formData.get('score') as string);
  
  await prisma.lead.update({
    where: { id: leadId },
    data: { score: Math.min(100, Math.max(0, score)) },
  });

  revalidatePath('/crm/leads');
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
}

export const LEAD_STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'] as const;
export const LEAD_SOURCES = ['WEBSITE', 'REFERRAL', 'COLD_CALL', 'SOCIAL_MEDIA', 'EVENT', 'OTHER'] as const;
export const ACTIVITY_TYPES = ['CALL', 'EMAIL', 'MEETING', 'NOTE'] as const;
