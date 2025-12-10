import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { sendInvoice, sendInvoiceReminder } from '@/actions/invoices';
import { FileText, Send, Clock, Download } from 'lucide-react';
import Link from 'next/link';

export default async function InvoicesPage() {
  const { tenant } = await requireTenantMembership();

  const invoices = await prisma.invoice.findMany({
    where: { tenantId: tenant.id },
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === 'PAID').length,
    pending: invoices.filter((i) => i.status === 'PENDING').length,
    totalAmount: invoices.reduce((sum, i) => sum + Number(i.totalAmount), 0),
    paidAmount: invoices
      .filter((i) => i.status === 'PAID')
      .reduce((sum, i) => sum + Number(i.totalAmount), 0),
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Invoices
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your invoices.
            </p>
          </div>
          <Link href="/finance/invoices/new">
            <Button className="bg-primary text-white hover:bg-primary/90">Create Invoice</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Total Invoices</div>
            <div className="text-3xl font-bold text-foreground mt-1">{stats.total}</div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-3xl font-bold text-emerald-600 mt-1">
              {stats.paid}
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-3xl font-bold text-amber-500 mt-1">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Revenue</div>
            <div className="text-3xl font-bold text-foreground mt-1">
              ${stats.paidAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-md border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-foreground">
                {invoices.map((invoice) => {
                  const isOverdue =
                    invoice.status === 'PENDING' &&
                    new Date(invoice.dueDate) < new Date();
                  
                  const clientName = invoice.client 
                    ? `${invoice.client.firstName} ${invoice.client.lastName || ''}`.trim()
                    : 'Unknown Client';

                  return (
                    <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{clientName}</div>
                        {invoice.client?.email && (
                          <div className="text-xs text-muted-foreground">
                            {invoice.client.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${Number(invoice.totalAmount).toLocaleString()} {invoice.currency}
                      </td>
                      <td className="px-6 py-4">
                        <div className={isOverdue ? 'text-red-500' : 'text-muted-foreground'}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-500 mt-1">Overdue</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/invoices/${invoice.id}/download`}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          {invoice.client?.email && (
                            <>
                              <form action={sendInvoice}>
                                <input type="hidden" name="invoiceId" value={invoice.id} />
                                <button
                                  type="submit"
                                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                  title="Send Invoice"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </form>

                              {invoice.status === 'PENDING' && (
                                <form action={sendInvoiceReminder}>
                                  <input type="hidden" name="invoiceId" value={invoice.id} />
                                  <button
                                    type="submit"
                                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                                    title="Send Reminder"
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                </form>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <div className="text-sm">No invoices yet</div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Create your first invoice to get started
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
