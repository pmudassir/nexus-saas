import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { inviteUser, removeUser } from '@/actions/team';
import { UserPlus, Mail, Shield, Trash2 } from 'lucide-react';

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
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            Team Management
          </h1>
          <p className="text-slate-400 mt-2">
            Invite team members and manage access to your workspace.
          </p>
        </div>

        {/* Invite User Form */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Member
          </h2>
          <form action={inviteUser} className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Role
              </label>
              <select
                name="role"
                defaultValue="TENANT_USER"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                <option value="TENANT_USER" className="bg-slate-900">
                  User
                </option>
                <option value="TENANT_ADMIN" className="bg-slate-900">
                  Admin
                </option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Send Invitation
              </Button>
            </div>
          </form>
        </div>

        {/* Team Members List */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 bg-white/5 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">
              Team Members ({tenantUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {tenantUsers.map((tenantUser) => (
              <div
                key={tenantUser.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {(tenantUser.user.name || tenantUser.user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {tenantUser.user.name || 'Unnamed User'}
                    </div>
                    <div className="text-sm text-slate-400">
                      {tenantUser.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {tenantUser.role === 'TENANT_ADMIN' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                        User
                      </span>
                    )}
                  </div>

                  <form action={removeUser}>
                    <input type="hidden" name="tenantUserId" value={tenantUser.id} />
                    <button
                      type="submit"
                      className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        if (!confirm(`Remove ${tenantUser.user.name || tenantUser.user.email}?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {tenantUsers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <UserPlus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <div className="text-sm text-slate-400">No team members yet</div>
                <div className="text-xs text-slate-500 mt-1">
                  Invite your first team member above
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
