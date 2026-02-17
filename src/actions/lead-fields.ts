'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { type LeadField, DEFAULT_LEAD_FIELDS } from '@/types/lead-fields';

export async function getLeadFieldConfig(): Promise<LeadField[]> {
  const { tenant } = await requireTenantMembership();

  const config = await prisma.leadFieldConfig.findUnique({
    where: { tenantId: tenant.id },
  });

  if (!config) {
    return DEFAULT_LEAD_FIELDS;
  }

  return config.fields as LeadField[];
}

export async function saveLeadFieldConfig(fields: LeadField[]) {
  const { tenant } = await requireTenantMembership();

  await prisma.leadFieldConfig.upsert({
    where: { tenantId: tenant.id },
    update: { fields: JSON.parse(JSON.stringify(fields)) },
    create: {
      tenantId: tenant.id,
      fields: JSON.parse(JSON.stringify(fields)),
    },
  });

  revalidatePath('/settings/lead-fields');
  revalidatePath('/crm');
}
