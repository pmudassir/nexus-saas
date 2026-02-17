import { prisma } from './prisma';
import { cache } from 'react';

// Default feature definitions
export const FEATURES = {
  WEBSITE_BUILDER: 'website_builder',
  FINANCE: 'finance',
  HR: 'hr',
  INVENTORY: 'inventory',
  CRM: 'crm',
  ANALYTICS: 'analytics',
  PROJECTS: 'projects',
  AUTOMATION: 'automation',
} as const;

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];

const getTenantUserWithPermissions = cache(async (userId: string, tenantId: string) => {
  return prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId,
      },
    },
    include: {
      customRole: true,
      permissions: {
        where: {
          granted: true,
        },
        include: {
          permission: true,
        },
      },
    },
  });
});

const getAllPermissionKeys = cache(async () => {
  const allPermissions = await prisma.permission.findMany({
    select: { key: true },
  });
  return allPermissions.map((p) => p.key);
});

// Default feature configurations
export const DEFAULT_FEATURE_CONFIG = {
  [FEATURES.WEBSITE_BUILDER]: {
    maxPages: 50,
    maxBlocksPerPage: 100,
    customDomain: false,
  },
  [FEATURES.FINANCE]: {
    maxInvoices: 1000,
    multiCurrency: false,
  },
  [FEATURES.HR]: {
    maxEmployees: 100,
  },
  [FEATURES.INVENTORY]: {
    maxProducts: 1000,
  },
  [FEATURES.CRM]: {
    maxContacts: 5000,
  },
  [FEATURES.ANALYTICS]: {
    advancedReports: false,
  },
  [FEATURES.PROJECTS]: {
    maxProjects: 50,
  },
  [FEATURES.AUTOMATION]: {
    maxAutomations: 20,
  },
};

/**
 * Get feature configuration for a tenant
 */
export async function getFeatureConfig(
  tenantId: string,
  featureKey: FeatureKey,
) {
  const feature = await prisma.tenantFeature.findUnique({
    where: {
      tenantId_key: {
        tenantId,
        key: featureKey,
      },
    },
  });

  if (!feature) {
    return null;
  }

  return {
    enabled: feature.enabled,
    config: feature.config || DEFAULT_FEATURE_CONFIG[featureKey] || {},
    metadata: feature.metadata || {},
  };
}

/**
 * Check if a feature is enabled for a tenant
 */
export async function isFeatureEnabled(
  tenantId: string,
  featureKey: FeatureKey,
): Promise<boolean> {
  const feature = await prisma.tenantFeature.findUnique({
    where: {
      tenantId_key: {
        tenantId,
        key: featureKey,
      },
    },
  });

  return feature?.enabled ?? false;
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  userId: string,
  tenantId: string,
  permissionKey: string,
): Promise<boolean> {
  const tenantUser = await getTenantUserWithPermissions(userId, tenantId);

  if (!tenantUser) {
    return false;
  }

  // Tenant admins have all permissions
  if (tenantUser.role === 'TENANT_ADMIN') {
    return true;
  }

  if (
    tenantUser.role === 'CUSTOM' &&
    tenantUser.customRole &&
    tenantUser.customRole.permissions.includes(permissionKey)
  ) {
    return true;
  }

  // Check if user has the specific permission
  const hasPermissionGrant = tenantUser.permissions.some(
    (rp) => rp.permission.key === permissionKey && rp.granted,
  );

  return hasPermissionGrant;
}

/**
 * Get all permissions for a user in a tenant
 */
export async function getUserPermissions(userId: string, tenantId: string) {
  const tenantUser = await getTenantUserWithPermissions(userId, tenantId);

  if (!tenantUser) {
    return [];
  }

  // Tenant admins get all permissions
  if (tenantUser.role === 'TENANT_ADMIN') {
    return getAllPermissionKeys();
  }

  const directPermissions = tenantUser.permissions.map((rp) => rp.permission.key);
  const rolePermissions =
    tenantUser.role === 'CUSTOM' && tenantUser.customRole
      ? tenantUser.customRole.permissions
      : [];

  return Array.from(new Set([...directPermissions, ...rolePermissions]));
}

/**
 * Enable/disable all default features for a new tenant
 */
export async function initializeTenantFeatures(
  tenantId: string,
  enabledFeatures: FeatureKey[] = Object.values(FEATURES),
) {
  const features = Object.values(FEATURES).map((key) => ({
    tenantId,
    key,
    enabled: enabledFeatures.includes(key as FeatureKey),
    config: DEFAULT_FEATURE_CONFIG[key as FeatureKey] || {},
  }));

  await prisma.tenantFeature.createMany({
    data: features,
    skipDuplicates: true,
  });
}
