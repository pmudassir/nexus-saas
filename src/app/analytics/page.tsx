
import { Shell } from "@/components/layout/Shell";
import {
  RevenueChart,
  ProjectStatusChart,
} from "@/components/analytics/Charts";
import { TrendingUp, Users, Activity, BarChart3, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function AnalyticsPage() {
  const { tenant } = await requireTenantMembership();

  const [invoices, expenses, , employees, contacts] =
    await Promise.all([
      prisma.invoice.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.expense.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.project.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.employee.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.contact.findMany({
        where: { tenantId: tenant.id },
      }),
    ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status.toUpperCase() === "PAID")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalEmployees = employees.length;
  const totalContacts = contacts.length;

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-display text-foreground">Analytics</h1>
          <p className="text-muted-foreground font-medium mt-2">
            Deep dive into your business performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{formatCurrency(totalRevenue)}</h3>
                </div>
            </div>

             <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +5%
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{formatCurrency(totalExpenses)}</h3>
                </div>
            </div>

             <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{formatCurrency(netProfit)}</h3>
                </div>
            </div>

             <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Team & Clients</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{totalEmployees + totalContacts}</h3>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
            <h3 className="text-lg font-bold font-display mb-6">Revenue vs Expenses</h3>
            <div className="h-[300px] w-full">
               <RevenueChart />
            </div>
          </div>
          <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
            <h3 className="text-lg font-bold font-display mb-6">Project Distribution</h3>
            <div className="h-[300px] w-full">
              <ProjectStatusChart />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
