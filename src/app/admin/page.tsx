
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TenantActions } from "./TenantActions";
import { TenantCreationForm } from "./TenantCreationForm";
import { FEATURES } from "@/lib/features";
import Link from "next/link";
import {
  Users,
} from "lucide-react";
import type {
  Plan,
  Subscription,
  Tenant,
  TenantUser,
  TenantFeature,
} from "@prisma/client";

type TenantWithRelations = Tenant & {
  subscriptions: (Subscription & { plan: Plan | null })[];
  memberships: TenantUser[];
  features: TenantFeature[];
};

const FEATURE_LABELS: Record<string, string> = {
  [FEATURES.WEBSITE_BUILDER]: "Builder",
  [FEATURES.FINANCE]: "Finance",
  [FEATURES.HR]: "HR",
  [FEATURES.INVENTORY]: "Inventory",
  [FEATURES.CRM]: "CRM",
  [FEATURES.ANALYTICS]: "Analytics",
  [FEATURES.PROJECTS]: "Projects",
  [FEATURES.AUTOMATION]: "Auto",
};

export default async function AdminPage() {
  const [tenantsRaw, plans, totalUsers] = await Promise.all([
    prisma.tenant.findMany({
      include: {
        subscriptions: {
          include: { plan: true },
        },
        memberships: true,
        features: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({ orderBy: { priceMonthly: "asc" } }),
    prisma.tenantUser.count(),
  ]);

  const tenants = tenantsRaw as TenantWithRelations[];

  // Platform stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "ACTIVE").length;
  const mrr = tenants.reduce((sum, t) => {
    const activeSub = t.subscriptions.find((s) => s.status === "ACTIVE");
    return sum + (activeSub?.plan?.priceMonthly ?? 0);
  }, 0);
  const activeSubscriptions = tenants.filter((t) =>
    t.subscriptions.some((s) => s.status === "ACTIVE")
  ).length;

  const iconMap: Record<string, string> = {
    "Total Tenants": "domain",
    "Total Users": "group",
    "Monthly Revenue": "payments",
    "Active Plans": "credit_card",
  };

  const stats = [
    {
      label: "Total Tenants",
      value: totalTenants,
      sub: `${activeTenants} active`,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Users",
      value: totalUsers,
      sub: "across all tenants",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Monthly Revenue",
      value: `$${(mrr / 100).toLocaleString()}`,
      sub: `${activeSubscriptions} subscriptions`,
      color: "text-[#e9590c]",
      bg: "bg-[#e9590c]/10",
    },
    {
      label: "Active Plans",
      value: plans.length,
      sub: "subscription tiers",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
              Platform Admin
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Manage tenants, monitor billing, and control features across the
              platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/features">
              <Button variant="outline">
                <span className="material-symbols-outlined text-lg mr-2">toggle_on</span> Features
              </Button>
            </Link>
            <Link href="/admin/plans">
              <Button variant="outline">
                <span className="material-symbols-outlined text-lg mr-2">settings</span> Plans
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}
                >
                  <span className="material-symbols-outlined">{iconMap[stat.label]}</span>
                </div>
                <span
                  className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}
                >
                  <span className="material-symbols-outlined text-xs mr-1">north_east</span>
                  View
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Create Tenant */}
        <TenantCreationForm plans={plans} />

        {/* Tenants Table */}
        <div className="bg-white dark:bg-[#24272d] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              All Tenants ({totalTenants})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Tenant</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">$/mo</th>
                  <th className="px-6 py-3">Users</th>
                  <th className="px-6 py-3">Features</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tenants.map((tenant) => {
                  const activeSub = tenant.subscriptions.find(
                    (s) => s.status === "ACTIVE"
                  );
                  const planName = activeSub?.plan?.name ?? "—";
                  const planPrice = activeSub?.plan?.priceMonthly ?? 0;
                  const usersCount = tenant.memberships.length;
                  const enabledFeatures = tenant.features.filter(
                    (f) => f.enabled
                  );

                  return (
                    <tr
                      key={tenant.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {tenant.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {tenant.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            tenant.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : tenant.status === "SUSPENDED"
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{planName}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        ${(planPrice / 100).toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          {usersCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {enabledFeatures.map((f) => (
                            <span
                              key={f.key}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {FEATURE_LABELS[f.key] || f.key}
                            </span>
                          ))}
                          {enabledFeatures.length === 0 && (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {tenant.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TenantActions tenant={tenant} />
                      </td>
                    </tr>
                  );
                })}

                {tenants.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-slate-400 text-sm"
                    >
                      <span className="material-symbols-outlined text-5xl text-slate-200 block mx-auto mb-3">domain</span>
                      No tenants found. Create your first tenant above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
