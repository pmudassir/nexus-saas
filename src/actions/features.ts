'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { initializeTenantFeatures } from '@/lib/features';
import { requireSuperAdmin } from '@/lib/admin-auth';

/**
 * Toggle a feature for a tenant
 */
export async function toggleFeature(formData: FormData) {
  await requireSuperAdmin();

  const tenantId = formData.get('tenantId') as string;
  const featureKey = formData.get('featureKey') as string;
  const enabled = formData.get('enabled') === 'true';

  if (!tenantId || !featureKey) {
    throw new Error('Missing required fields');
  }

  await prisma.tenantFeature.upsert({
    where: {
      tenantId_key: {
        tenantId,
        key: featureKey,
      },
    },
    update: {
      enabled: !enabled, // Toggle
    },
    create: {
      tenantId,
      key: featureKey,
      enabled: !enabled,
    },
  });

  revalidatePath('/admin/features');
}

export async function updateFeatureConfig(
  tenantId: string,
  featureKey: string,
  config: Record<string, unknown>,
) {
  await requireSuperAdmin();

  await prisma.tenantFeature.upsert({
    where: {
      tenantId_key: {
        tenantId,
        key: featureKey,
      },
    },
    update: {
      config: config as never, // Type cast for Prisma JSON
    },
    create: {
      tenantId,
      key: featureKey,
      enabled: true,
      config: config as never,
    },
  });

  revalidatePath('/admin/features');
}

/**
 * Get all tenants with their features
 */
export async function getTenantsFeatures() {
  await requireSuperAdmin();

  const tenants = await prisma.tenant.findMany({
    include: {
      features: {
        orderBy: {
          key: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return tenants;
}

/**
 * Initialize features for a tenant
 */
export async function initializeFeatures(tenantId: string) {
  await requireSuperAdmin();
  await initializeTenantFeatures(tenantId);
}
