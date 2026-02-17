
import { prisma } from "@/lib/prisma";
import { 
  CreditCard, 
  ArrowUpRight, 
  DollarSign, 
  Wallet,
  AlertCircle
} from "lucide-react";




export default async function AdminBillingPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      tenant: true,
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate metrics
  const activeSubs = subscriptions.filter(sub => sub.status === 'ACTIVE');
  const totalMRR = activeSubs.reduce((sum, sub) => sum + (sub.plan.priceMonthly || 0), 0);

  
  const planDistribution = activeSubs.reduce((acc, sub) => {
    const planName = sub.plan.name;
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      label: "Total MRR",
      value: `$${(totalMRR / 100).toLocaleString()}`,
      sub: "+12% from last month",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Subscriptions",
      value: activeSubs.length,
      sub: `${subscriptions.length - activeSubs.length} inactive`,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Lifetime Value (Est.)",
      value: `$${((totalMRR * 12) / 100).toLocaleString()}`,
      sub: "Based on current MRR",
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Churn Rate",
      value: "2.4%",
      sub: "Low risk",
      icon: AlertCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
            <Wallet className="w-9 h-9" />
            Billing Overview
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Monitor platform revenue, subscription health, and transaction history.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div
                  className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <span
                  className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  View
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold font-display text-foreground mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Distribution & Revenue Chart Placeholder */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
             <h2 className="text-lg font-bold font-display text-foreground mb-4">Revenue Trends</h2>
             {/* Placeholder for a chart - reusing structure from dashboard */}
             <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-muted-foreground font-medium">Revenue Chart Component</p>
             </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
            <h2 className="text-lg font-bold font-display text-foreground mb-4">Plan Distribution</h2>
            <div className="space-y-4">
              {Object.entries(planDistribution).map(([planName, count]) => (
                <div key={planName} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="font-medium text-sm text-foreground">{planName}</span>
                  </div>
                  <span className="font-bold text-sm">{count}</span>
                </div>
              ))}
              {Object.keys(planDistribution).length === 0 && (
                <p className="text-sm text-muted-foreground">No active subscriptions</p>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display">
              All Subscriptions ({subscriptions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Tenant</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Next Billing</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-foreground">
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-foreground">
                          {sub.tenant.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {sub.tenant.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{sub.plan.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ${(sub.plan.priceMonthly / 100).toFixed(2)}/mo
                    </td>
                     <td className="px-6 py-4 text-muted-foreground">
                      {sub.currentPeriodEnd 
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString() 
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-muted-foreground text-sm"
                    >
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      No subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
