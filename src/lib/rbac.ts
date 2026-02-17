import { prisma } from './prisma';
import { auth } from '@/auth';
import type { TenantRole } from '@prisma/client';
import { getUserPermissions } from './features';
import { cache } from 'react';

export type UserContext = {
  userId: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  // Tenant-scoped fields (null if super admin without tenant context)
  tenantId: string | null;
  tenantName: string | null;
  tenantRole: TenantRole | null;
  customRoleName: string | null;
  allowedFeatures: string[];
  allowedPermissions: string[];
};

/**
 * Get the full user context including role and allowed features.
 * This is the primary function used to determine what the user can see/do.
 */
const getUserContextInternal = cache(async (tenantId?: string): Promise<UserContext | null> => {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user as { id?: string; email?: string; name?: string; isSuperAdmin?: boolean };
  if (!user.id) return null;

  const isSuperAdmin = Boolean(user.isSuperAdmin);

  // If no tenantId provided, return basic context
  if (!tenantId) {
    return {
      userId: user.id,
      email: user.email || '',
      name: user.name || null,
      isSuperAdmin,
      tenantId: null,
      tenantName: null,
      tenantRole: null,
      customRoleName: null,
      allowedFeatures: isSuperAdmin ? getAllFeatureKeys() : [],
      allowedPermissions: [],
    };
  }

  // Get tenant membership
  const membership = await prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId: user.id,
      },
    },
    include: {
      tenant: {
        include: {
          features: { where: { enabled: true } },
        },
      },
      customRole: true,
    },
  });

  // Super admins can access any tenant even without membership
  if (!membership && !isSuperAdmin) {
    return null;
  }

  const tenant = membership?.tenant || await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { features: { where: { enabled: true } } },
  });

  if (!tenant) return null;

  const enabledFeatures = tenant.features.map((f) => f.key);
  const tenantRole = membership?.role || null;
  const customRole = membership?.customRole || null;

  // Compute allowed features based on role
  let allowedFeatures: string[];

  if (isSuperAdmin || tenantRole === 'TENANT_ADMIN') {
    // Super admins and tenant admins see all enabled features
    allowedFeatures = enabledFeatures;
  } else if (tenantRole === 'CUSTOM' && customRole) {
    // Custom role: intersection of tenant-enabled features and role feature allowlist.
    allowedFeatures = customRole.featureKeys.filter((key) =>
      enabledFeatures.includes(key)
    );
  } else {
    // TENANT_USER without custom role: see all enabled features (basic user)
    allowedFeatures = enabledFeatures;
  }

  return {
    userId: user.id,
    email: user.email || '',
    name: user.name || null,
    isSuperAdmin,
    tenantId,
    tenantName: tenant.name,
    tenantRole,
    customRoleName: customRole?.name || null,
    allowedFeatures,
    allowedPermissions: await getUserPermissions(user.id, tenantId),
  };
});

export async function getUserContext(tenantId?: string): Promise<UserContext | null> {
  return getUserContextInternal(tenantId);
}

/**
 * Get all available feature keys.
 */
function getAllFeatureKeys(): string[] {
  return [
    'website_builder',
    'finance',
    'hr',
    'inventory',
    'crm',
    'analytics',
    'projects',
    'automation',
  ];
}

/**
 * Feature key to navigation items mapping.
 * Used by the sidebar to determine which items to show.
 */
export const FEATURE_NAV_MAP: Record<string, { name: string; href: string; icon: string }[]> = {
  projects: [
    { name: 'Projects', href: '/projects', icon: 'Briefcase' },
    { name: 'My Tasks', href: '/tasks', icon: 'CheckSquare' },
  ],
  crm: [
    { name: 'CRM', href: '/crm', icon: 'Users' },
    { name: 'Follow-ups', href: '/crm/today', icon: 'CalendarCheck' },
  ],
  finance: [
    { name: 'Finance', href: '/finance', icon: 'CreditCard' },
  ],
  inventory: [
    { name: 'Inventory', href: '/inventory', icon: 'Box' },
  ],
  hr: [
    { name: 'HR', href: '/hr', icon: 'Layers' },
  ],
  analytics: [
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  ],
  website_builder: [
    { name: 'Site Builder', href: '/builder', icon: 'Globe' },
  ],
  automation: [],
};
