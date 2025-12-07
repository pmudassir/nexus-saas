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
      <div className="relative min-h-screen w-full bg-background antialiased">
        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Financial Overview
              </h1>
              <p className="text-muted-foreground mt-1">
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
                <div className="p-2 rounded-sm bg-emerald-50 text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
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
                <div className="p-2 rounded-sm bg-rose-50 text-rose-700">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Expenses
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
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
                <div className="p-2 rounded-sm bg-amber-50 text-amber-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Invoices
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {formatCurrency(pendingInvoicesTotal)}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
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
                <div className="p-2 rounded-sm bg-primary/10 text-primary">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Net Profit
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
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
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Invoices
              </h2>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/5"
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
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
                <tbody className="divide-y divide-border">
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
                        className="group hover:bg-black/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground font-mono text-xs">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">
                          {invoice.client?.company ??
                            invoice.client?.firstName ??
                            "Client"}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {format(invoice.createdAt, "PP")}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {format(invoice.dueDate, "PP")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={statusLower} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 hover:bg-black/5 rounded-sm text-muted-foreground hover:text-foreground transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-card border-border text-foreground"
                            >
                              <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
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
