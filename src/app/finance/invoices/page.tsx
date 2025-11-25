import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreHorizontal } from "lucide-react";
import Link from "next/link";
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

export default async function InvoicesPage() {
  const { tenant } = await requireTenantMembership();

  const invoices = await prisma.invoice.findMany({
    where: { tenantId: tenant.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">
              Manage your billing and payments.
            </p>
          </div>
          <Link href="/finance/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invoices.map((invoice) => {
                const status = invoice.status.toUpperCase();
                const badgeClass =
                  status === "PAID"
                    ? "bg-green-500/10 text-green-500"
                    : status === "PENDING"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-red-500/10 text-red-500";

                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.client?.company ?? invoice.client?.firstName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(invoice.createdAt, "PP")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
