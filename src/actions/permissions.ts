'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Update permissions for a tenant user
 */
export async function updateUserPermissions(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const tenantUserId = formData.get('tenantUserId') as string;
  const permissionKeys = formData.getAll('permissions') as string[];

  if (!tenantUserId) {
    throw new Error('Tenant user ID is required');
  }

  // Verify the tenant user belongs to this tenant
  const tenantUser = await prisma.tenantUser.findUnique({
    where: { id: tenantUserId },
  });

  if (!tenantUser || tenantUser.tenantId !== tenant.id) {
    throw new Error('Unauthorized');
  }

  // Delete existing permissions
  await prisma.rolePermission.deleteMany({
    where: { tenantUserId },
  });

  // Create new permissions
  if (permissionKeys.length > 0) {
    const permissions = await prisma.permission.findMany({
      where: {
        key: { in: permissionKeys },
      },
    });

    await prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        tenantUserId,
        permissionId: permission.id,
        granted: true,
      })),
    });
  }

  revalidatePath('/settings/permissions');
}

/**
 * Get all available permissions grouped by module
 */
export async function getAvailablePermissions() {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ module: 'asc' }, { action: 'asc' }],
  });

  // Group by module
  const grouped = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, typeof permissions>,
  );

  return grouped;
}

/**
 * Get user permissions for a tenant user
 */
export async function getUserPermissions(tenantUserId: string) {
  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      tenantUserId,
      granted: true,
    },
    include: {
      permission: true,
    },
  });

  return rolePermissions.map((rp) => rp.permission.key);
}

/**
 * Update tenant user role
 */
export async function updateUserRole(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const tenantUserId = formData.get('tenantUserId') as string;
  const role = formData.get('role') as 'TENANT_ADMIN' | 'TENANT_USER' | 'CUSTOM';

  if (!tenantUserId || !role) {
    throw new Error('Missing required fields');
  }

  // Verify the tenant user belongs to this tenant
  const tenantUser = await prisma.tenantUser.findUnique({
    where: { id: tenantUserId },
  });

  if (!tenantUser || tenantUser.tenantId !== tenant.id) {
    throw new Error('Unauthorized');
  }

  await prisma.tenantUser.update({
    where: { id: tenantUserId },
    data: { role },
  });

  revalidatePath('/settings/permissions');
}
