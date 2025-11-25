'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Update tenant branding settings
 */
export async function updateBranding(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const primaryColor = (formData.get('primaryColor') as string) || null;
  const secondaryColor = (formData.get('secondaryColor') as string) || null;
  const logoUrl = (formData.get('logoUrl') as string) || null;

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      primaryColor,
      secondaryColor,
      logoUrl,
    },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'BRANDING_UPDATED',
      entity: 'Tenant',
      entityId: tenant.id,
      metadata: { primaryColor, secondaryColor, logoUrl },
    },
  });

  revalidatePath('/settings/branding');
  revalidatePath('/');
}

/**
 * Update tenant general settings
 */
export async function updateTenantSettings(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const name = (formData.get('name') as string).trim();

  if (!name) {
    throw new Error('Tenant name is required');
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { name },
  });

  revalidatePath('/settings');
}
