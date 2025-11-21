import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, MoreHorizontal, Filter } from "lucide-react";

const expenses = [
  {
    id: "EXP-001",
    description: "Office Supplies",
    amount: 245.0,
    category: "Operations",
    status: "APPROVED",
    date: "Oct 14, 2023",
  },
  {
    id: "EXP-002",
    description: "Client Lunch",
    amount: 120.5,
    category: "Sales",
    status: "PENDING",
    date: "Oct 12, 2023",
  },
  {
    id: "EXP-003",
    description: "Software License",
    amount: 899.0,
    category: "IT",
    status: "APPROVED",
    date: "Oct 05, 2023",
  },
  {
    id: "EXP-004",
    description: "Travel Expenses",
    amount: 450.0,
    category: "Travel",
    status: "REJECTED",
    date: "Sep 28, 2023",
  },
];

export default function ExpensesPage() {
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
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
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.status === "APPROVED"
                          ? "bg-green-500/10 text-green-500"
                          : expense.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {expense.status}
                    </span>
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
    </Shell>
  );
}
