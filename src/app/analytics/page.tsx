
import { Shell } from "@/components/layout/Shell";
import {
  RevenueChart,
  ProjectStatusChart,
} from "@/components/analytics/Charts";
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
          <h1 className="text-4xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">analytics</span>
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Deep dive into your business performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <span className="material-symbols-outlined text-xs mr-1">north_east</span> +12%
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</h3>
                </div>
            </div>

             <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600">
                        <span className="material-symbols-outlined">monitoring</span>
                    </div>
                    <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-500/10 px-2 py-1 rounded-full">
                        <span className="material-symbols-outlined text-xs mr-1">north_east</span> +5%
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(totalExpenses)}</h3>
                </div>
            </div>

             <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
                        <span className="material-symbols-outlined">bar_chart</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Profit</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(netProfit)}</h3>
                </div>
            </div>

             <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Team & Clients</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalEmployees + totalContacts}</h3>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Revenue vs Expenses</h3>
            <div className="h-[300px] w-full">
               <RevenueChart />
            </div>
          </div>
          <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Project Distribution</h3>
            <div className="h-[300px] w-full">
              <ProjectStatusChart />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
