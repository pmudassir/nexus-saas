'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export type LeadField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // For select type
};

// Default fields for all tenants
export const DEFAULT_LEAD_FIELDS: LeadField[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'phone', required: false },
  { key: 'company', label: 'Company', type: 'text', required: false },
  { key: 'source', label: 'Source', type: 'select', required: false, options: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Other'] },
  { key: 'value', label: 'Estimated Value', type: 'number', required: false },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false },
];

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
