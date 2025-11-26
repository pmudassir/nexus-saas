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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Platform Admin
          </h1>
          <p className="text-slate-500">
            Manage tenants, plans, and platform-wide settings.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Create Tenant
          </h2>
          <form className="grid gap-4 md:grid-cols-4" action={createTenant}>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Acme Corp"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Slug
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="acme"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Plan
              </label>
              <select
                name="planId"
                required
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                defaultValue={plans[0]?.id ?? ""}
              >
                {plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    className="bg-white text-slate-900"
                  >
                    {plan.name} (${plan.priceMonthly / 100}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Create Tenant
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Tenant</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              {tenants.map((tenant: TenantWithRelations) => {
                const activeSubscription = tenant.subscriptions.find(
                  (sub: TenantWithRelations["subscriptions"][number]) =>
                    sub.status === "ACTIVE"
                );
                const planName = activeSubscription?.plan?.name ?? "—";
                const usersCount = tenant.memberships.length;

                return (
                  <tr
                    key={tenant.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {tenant.slug}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {tenant.status}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{planName}</td>
                    <td className="px-6 py-4 text-slate-700">{usersCount}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {tenant.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}

              {tenants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500 text-sm"
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
