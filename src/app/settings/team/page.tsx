import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { inviteUser } from '@/actions/team';
import { assignRole } from '@/actions/roles';
import { UserPlus, Mail, Shield } from 'lucide-react';
import { RemoveUserButton } from './RemoveUserButton';
import { removeUser } from '@/actions/team';

export default async function TeamPage() {
  const { tenant } = await requireTenantMembership();

  const tenantUsers = await prisma.tenantUser.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      customRole: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Get custom roles for the role assignment dropdown
  const customRoles = await prisma.customRole.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: 'asc' },
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            Team Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Invite team members and manage access to your workspace.
          </p>
        </div>

        {/* Invite User Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Add New Member
          </h2>
          <form action={inviteUser} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                Role
              </label>
              <select
                name="role"
                defaultValue="TENANT_USER"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
              >
                <option value="TENANT_ADMIN">Admin</option>
                <option value="TENANT_USER">User</option>
                {customRoles.map((role) => (
                  <option key={role.id} value={`CUSTOM:${role.id}`}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full rounded-full bg-black text-white hover:bg-gray-800 h-10 shadow-md font-medium"
              >
                Add Member
              </Button>
            </div>
          </form>
        </div>

        {/* Team Members List */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-soft overflow-hidden">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-foreground">
              Team Members ({tenantUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {tenantUsers.map((tenantUser) => (
              <div
                key={tenantUser.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    {(tenantUser.user.name || tenantUser.user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {tenantUser.user.name || 'Unnamed User'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tenantUser.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role badge */}
                  {tenantUser.role === 'TENANT_ADMIN' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  ) : tenantUser.role === 'CUSTOM' && tenantUser.customRole ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                      {tenantUser.customRole.name}
                    </span>
                  ) : (
                    <form action={assignRole} className="flex items-center">
                      <input type="hidden" name="tenantUserId" value={tenantUser.id} />
                      <select
                        name="customRoleId"
                        defaultValue={tenantUser.customRoleId || ''}
                        className="text-xs rounded-lg bg-gray-50 border border-gray-200 px-2 py-1 font-medium"
                      >
                        <option value="">User</option>
                        {customRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="submit"
                        variant="ghost"
                        className="ml-1 h-7 px-2 text-xs"
                      >
                        Set
                      </Button>
                    </form>
                  )}

                  <RemoveUserButton
                    tenantUserId={tenantUser.id}
                    userName={tenantUser.user.name || tenantUser.user.email}
                    removeUser={removeUser}
                  />
                </div>
              </div>
            ))}

            {tenantUsers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <UserPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <div className="text-sm text-muted-foreground">
                  No team members yet
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  Add your first team member above
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
