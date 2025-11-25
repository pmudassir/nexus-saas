'use server';

import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Get financial overview for dashboard
 */
export async function getFinancialOverview(
  startDate: Date,
  endDate: Date
) {
  const { tenant } = await requireTenantMembership();

  // Get invoices in date range
  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId: tenant.id,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Get expenses in date range
  const expenses = await prisma.expense.findMany({
    where: {
      tenantId: tenant.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
      approvalStatus: 'APPROVED',
    },
  });

  const totalRevenue = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses,
    profit,
    profitMargin,
    invoiceCount: invoices.length,
    paidInvoiceCount: invoices.filter((i) => i.status === 'PAID').length,
    expenseCount: expenses.length,
  };
}

/**
 * Generate Profit & Loss statement
 */
export async function generateProfitLossReport(
  startDate: Date,
  endDate: Date
) {
  const { tenant } = await requireTenantMembership();

  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId: tenant.id,
      createdAt: { gte: startDate, lte: endDate },
      status: 'PAID',
    },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      tenantId: tenant.id,
      date: { gte: startDate, lte: endDate },
      approvalStatus: 'APPROVED',
    },
  });

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = invoices.reduce((sum, i) => sum + Number(i.totalAmount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  return {
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    revenue: {
      total: totalRevenue,
      invoiceCount: invoices.length,
    },
    expenses: {
      total: totalExpenses,
      byCategory: expensesByCategory,
    },
    netProfit,
    profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
  };
}

/**
 * Generate Cash Flow statement
 */
export async function generateCashFlowReport(
  startDate: Date,
  endDate: Date
) {
  const { tenant } = await requireTenantMembership();

  // Get all invoices (both paid and pending)
  const allInvoices = await prisma.invoice.findMany({
    where: {
      tenantId: tenant.id,
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      tenantId: tenant.id,
      date: { gte: startDate, lte: endDate },
      approvalStatus: 'APPROVED',
    },
  });

  const cashIn = allInvoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);

  const cashOut = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const accountsReceivable = allInvoices
    .filter((i) => i.status === 'PENDING')
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);

  const netCashFlow = cashIn - cashOut;

  // Group by month for trend analysis
  const monthlyData: Record<string, { cashIn: number; cashOut: number }> = {};
  
  allInvoices.forEach((invoice) => {
    if (invoice.status === 'PAID') {
      const month = new Date(invoice.createdAt).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { cashIn: 0, cashOut: 0 };
      }
      monthlyData[month].cashIn += Number(invoice.totalAmount);
    }
  });

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toISOString().substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { cashIn: 0, cashOut: 0 };
    }
    monthlyData[month].cashOut += Number(expense.amount);
  });

  return {
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    cashIn,
    cashOut,
    netCashFlow,
    accountsReceivable,
    monthlyTrend: Object.entries(monthlyData).map(([month, data]) => ({
      month,
      cashIn: data.cashIn,
      cashOut: data.cashOut,
      net: data.cashIn - data.cashOut,
    })),
  };
}
