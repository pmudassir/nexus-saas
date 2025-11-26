import { Shell } from "@/components/layout/Shell";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { Button } from "@/components/ui/button";
import {
  createExpense,
  approveExpense,
  rejectExpense,
} from "@/actions/expenses";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { Receipt, Check, X, Upload } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export default async function ExpensesPage() {
  const { tenant } = await requireTenantMembership();

  const expenses = await prisma.expense.findMany({
    where: { tenantId: tenant.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  const stats = {
    total: expenses.length,
    pending: expenses.filter((e) => e.approvalStatus === "PENDING").length,
    approved: expenses.filter((e) => e.approvalStatus === "APPROVED").length,
    rejected: expenses.filter((e) => e.approvalStatus === "REJECTED").length,
    totalAmount: expenses
      .filter((e) => e.approvalStatus === "APPROVED")
      .reduce((sum, e) => sum + Number(e.amount), 0),
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Receipt className="w-8 h-8" />
              Expenses
            </h1>
            <p className="text-slate-500 mt-2">
              Track and manage company expenses with approval workflow.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Total Expenses</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {stats.total}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="text-3xl font-bold text-amber-500 mt-1">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Approved</div>
            <div className="text-3xl font-bold text-emerald-600 mt-1">
              {stats.approved}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Total Approved</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              ${stats.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Create Expense Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Add New Expense
          </h2>
          <form action={createExpense} className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Office supplies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                required
                step="0.01"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Add Expense
              </Button>
            </div>
          </form>
        </div>

        {/* Expenses Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
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
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(Number(expense.amount), expense.currency)}
                    </td>
                    <td className="px-6 py-4">
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400">No receipt</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expense.approvalStatus === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : expense.approvalStatus === "REJECTED"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {expense.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {expense.approvalStatus === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <form action={approveExpense}>
                            <input
                              type="hidden"
                              name="expenseId"
                              value={expense.id}
                            />
                            <button
                              type="submit"
                              className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </form>

                          <form action={rejectExpense}>
                            <input
                              type="hidden"
                              name="expenseId"
                              value={expense.id}
                            />
                            <input
                              type="hidden"
                              name="reason"
                              value="Rejected by admin"
                            />
                            <button
                              type="submit"
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
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
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <div className="text-sm">No expenses yet</div>
                      <div className="text-xs text-slate-400 mt-1">
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
