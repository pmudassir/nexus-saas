import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { sendInvoice, sendInvoiceReminder } from '@/actions/invoices';
import { FileText, Mail, Download, Send, Clock } from 'lucide-react';

export default async function InvoicesPage() {
  const { tenant } = await requireTenantMembership();

  const invoices = await prisma.invoice.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 50,
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === 'PAID').length,
    pending: invoices.filter((i) => i.status === 'PENDING').length,
    totalAmount: invoices.reduce((sum, i) => sum + Number(i.amount), 0),
    paidAmount: invoices
      .filter((i) => i.status === 'PAID')
      .reduce((sum, i) => sum + Number(i.amount), 0),
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Invoices
            </h1>
            <p className="text-slate-400 mt-2">
              Manage and track your invoices.
            </p>
          </div>
          <Button>Create Invoice</Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Total Invoices</div>
            <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Paid</div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">
              {stats.paid}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Pending</div>
            <div className="text-3xl font-bold text-amber-400 mt-1">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Revenue</div>
            <div className="text-3xl font-bold text-white mt-1">
              ${stats.paidAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20 text-slate-100">
                {invoices.map((invoice) => {
                  const isOverdue =
                    invoice.status === 'PENDING' &&
                    new Date(invoice.dueDate) < new Date();

                  return (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {invoice.clientName}
                        </div>
                        {invoice.clientEmail && (
                          <div className="text-xs text-slate-400">
                            {invoice.clientEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ${Number(invoice.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className={isOverdue ? 'text-red-400' : 'text-slate-400'}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-400 mt-1">Overdue</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <form action={sendInvoice}>
                            <input type="hidden" name="invoiceId" value={invoice.id} />
                            <button
                              type="submit"
                              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="Send Invoice"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>

                          {invoice.status === 'PENDING' && (
                            <form action={sendInvoiceReminder}>
                              <input
                                type="hidden"
                                name="invoiceId"
                                value={invoice.id}
                              />
                              <button
                                type="submit"
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                                title="Send Reminder"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {invoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <div className="text-sm">No invoices yet</div>
                      <div className="text-xs text-slate-500 mt-1">
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
