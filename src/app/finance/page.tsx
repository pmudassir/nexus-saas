import { Shell } from "@/components/layout/Shell";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Plus,
  MoreVertical,
  PieChart,
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
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 antialiased selection:bg-indigo-500/30">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora opacity-20" />
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)]" />
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Financial Overview
              </h1>
              <p className="text-slate-400 mt-1">
                Monitor revenue, expenses, and manage invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Based on paid invoices</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total Expenses
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(totalExpenses)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-rose-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Tracked company expenses</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Pending Invoices
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(pendingInvoicesTotal)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-400">
                <span>
                  {invoices.filter((inv) =>
                    inv.status.toUpperCase() === "PENDING",
                  ).length} {" "}
                  invoices pending
                </span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <PieChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Net Profit
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(netProfit)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Revenue minus expenses</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Recent Invoices
              </h2>
              <Button
                variant="ghost"
                className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Invoice ID</th>
                    <th className="px-6 py-4 font-medium">Client</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date Issued</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((invoice) => {
                    const statusLower = invoice.status
                      .toLowerCase()
                      .replace("overdue", "overdue")
                      .replace("paid", "paid")
                      .replace("pending", "pending") as
                      | "paid"
                      | "overdue"
                      | "pending";

                    return (
                    <tr
                      key={invoice.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-indigo-400 font-mono">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {invoice.client?.company ?? invoice.client?.firstName ?? "Client"}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {format(invoice.createdAt, "PP")}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {format(invoice.dueDate, "PP")}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={statusLower} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-white/10 text-slate-200"
                          >
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
