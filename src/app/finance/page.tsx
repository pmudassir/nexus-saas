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
      <div className="relative min-h-screen w-full overflow-hidden bg-white antialiased">
        <div className="relative z-10 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Financial Overview
              </h1>
              <p className="text-slate-500 mt-1">
                Monitor revenue, expenses, and manage invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm border-0">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Based on paid invoices</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Expenses
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatCurrency(totalExpenses)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-rose-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Tracked company expenses</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Invoices
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatCurrency(pendingInvoicesTotal)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-slate-500">
                <span>
                  {
                    invoices.filter(
                      (inv) => inv.status.toUpperCase() === "PENDING"
                    ).length
                  }{" "}
                  invoices pending
                </span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <PieChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Net Profit
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatCurrency(netProfit)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Revenue minus expenses</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Invoices
              </h2>
              <Button
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-200">
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
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-indigo-600 font-mono">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {invoice.client?.company ??
                            invoice.client?.firstName ??
                            "Client"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {format(invoice.createdAt, "PP")}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {format(invoice.dueDate, "PP")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={statusLower} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white border-slate-200 text-slate-700"
                            >
                              <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                                Send Reminder
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
