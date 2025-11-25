import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, MoreHorizontal, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createExpense } from "@/actions/finance";
import { format } from "date-fns";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function ExpensesPage() {
  const { tenant } = await requireTenantMembership();

  const expenses = await prisma.expense.findMany({
    where: { tenantId: tenant.id },
    orderBy: { date: "desc" },
  });

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage company expenses.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Quick Add Expense
            </h2>
            <form className="grid gap-3 md:grid-cols-[2fr,1fr,1fr,auto] items-end" action={createExpense}>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Description
                </label>
                <input
                  name="description"
                  required
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Software subscription"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="SaaS"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="99.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                </div>
              </div>
              <Button type="submit" size="sm" className="mt-1">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      {expense.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-white/5 text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(expense.date, "PP")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
