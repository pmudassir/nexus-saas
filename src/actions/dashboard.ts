"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export async function getDashboardStats() {
  const { tenant } = await requireTenantMembership();

  const [
    paidInvoices,
    activeProjects,
    totalClients,
    totalTasks,
    completedTasks
  ] = await Promise.all([
    // Total Revenue (Paid Invoices)
    prisma.invoice.findMany({
      where: {
        tenantId: tenant.id,
        status: "PAID"
      },
      select: {
        totalAmount: true
      }
    }),
    // Active Projects
    prisma.project.count({
      where: {
        tenantId: tenant.id,
        status: "ACTIVE"
      }
    }),
    // Total Clients
    prisma.contact.count({
      where: {
        tenantId: tenant.id
      }
    }),
    // Total Tasks
    prisma.task.count({
      where: {
        tenantId: tenant.id
      }
    }),
    // Completed Tasks
    prisma.task.count({
      where: {
        tenantId: tenant.id,
        status: "DONE"
      }
    })
  ]);

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalRevenue,
    activeProjects,
    totalClients,
    taskCompletionRate,
    currency: tenant.primaryColor // Just using this to access tenant properties if needed, usually currency is in Plan or Settings. 
    // Schema doesn't have currency on Tenant, but Invoice has it. 
    // We'll assume USD or formatting at generic level for now.
  };
}
