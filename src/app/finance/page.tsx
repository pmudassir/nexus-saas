import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
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
      <div className="relative min-h-screen w-full bg-white antialiased">
        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#37352f] tracking-tight">
                Financial Overview
              </h1>
              <p className="text-[#9B9A97] mt-1">
                Monitor revenue, expenses, and manage invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-sm bg-[rgba(219,237,219,1)] text-[rgb(28,56,41)]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9B9A97]">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold text-[#37352f]">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Based on paid invoices</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-sm bg-[rgba(255,226,221,1)] text-[rgb(93,23,21)]">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9B9A97]">
                    Total Expenses
                  </p>
                  <h3 className="text-2xl font-bold text-[#37352f]">
                    {formatCurrency(totalExpenses)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-rose-600 font-medium">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Tracked company expenses</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-sm bg-[rgba(250,222,201,1)] text-[rgb(73,41,14)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9B9A97]">
                    Pending Invoices
                  </p>
                  <h3 className="text-2xl font-bold text-[#37352f]">
                    {formatCurrency(pendingInvoicesTotal)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-[#9B9A97]">
                <span>
                  {
                    invoices.filter(
                      (inv) => inv.status.toUpperCase() === "PENDING"
                    ).length
                  }{" "}
                  invoices pending
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-sm bg-[rgba(235,236,252,1)] text-indigo-600">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9B9A97]">
                    Net Profit
                  </p>
                  <h3 className="text-2xl font-bold text-[#37352f]">
                    {formatCurrency(netProfit)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Revenue minus expenses</span>
              </div>
            </Card>
          </div>

          {/* Recent Invoices */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-[#E9E9E8] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#37352f]">
                Recent Invoices
              </h2>
              <Button
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-[rgba(235,236,252,0.5)]"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#9B9A97] uppercase bg-[#F7F7F5] border-b border-[#E9E9E8]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Invoice ID</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Date Issued</th>
                    <th className="px-6 py-3 font-medium">Due Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E9E8]">
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
                        className="group hover:bg-[rgba(55,53,47,0.04)] transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-[#37352f] font-mono text-xs">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-[#37352f] font-medium">
                          {invoice.client?.company ??
                            invoice.client?.firstName ??
                            "Client"}
                        </td>
                        <td className="px-6 py-4 text-[#37352f]">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-[#9B9A97]">
                          {format(invoice.createdAt, "PP")}
                        </td>
                        <td className="px-6 py-4 text-[#9B9A97]">
                          {format(invoice.dueDate, "PP")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={statusLower} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 hover:bg-[rgba(55,53,47,0.08)] rounded-sm text-[#9B9A97] hover:text-[#37352f] transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white border-[#E9E9E8] text-[#37352f]"
                            >
                              <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
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
          </Card>
        </div>
      </div>
    </Shell>
  );
}
