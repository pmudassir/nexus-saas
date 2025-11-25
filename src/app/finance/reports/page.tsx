import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { generateProfitLossReport, generateCashFlowReport, getFinancialOverview } from '@/actions/reports';
import { TrendingUp, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '@/actions/finance-advanced';

export default async function ReportsPage() {
  const { tenant } = await requireTenantMembership();

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
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Financial Reports
            </h1>
            <p className="text-slate-400 mt-2">
              Comprehensive P&L and cash flow analysis for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">
              ${overview.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {overview.paidInvoiceCount} of {overview.invoiceCount} invoices paid
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-red-400 mt-1">
              ${overview.totalExpenses.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {overview.expenseCount} approved expenses
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400">Net Profit</div>
            <div className={`text-3xl font-bold mt-1 ${overview.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${overview.profit.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {overview.profitMargin.toFixed(1)}% margin
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Cash Flow
            </div>
            <div className={`text-3xl font-bold mt-1 ${cashFlowReport.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${cashFlowReport.netCashFlow.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ${cashFlowReport.accountsReceivable.toLocaleString()} receivable
            </div>
          </div>
        </div>

        {/* Profit & Loss Report */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Profit & Loss Statement</h2>
          
          <div className="space-y-4">
            {/* Revenue Section */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-emerald-400">Revenue</span>
                <span className="text-lg font-bold text-emerald-400">
                  ${plReport.revenue.total.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-slate-400 ml-4">
                {plReport.revenue.invoiceCount} invoices
              </div>
            </div>

            {/* Expenses Section */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-red-400">Expenses</span>
                <span className="text-lg font-bold text-red-400">
                  ${plReport.expenses.total.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2 ml-4">
                {Object.entries(plReport.expenses.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-slate-400">{category}</span>
                    <span className="text-slate-300">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Profit */}
            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Net Profit</span>
                <span className={`text-xl font-bold ${plReport.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${plReport.netProfit.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-slate-400 text-right mt-1">
                {plReport.profitMargin.toFixed(1)}% profit margin
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Report */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Cash Flow Statement</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-slate-400">Cash In (Paid Invoices)</span>
              <span className="text-emerald-400 font-semibold">
                +${cashFlowReport.cashIn.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-slate-400">Cash Out (Approved Expenses)</span>
              <span className="text-red-400 font-semibold">
                -${cashFlowReport.cashOut.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-slate-400">Accounts Receivable (Pending)</span>
              <span className="text-amber-400 font-semibold">
                ${cashFlowReport.accountsReceivable.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-white">Net Cash Flow</span>
              <span className={`text-lg font-bold ${cashFlowReport.netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${cashFlowReport.netCashFlow.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Monthly Trend */}
          {cashFlowReport.monthlyTrend.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Monthly Trend</h3>
              <div className="space-y-2">
                {cashFlowReport.monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-emerald-400">+${month.cashIn.toLocaleString()}</span>
                      <span className="text-red-400">-${month.cashOut.toLocaleString()}</span>
                      <span className={`font-semibold ${month.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
