import { Shell } from "@/components/layout/Shell";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Widget } from "@/components/dashboard/Widget";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

export default function FinancePage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Overview
          </h1>
          <p className="text-muted-foreground">
            Track your revenue, expenses, and profitability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Widget
            title="Total Revenue"
            description="+15% from last month"
            icon={<DollarSign className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">$124,500.00</div>
          </Widget>
          <Widget
            title="Total Expenses"
            description="+5% from last month"
            icon={<CreditCard className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">$32,400.00</div>
          </Widget>
          <Widget
            title="Net Profit"
            description="+18% from last month"
            icon={<TrendingUp className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold text-green-500">$92,100.00</div>
          </Widget>
          <Widget
            title="Outstanding Invoices"
            description="3 overdue invoices"
            icon={<TrendingDown className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold text-red-500">$4,200.00</div>
          </Widget>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Chart Placeholder
            </div>
          </div>
          <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Client Payment #{1000 + i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Oct {10 + i}, 2023
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-green-500">+$1,200.00</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
