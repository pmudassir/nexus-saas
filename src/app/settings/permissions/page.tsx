import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import {
  updateUserPermissions,
  updateUserRole,
  getAvailablePermissions,
  getUserPermissions,
} from '@/actions/permissions';
import { Shield, Users, Check } from 'lucide-react'

;

type TenantUserWithRelations = {
  id: string;
  role: 'TENANT_ADMIN' | 'TENANT_USER' | 'CUSTOM';
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  permissions: Array<{
    permission: {
      key: string;
    };
  }>;
};

export default async function PermissionsPage() {
  const { tenant } = await requireTenantMembership();

  const tenantUsersRaw = await prisma.tenantUser.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      permissions: {
        where: { granted: true },
        include: {
          permission: {
            select: {
              key: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const tenantUsers = tenantUsersRaw as unknown as TenantUserWithRelations[];
  const availablePermissions = await getAvailablePermissions();

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Permissions & Roles
          </h1>
          <p className="text-slate-400 mt-2">
            Manage team member access and permissions. Admins have full access,
            while custom roles can be configured with granular permissions.
          </p>
        </div>

        {/* Team Members List */}
        <div className="grid gap-4">
          {tenantUsers.map((tenantUser) => {
            const userPermissionKeys = tenantUser.permissions.map(
              (p) => p.permission.key,
            );
            const isAdmin = tenantUser.role === 'TENANT_ADMIN';

            return (
              <div
                key={tenantUser.id}
                className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {(tenantUser.user.name || tenantUser.user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {tenantUser.user.name || 'Unnamed User'}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {tenantUser.user.email}
                      </p>
                      <div className="mt-2">
                        <form action={updateUserRole} className="inline-block">
                          <input
                            type="hidden"
                            name="tenantUserId"
                            value={tenantUser.id}
                          />
                          <select
                            name="role"
                            defaultValue={tenantUser.role}
                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                            className="rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                          >
                            <option value="TENANT_ADMIN" className="bg-slate-900">
                              Admin (Full Access)
                            </option>
                            <option value="TENANT_USER" className="bg-slate-900">
                              User (Read Only)
                            </option>
                            <option value="CUSTOM" className="bg-slate-900">
                              Custom Permissions
                            </option>
                          </select>
                        </form>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      Full Access
                    </div>
                  )}
                </div>

                {/* Permission Matrix */}
                {tenantUser.role === 'CUSTOM' && (
                  <form action={updateUserPermissions} className="mt-6">
                    <input
                      type="hidden"
                      name="tenantUserId"
                      value={tenantUser.id}
                    />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Custom Permissions
                      </h4>

                      <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(availablePermissions).map(
                          ([module, permissions]) => (
                            <div
                              key={module}
                              className="rounded-lg bg-black/20 border border-white/5 p-4"
                            >
                              <h5 className="text-xs font-semibold text-white uppercase tracking-wide mb-3">
                                {module}
                              </h5>
                              <div className="space-y-2">
                                {permissions.map((permission) => {
                                  const isChecked =
                                    userPermissionKeys.includes(permission.key);
                                  return (
                                    <label
                                      key={permission.key}
                                      className="flex items-center gap-3 cursor-pointer group"
                                    >
                                      <input
                                        type="checkbox"
                                        name="permissions"
                                        value={permission.key}
                                        defaultChecked={isChecked}
                                        className="w-4 h-4 rounded border-white/20 bg-black/30 text-indigo-500 focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-0"
                                      />
                                      <div className="flex-1">
                                        <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                          {permission.description || permission.action}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">
                                          {permission.key}
                                        </div>
                                      </div>
                                      {isChecked && (
                                        <Check className="w-4 h-4 text-emerald-400" />
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button type="submit">Save Permissions</Button>
                    </div>
                  </form>
                )}

                {isAdmin && (
                  <div className="mt-4 text-sm text-slate-400">
                    <p className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admins have access to all features and permissions
                      automatically.
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {tenantUsers.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Team Members Yet
              </h3>
              <p className="text-sm text-slate-400">
                Invite team members to collaborate on your workspace.
              </p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
