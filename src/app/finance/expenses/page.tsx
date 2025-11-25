import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { createExpense, approveExpense, rejectExpense } from '@/actions/expenses';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { Receipt, Check, X, Upload } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

export default async function ExpensesPage() {
  const { tenant } = await requireTenantMembership();

  const expenses = await prisma.expense.findMany({
    where: { tenantId: tenant.id },
    orderBy: { date: 'desc' },
    take: 50,
  });

  const stats = {
    total: expenses.length,
    pending: expenses.filter((e) => e.approvalStatus === 'PENDING').length,
    approved: expenses.filter((e) => e.approvalStatus === 'APPROVED').length,
    rejected: expenses.filter((e) => e.approvalStatus === 'REJECTED').length,
    totalAmount: expenses
      .filter((e) => e.approvalStatus === 'APPROVED')
      .reduce((sum, e) => sum + Number(e.amount), 0),
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Receipt className="w-8 h-8" />
              Expenses
            </h1>
            <p className="text-slate-400 mt-2">
              Track and manage company expenses with approval workflow.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Total Expenses</div>
            <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Pending</div>
            <div className="text-3xl font-bold text-amber-400 mt-1">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Approved</div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">
              {stats.approved}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Total Approved</div>
            <div className="text-3xl font-bold text-white mt-1">
              ${stats.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Create Expense Form */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Expense</h2>
          <form action={createExpense} className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                required
                className="w-full rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white"
                placeholder="Office supplies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                required
                step="0.01"
                className="w-full rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </div>
          </form>
        </div>

        {/* Expenses Table */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Receipt</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20 text-slate-100">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{expense.category}</td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatCurrency(Number(expense.amount), expense.currency)}
                    </td>
                    <td className="px-6 py-4">
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-slate-600">No receipt</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expense.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : expense.approvalStatus === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {expense.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {expense.approvalStatus === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <form action={approveExpense}>
                            <input type="hidden" name="expenseId" value={expense.id} />
                            <button
                              type="submit"
                              className="p-2 rounded-lg hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </form>

                          <form action={rejectExpense}>
                            <input type="hidden" name="expenseId" value={expense.id} />
                            <input type="hidden" name="reason" value="Rejected by admin" />
                            <button
                              type="submit"
                              className="p-2 rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <div className="text-sm">No expenses yet</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Add your first expense to get started
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
