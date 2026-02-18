"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export async function getDashboardStats() {
  const { tenant } = await requireTenantMembership();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextSevenDays = new Date(now);
  nextSevenDays.setDate(now.getDate() + 7);

  const [
    paidRevenueThisMonth,
    outstandingInvoices,
    activeProjects,
    teamMembers,
    totalContacts,
    openLeads,
    totalTasks,
    completedTasks,
    monthExpenses,
    dueSoonTasks,
    recentActivity,
    enabledFeatures,
    latestInvoice,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        tenantId: tenant.id,
        status: "PAID",
        createdAt: {
          gte: monthStart,
          lte: now,
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        tenantId: tenant.id,
        status: { in: ["PENDING", "OVERDUE"] },
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.project.count({
      where: {
        tenantId: tenant.id,
        status: "ACTIVE",
      },
    }),
    prisma.tenantUser.count({ where: { tenantId: tenant.id } }),
    prisma.contact.count({ where: { tenantId: tenant.id } }),
    prisma.lead.count({
      where: { tenantId: tenant.id, stage: { notIn: ["WON", "LOST"] } },
    }),
    prisma.task.count({ where: { tenantId: tenant.id } }),
    prisma.task.count({
      where: { tenantId: tenant.id, status: "DONE" },
    }),
    prisma.expense.aggregate({
      where: {
        tenantId: tenant.id,
        approvalStatus: "APPROVED",
        date: {
          gte: monthStart,
          lte: now,
        },
      },
      _sum: { amount: true },
    }),
    prisma.task.findMany({
      where: {
        tenantId: tenant.id,
        status: { not: "DONE" },
        dueDate: {
          gte: now,
          lte: nextSevenDays,
        },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        status: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 6,
    }),
    prisma.auditLog.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        action: true,
        entity: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.tenantFeature.findMany({
      where: {
        tenantId: tenant.id,
        enabled: true,
      },
      select: { key: true },
    }),
    prisma.invoice.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      select: { currency: true },
    }),
  ]);

  const monthlyRevenue = paidRevenueThisMonth._sum.totalAmount ?? 0;
  const outstandingAmount = outstandingInvoices._sum.totalAmount ?? 0;
  const pendingInvoicesCount = outstandingInvoices._count._all;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completionDelta = monthlyRevenue - (monthExpenses._sum.amount ?? 0);
  const currency = latestInvoice?.currency ?? "USD";

  return {
    tenantName: tenant.name,
    monthlyRevenue,
    outstandingAmount,
    pendingInvoicesCount,
    activeProjects,
    teamMembers,
    totalContacts,
    openLeads,
    totalTasks,
    completedTasks,
    taskCompletionRate,
    monthExpenses: monthExpenses._sum.amount ?? 0,
    completionDelta,
    enabledFeatures: enabledFeatures.map((f) => f.key),
    dueSoonTasks,
    recentActivity: recentActivity.map((item) => ({
      id: item.id,
      action: item.action,
      entity: item.entity,
      createdAt: item.createdAt,
      userName: item.user?.name || item.user?.email || "System",
    })),
    currency,
  };
}
