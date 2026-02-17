"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { requireSuperAdmin } from "@/lib/admin-auth";

export interface UsageStats {
  storage: { used: number; limit: number; unit: string };
  users: { count: number; limit: number };
  projects: { count: number };
  contacts: { count: number };
  invoices: { count: number };
}

export async function getTenantUsage(): Promise<UsageStats> {
  const { tenant } = await requireTenantMembership();

  // Get subscription and plan limits
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: tenant.id, status: "ACTIVE" },
    include: { plan: true },
  });

  const plan = subscription?.plan;

  // Get counts
  const [userCount, projectCount, contactCount, invoiceCount] = await Promise.all([
    prisma.tenantUser.count({ where: { tenantId: tenant.id } }),
    prisma.project.count({ where: { tenantId: tenant.id } }),
    prisma.contact.count({ where: { tenantId: tenant.id } }),
    prisma.invoice.count({ where: { tenantId: tenant.id } }),
  ]);

  // Estimate storage (in MB)
  const estimatedStorageMb = Math.round(projectCount * 100 + contactCount * 1 + invoiceCount * 10);

  return {
    storage: {
      used: Math.round(estimatedStorageMb / 1024 * 100) / 100, // Convert to GB
      limit: plan?.maxStorageMb ? Math.round(plan.maxStorageMb / 1024) : 10,
      unit: "GB",
    },
    users: { 
      count: userCount, 
      limit: plan?.maxUsers || 5 
    },
    projects: { count: projectCount },
    contacts: { count: contactCount },
    invoices: { count: invoiceCount },
  };
}

// Get all tenants usage (admin)
export async function getAllTenantsUsage() {
  await requireSuperAdmin();

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          memberships: true,
          projects: true,
          contacts: true,
          invoices: true,
        },
      },
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { plan: true },
        take: 1,
      },
    },
  });

  return tenants.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    plan: t.subscriptions[0]?.plan?.name || "Free",
    users: t._count.memberships,
    projects: t._count.projects,
    contacts: t._count.contacts,
    invoices: t._count.invoices,
  }));
}
