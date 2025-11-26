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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Platform Admin
          </h1>
          <p className="text-muted-foreground">
            Manage tenants, plans, and platform-wide settings.
          </p>
        </div>

        <div className="rounded-md border border-border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Create Tenant
          </h2>
          <form className="grid gap-4 md:grid-cols-4" action={createTenant}>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Acme Corp"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Slug
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="acme"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Plan
              </label>
              <select
                name="planId"
                required
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                defaultValue={plans[0]?.id ?? ""}
              >
                {plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    className="bg-white text-foreground"
                  >
                    {plan.name} (${plan.priceMonthly / 100}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Create Tenant
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-md border border-border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Tenant</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white text-foreground">
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
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-foreground font-medium">
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {tenant.slug}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {tenant.status}
                    </td>
                    <td className="px-6 py-4 text-foreground">{planName}</td>
                    <td className="px-6 py-4 text-foreground">{usersCount}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {tenant.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}

              {tenants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-muted-foreground text-sm"
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
