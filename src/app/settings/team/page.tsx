import { Shell } from "@/components/layout/Shell";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { Button } from "@/components/ui/button";
import { inviteUser, removeUser } from "@/actions/team";
import { UserPlus, Mail, Shield, Trash2 } from "lucide-react";

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
    orderBy: { createdAt: "asc" },
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            Team Management
          </h1>
          <p className="text-slate-500 mt-2">
            Invite team members and manage access to your workspace.
          </p>
        </div>

        {/* Invite User Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Member
          </h2>
          <form action={inviteUser} className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Role
              </label>
              <select
                name="role"
                defaultValue="TENANT_USER"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="TENANT_USER" className="bg-white text-slate-900">
                  User
                </option>
                <option
                  value="TENANT_ADMIN"
                  className="bg-white text-slate-900"
                >
                  Admin
                </option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Send Invitation
              </Button>
            </div>
          </form>
        </div>

        {/* Team Members List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Team Members ({tenantUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {tenantUsers.map((tenantUser) => (
              <div
                key={tenantUser.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    {(tenantUser.user.name ||
                      tenantUser.user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {tenantUser.user.name || "Unnamed User"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {tenantUser.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {tenantUser.role === "TENANT_ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        User
                      </span>
                    )}
                  </div>

                  <form action={removeUser}>
                    <input
                      type="hidden"
                      name="tenantUserId"
                      value={tenantUser.id}
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      onClick={(e) => {
                        if (
                          !confirm(
                            `Remove ${
                              tenantUser.user.name || tenantUser.user.email
                            }?`
                          )
                        ) {
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
                <UserPlus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <div className="text-sm text-slate-500">
                  No team members yet
                </div>
                <div className="text-xs text-slate-400 mt-1">
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
