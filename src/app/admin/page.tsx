
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TenantActions } from "./TenantActions";
import { TenantCreationForm } from "./TenantCreationForm";
import { FEATURES } from "@/lib/features";
import Link from "next/link";
import {
  Users,
  Building2,
  DollarSign,
  CreditCard,
  Settings,
  ToggleRight,
  ArrowUpRight,
  Shield,
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

  const stats = [
    {
      label: "Total Tenants",
      value: totalTenants,
      sub: `${activeTenants} active`,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Users",
      value: totalUsers,
      sub: "across all tenants",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Monthly Revenue",
      value: `$${(mrr / 100).toLocaleString()}`,
      sub: `${activeSubscriptions} subscriptions`,
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Active Plans",
      value: plans.length,
      sub: "subscription tiers",
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
              <Shield className="w-9 h-9" />
              Platform Admin
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage tenants, monitor billing, and control features across the
              platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/features">
              <Button
                variant="ghost"
                className="rounded-full h-11 px-5 font-medium bg-white shadow-soft hover:shadow-soft-lg"
              >
                <ToggleRight className="h-4 w-4 mr-2" /> Features
              </Button>
            </Link>
            <Link href="/admin/plans">
              <Button
                variant="ghost"
                className="rounded-full h-11 px-5 font-medium bg-white shadow-soft hover:shadow-soft-lg"
              >
                <Settings className="h-4 w-4 mr-2" /> Plans
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div
                  className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <span
                  className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  View
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold font-display text-foreground mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Create Tenant */}
        <TenantCreationForm plans={plans} />

        {/* Tenants Table */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display">
              All Tenants ({totalTenants})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
              <tbody className="divide-y divide-gray-100 text-foreground">
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
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-foreground">
                            {tenant.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
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
                      <td className="px-6 py-4 text-muted-foreground text-xs">
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
                      className="px-6 py-16 text-center text-muted-foreground text-sm"
                    >
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
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
