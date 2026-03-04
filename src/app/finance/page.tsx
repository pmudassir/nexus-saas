
import { Shell } from "@/components/layout/Shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { format } from "date-fns";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function FinancePage() {
  const { tenant } = await requireTenantMembership();

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { tenantId: tenant.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.expense.findMany({
      where: { tenantId: tenant.id },
    }),
  ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status.toUpperCase() === "PAID")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const pendingInvoicesTotal = invoices
    .filter((inv) => inv.status.toUpperCase() === "PENDING")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">
                Finance
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                Monitor your financial health and transactions.
              </p>
            </div>
          <div className="flex items-center gap-3">
              <Link href="/finance/invoices">
                <Button variant="outline">
                  <span className="material-symbols-outlined text-lg mr-2">description</span>
                  Invoices
                </Button>
              </Link>
              <Link href="/finance/expenses">
                <Button variant="outline">
                  <span className="material-symbols-outlined text-lg mr-2">trending_down</span>
                  Expenses
                </Button>
              </Link>
              <Link href="/finance/reports">
                <Button variant="outline">
                  <span className="material-symbols-outlined text-lg mr-2">download</span>
                  Reports
                </Button>
              </Link>
              <Link href="/finance/invoices/new">
                <Button>
                  <span className="material-symbols-outlined text-lg mr-2">add</span>
                  New Invoice
                </Button>
              </Link>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                        +12%
                    </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</h3>
            </div>

            <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500">
                        <span className="material-symbols-outlined">trending_down</span>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full">
                        +5%
                    </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(totalExpenses)}</h3>
            </div>

            <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
                         {invoices.filter((inv) => inv.status.toUpperCase() === "PENDING").length} Pending
                    </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Invoices</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(pendingInvoicesTotal)}</h3>
            </div>

            <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500">
                        <span className="material-symbols-outlined">donut_large</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                        Profit
                    </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Profit</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(netProfit)}</h3>
            </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Recent Invoices</h2>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
                     <span className="material-symbols-outlined text-lg">filter_list</span> Filter
                  </button>
                  <Button variant="ghost">View All</Button>
              </div>
            </div>
            
            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   <div className="col-span-2">ID</div>
                   <div className="col-span-3">Client</div>
                   <div className="col-span-2">Amount</div>
                   <div className="col-span-2">Date</div>
                   <div className="col-span-2">Status</div>
                   <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="space-y-2">
                  {invoices.map((invoice) => {
                    const statusLower = invoice.status.toLowerCase() as "paid" | "overdue" | "pending";
                    return (
                        <div key={invoice.id} className="grid grid-cols-12 gap-4 px-6 py-5 bg-white dark:bg-[#24272d] hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-xl transition-all items-center group">
                            <div className="col-span-2 font-mono text-xs font-bold text-foreground">
                                {invoice.invoiceNumber}
                            </div>
                            <div className="col-span-3 font-medium text-foreground">
                                {invoice.client?.company ?? invoice.client?.firstName ?? "Client"}
                            </div>
                            <div className="col-span-2 font-bold text-foreground">
                                {formatCurrency(invoice.totalAmount)}
                            </div>
                            <div className="col-span-2 text-sm text-muted-foreground">
                                {format(invoice.createdAt, "MMM d, yyyy")}
                            </div>
                            <div className="col-span-2">
                                <StatusBadge status={statusLower} />
                            </div>
                            <div className="col-span-1 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                                        <DropdownMenuItem className="font-medium cursor-pointer">View Details</DropdownMenuItem>
                                        <DropdownMenuItem className="font-medium cursor-pointer">Download PDF</DropdownMenuItem>
                                        <DropdownMenuItem className="font-medium cursor-pointer">Send Reminder</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                  })}
                </div>
            </div>
        </div>
      </div>
    </Shell>
  );
}
