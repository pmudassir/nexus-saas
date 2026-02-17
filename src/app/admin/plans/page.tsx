import { getPlans, createPlan, deletePlan } from "@/actions/plans";
import { getAllTenantsUsage } from "@/actions/usage";

import { Button } from "@/components/ui/button";
import { Settings, Plus, Trash2, Users, Briefcase, DollarSign } from "lucide-react";

export default async function PlansAdminPage() {
  const plans = await getPlans();
  const tenantsUsage = await getAllTenantsUsage();

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Plan Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage subscription plans for your tenants.
          </p>
        </div>

        {/* Create Plan Form */}
        <div className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Plan
          </h2>
          <form action={createPlan} className="grid gap-4 md:grid-cols-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Plan Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Professional"
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Price ($/mo)
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="79"
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Max Users
              </label>
              <input
                type="number"
                name="maxUsers"
                placeholder="20"
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Max Storage (GB)
              </label>
              <input
                type="number"
                name="maxStorage"
                placeholder="100"
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
                Create Plan
              </Button>
            </div>
          </form>
        </div>

        {/* Existing Plans */}
        <div className="rounded-md border border-border bg-white shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Existing Plans</h2>
          </div>
          <div className="divide-y divide-border">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${plan.priceMonthly}/mo • {plan._count.subscriptions} subscribers
                    </div>
                  </div>
                </div>
                <form action={deletePlan}>
                  <input type="hidden" name="planId" value={plan.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No plans created yet. Create your first plan above.
              </div>
            )}
          </div>
        </div>

        {/* Usage Overview */}
        <div className="rounded-md border border-border bg-white shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Tenant Usage Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Tenant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    <Users className="h-4 w-4 inline mr-1" /> Users
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    <Briefcase className="h-4 w-4 inline mr-1" /> Projects
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenantsUsage.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{t.plan}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{t.users}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{t.projects}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
