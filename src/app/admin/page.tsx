import { Shell } from "@/components/layout/Shell";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { createTenant } from "@/actions/tenants";
import type { Plan, Subscription, Tenant, TenantUser } from "@prisma/client";

type TenantWithRelations = Tenant & {
  subscriptions: (Subscription & { plan: Plan | null })[];
  memberships: TenantUser[];
};

export default async function AdminPage() {
  const [tenantsRaw, plans] = await Promise.all([
    prisma.tenant.findMany({
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
        },
        memberships: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({ orderBy: { priceMonthly: "asc" } }),
  ]);

  const tenants = tenantsRaw as TenantWithRelations[];

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Platform Admin
          </h1>
          <p className="text-slate-400">
            Manage tenants, plans, and platform-wide settings.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Create Tenant</h2>
          <form className="grid gap-4 md:grid-cols-4" action={createTenant}>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="Acme Corp"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Slug
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="acme"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Plan
              </label>
              <select
                name="planId"
                required
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                defaultValue={plans[0]?.id ?? ""}
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-slate-900">
                    {plan.name} (${plan.priceMonthly / 100}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full">
                Create Tenant
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">Tenant</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20 text-slate-100">
              {tenants.map((tenant: TenantWithRelations) => {
                const activeSubscription = tenant.subscriptions.find(
                  (sub: TenantWithRelations["subscriptions"][number]) =>
                    sub.status === "ACTIVE",
                );
                const planName = activeSubscription?.plan?.name ?? "—";
                const usersCount = tenant.memberships.length;

                return (
                  <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{tenant.name}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {tenant.slug}
                    </td>
                    <td className="px-6 py-4 text-slate-200">
                      {tenant.status}
                    </td>
                    <td className="px-6 py-4 text-slate-200">{planName}</td>
                    <td className="px-6 py-4 text-slate-200">{usersCount}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {tenant.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}

              {tenants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400 text-sm"
                  >
                    No tenants found. Create your first tenant from this panel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
