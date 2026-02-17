'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createRole(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const name = (formData.get('name') as string)?.trim();
  const featureKeysRaw = formData.get('featureKeys') as string;
  const featureKeys = featureKeysRaw
    ? featureKeysRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  if (!name) return;

  await prisma.customRole.create({
    data: {
      tenantId: tenant.id,
      name,
      featureKeys,
    },
  });

  revalidatePath('/settings/roles');
}

export async function updateRole(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const roleId = formData.get('roleId') as string;
  const name = (formData.get('name') as string)?.trim();
  const featureKeysRaw = formData.get('featureKeys') as string;
  const featureKeys = featureKeysRaw
    ? featureKeysRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  if (!roleId || !name) return;

  await prisma.customRole.update({
    where: { id: roleId, tenantId: tenant.id },
    data: { name, featureKeys },
  });

  revalidatePath('/settings/roles');
}

export async function deleteRole(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const roleId = formData.get('roleId') as string;
  if (!roleId) return;

  // Unassign all members from this role first
  await prisma.tenantUser.updateMany({
    where: { customRoleId: roleId, tenantId: tenant.id },
    data: { customRoleId: null, role: 'TENANT_USER' },
  });

  await prisma.customRole.delete({
    where: { id: roleId, tenantId: tenant.id },
  });

  revalidatePath('/settings/roles');
}

export async function assignRole(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const tenantUserId = formData.get('tenantUserId') as string;
  const customRoleId = formData.get('customRoleId') as string;

  if (!tenantUserId) return;

  if (customRoleId) {
    await prisma.tenantUser.update({
      where: { id: tenantUserId, tenantId: tenant.id },
      data: { customRoleId, role: 'CUSTOM' },
    });
  } else {
    await prisma.tenantUser.update({
      where: { id: tenantUserId, tenantId: tenant.id },
      data: { customRoleId: null, role: 'TENANT_USER' },
    });
  }

  revalidatePath('/settings/team');
  revalidatePath('/settings/roles');
}
