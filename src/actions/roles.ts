'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantPermission } from '@/lib/tenant-auth';
import { PERMISSION_KEYS } from '@/lib/permission-keys';
import { Prisma } from '@prisma/client';

function parseCsv(raw: string | null): string[] {
  return raw
    ? Array.from(new Set(raw.split(',').map((k) => k.trim()).filter(Boolean)))
    : [];
}

export async function createRole(formData: FormData) {
  const { tenant } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);

  const name = (formData.get('name') as string)?.trim();
  const featureKeys = parseCsv((formData.get('featureKeys') as string) || null);
  const permissions = parseCsv((formData.get('permissions') as string) || null);

  if (!name) return;

  try {
    await prisma.customRole.create({
      data: {
        tenantId: tenant.id,
        name,
        featureKeys,
        permissions,
      },
    });
  } catch (error) {
    // Backward compatibility when a stale Prisma client is still running.
    if (
      error instanceof Prisma.PrismaClientValidationError &&
      error.message.includes("Unknown argument `permissions`")
    ) {
      await prisma.customRole.create({
        data: {
          tenantId: tenant.id,
          name,
          featureKeys,
        },
      });
    } else {
      throw error;
    }
  }

  revalidatePath('/settings/roles');
}

export async function updateRole(formData: FormData) {
  const { tenant } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);

  const roleId = formData.get('roleId') as string;
  const name = (formData.get('name') as string)?.trim();
  const featureKeys = parseCsv((formData.get('featureKeys') as string) || null);
  const permissions = parseCsv((formData.get('permissions') as string) || null);

  if (!roleId || !name) return;

  try {
    await prisma.customRole.update({
      where: { id: roleId, tenantId: tenant.id },
      data: { name, featureKeys, permissions },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientValidationError &&
      error.message.includes("Unknown argument `permissions`")
    ) {
      await prisma.customRole.update({
        where: { id: roleId, tenantId: tenant.id },
        data: { name, featureKeys },
      });
    } else {
      throw error;
    }
  }

  revalidatePath('/settings/roles');
}

export async function deleteRole(formData: FormData) {
  const { tenant } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);
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
  const { tenant } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);

  const tenantUserId = formData.get('tenantUserId') as string;
  const customRoleId = formData.get('customRoleId') as string;

  if (!tenantUserId) return;

  if (customRoleId) {
    const customRole = await prisma.customRole.findFirst({
      where: {
        id: customRoleId,
        tenantId: tenant.id,
      },
      select: { id: true },
    });

    if (!customRole) {
      throw new Error('Invalid custom role for this tenant');
    }

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
