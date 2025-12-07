import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { generateProfitLossReport, generateCashFlowReport, getFinancialOverview } from '@/actions/reports';
import { TrendingUp, DollarSign, TrendingDown, Calendar } from 'lucide-react';


export default async function ReportsPage() {
  await requireTenantMembership();

  // Get reports for current month
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [overview, plReport, cashFlowReport] = await Promise.all([
    getFinancialOverview(startDate, endDate),
    generateProfitLossReport(startDate, endDate),
    generateCashFlowReport(startDate, endDate),
  ]);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Financial Reports
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive P&L and cash flow analysis for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-1">
              ${overview.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {overview.paidInvoiceCount} of {overview.invoiceCount} invoices paid
            </div>
          </div>

          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-red-500 mt-1">
              ${overview.totalExpenses.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {overview.expenseCount} approved expenses
            </div>
          </div>

          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Net Profit</div>
            <div className={`text-3xl font-bold mt-1 ${overview.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              ${overview.profit.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {overview.profitMargin.toFixed(1)}% margin
            </div>
          </div>

          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Cash Flow
            </div>
            <div className={`text-3xl font-bold mt-1 ${cashFlowReport.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              ${cashFlowReport.netCashFlow.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              ${cashFlowReport.accountsReceivable.toLocaleString()} receivable
            </div>
          </div>
        </div>

        {/* Profit & Loss Report */}
        <div className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Profit & Loss Statement</h2>
          
          <div className="space-y-4">
            {/* Revenue Section */}
            <div className="border-b border-border pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-emerald-600">Revenue</span>
                <span className="text-lg font-bold text-emerald-600">
                  ${plReport.revenue.total.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground ml-4">
                {plReport.revenue.invoiceCount} invoices
              </div>
            </div>

            {/* Expenses Section */}
            <div className="border-b border-border pb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-red-500">Expenses</span>
                <span className="text-lg font-bold text-red-500">
                  ${plReport.expenses.total.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2 ml-4">
                {Object.entries(plReport.expenses.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{category}</span>
                    <span className="text-foreground font-medium">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Profit */}
            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-foreground">Net Profit</span>
                <span className={`text-xl font-bold ${plReport.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  ${plReport.netProfit.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground text-right mt-1">
                {plReport.profitMargin.toFixed(1)}% profit margin
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Report */}
        <div className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Cash Flow Statement</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Cash In (Paid Invoices)</span>
              <span className="text-emerald-600 font-semibold">
                +${cashFlowReport.cashIn.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Cash Out (Approved Expenses)</span>
              <span className="text-red-500 font-semibold">
                -${cashFlowReport.cashOut.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Accounts Receivable (Pending)</span>
              <span className="text-amber-500 font-semibold">
                ${cashFlowReport.accountsReceivable.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-foreground">Net Cash Flow</span>
              <span className={`text-lg font-bold ${cashFlowReport.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ${cashFlowReport.netCashFlow.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Monthly Trend */}
          {cashFlowReport.monthlyTrend.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Monthly Trend</h3>
              <div className="space-y-2">
                {cashFlowReport.monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-emerald-600">+${month.cashIn.toLocaleString()}</span>
                      <span className="text-red-500">-${month.cashOut.toLocaleString()}</span>
                      <span className={`font-semibold ${month.net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        ${month.net.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
