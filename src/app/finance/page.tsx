
import { Shell } from "@/components/layout/Shell";
import Link from "next/link";
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
  Filter,
  ArrowUpRight
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
              <Link href="/finance/reports">
                <Button variant="outline" className="rounded-full shadow-soft hover:bg-gray-50 border-gray-200">
                  <Download className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </Link>
              <Link href="/finance/invoices/new">
                <Button className="rounded-full bg-black text-white px-6 h-11 shadow-lg hover:bg-gray-800 transition-all font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </Link>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
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
                        <TrendingDown className="h-5 w-5" />
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
                        <FileText className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                         {invoices.filter((inv) => inv.status.toUpperCase() === "PENDING").length} Pending
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{formatCurrency(pendingInvoicesTotal)}</h3>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-black/5 text-foreground flex items-center justify-center">
                        <PieChart className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" /> Profit
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <h3 className="text-2xl font-bold font-display text-foreground mt-1">{formatCurrency(netProfit)}</h3>
                </div>
            </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display">Recent Invoices</h2>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-gray-50 px-4 py-2 rounded-full">
                     <Filter className="h-4 w-4" /> Filter
                  </button>
                  <Button variant="ghost" className="rounded-full hover:bg-gray-100">View All</Button>
              </div>
            </div>
            
            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 rounded-2xl mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                        <div key={invoice.id} className="grid grid-cols-12 gap-4 px-6 py-5 bg-white hover:bg-gray-50/50 border border-gray-100 hover:border-gray-200 rounded-3xl transition-all items-center group">
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
                                <StatusBadge status={statusLower} size="sm" />
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
