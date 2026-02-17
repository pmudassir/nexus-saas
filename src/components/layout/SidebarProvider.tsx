import { auth } from '@/auth';
import { getCurrentTenant } from '@/lib/tenant';
import { getUserContext } from '@/lib/rbac';
import { Sidebar } from './Sidebar';

export type SidebarContext = {
  userName: string;
  userEmail: string;
  tenantName: string;
  tenantRole: string;
  customRoleName: string | null;
  allowedFeatures: string[];
  allowedPermissions: string[];
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

  const userContext = await getUserContext(tenant.id);
  if (!userContext) return null;

  const tenantRole = userContext.tenantRole || (isSuperAdmin ? 'TENANT_ADMIN' : 'TENANT_USER');

  const ctx: SidebarContext = {
    userName: user.name || user.email || 'User',
    userEmail: user.email || '',
    tenantName: userContext.tenantName || tenant.name,
    tenantRole,
    customRoleName: userContext.customRoleName,
    allowedFeatures: userContext.allowedFeatures,
    allowedPermissions: userContext.allowedPermissions,
    isSuperAdmin: userContext.isSuperAdmin,
  };

  return <Sidebar context={ctx} />;
}
