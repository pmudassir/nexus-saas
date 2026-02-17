import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getCurrentTenant } from '@/lib/tenant';
import { Sidebar } from './Sidebar';

export type SidebarContext = {
  userName: string;
  userEmail: string;
  tenantName: string;
  tenantRole: string;
  customRoleName: string | null;
  allowedFeatures: string[];
  isSuperAdmin: boolean;
};

export async function SidebarProvider() {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user as {
    id?: string;
    email?: string;
    name?: string;
    isSuperAdmin?: boolean;
  };
  if (!user.id) return null;

  const isSuperAdmin = Boolean(user.isSuperAdmin);

  // Get current tenant
  const tenant = await getCurrentTenant('app', user.id);
  if (!tenant) return null;

  // Get membership with custom role
  const membership = await prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: user.id,
      },
    },
    include: {
      customRole: true,
    },
  });

  // Get tenant's enabled features
  const enabledFeatures = await prisma.tenantFeature.findMany({
    where: { tenantId: tenant.id, enabled: true },
    select: { key: true },
  });
  const enabledFeatureKeys = enabledFeatures.map((f) => f.key);

  // Compute allowed features
  let allowedFeatures: string[];
  const tenantRole = membership?.role || (isSuperAdmin ? 'TENANT_ADMIN' : null);

  if (isSuperAdmin || tenantRole === 'TENANT_ADMIN') {
    allowedFeatures = enabledFeatureKeys;
  } else if (tenantRole === 'CUSTOM' && membership?.customRole) {
    allowedFeatures = membership.customRole.featureKeys.filter((key) =>
      enabledFeatureKeys.includes(key)
    );
  } else {
    // TENANT_USER default — see all enabled features
    allowedFeatures = enabledFeatureKeys;
  }

  const ctx: SidebarContext = {
    userName: user.name || user.email || 'User',
    userEmail: user.email || '',
    tenantName: tenant.name,
    tenantRole: tenantRole || 'TENANT_USER',
    customRoleName: membership?.customRole?.name || null,
    allowedFeatures,
    isSuperAdmin,
  };

  return <Sidebar context={ctx} />;
}
