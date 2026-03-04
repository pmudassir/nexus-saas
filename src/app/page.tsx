import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

const FEATURE_LINKS: Record<
  string,
  { title: string; description: string; href: string; icon: string }
> = {
  projects: {
    title: "Projects",
    description: "Track project delivery and execution",
    href: "/projects",
    icon: "work",
  },
  crm: {
    title: "CRM",
    description: "Manage leads, pipeline, and follow-ups",
    href: "/crm",
    icon: "contacts",
  },
  finance: {
    title: "Finance",
    description: "Invoices, expenses, and reporting",
    href: "/finance",
    icon: "payments",
  },
  inventory: {
    title: "Inventory",
    description: "Stock control and purchase operations",
    href: "/inventory",
    icon: "inventory_2",
  },
  hr: {
    title: "HR",
    description: "Employee, payroll, and leave workflows",
    href: "/hr",
    icon: "badge",
  },
  analytics: {
    title: "Analytics",
    description: "Monitor performance insights",
    href: "/analytics",
    icon: "monitoring",
  },
  website_builder: {
    title: "Site Builder",
    description: "Publish and optimize tenant website",
    href: "/builder",
    icon: "language",
  },
  automation: {
    title: "Automation",
    description: "Automate recurring internal workflows",
    href: "/automation",
    icon: "smart_toy",
  },
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAction(action: string) {
  const labels: Record<string, string> = {
    INVOICE_SENT: "sent an invoice",
    INVOICE_REMINDER_SENT: "sent an invoice reminder",
    INVOICE_CREATED: "created an invoice",
    EXPENSE_CREATED: "added an expense",
    EXPENSE_APPROVED: "approved an expense",
    PROJECT_CREATED: "created a project",
    TASK_CREATED: "created a task",
    USER_INVITED: "invited a team member",
  };

  return (
    labels[action] ||
    action
      .toLowerCase()
      .split("_")
      .join(" ")
  );
}

function timeAgo(input: Date) {
  const diffMs = Date.now() - new Date(input).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function Home() {
  const stats = await getDashboardStats();

  const enabledFeatureCards = stats.enabledFeatures
    .map((featureKey) => FEATURE_LINKS[featureKey])
    .filter(Boolean)
    .slice(0, 6);

  const hasPositiveNet = stats.completionDelta >= 0;

  // KPI configuration matching Stitch design
  const kpiCards = [
    {
      label: "Revenue (MTD)",
      value: formatMoney(stats.monthlyRevenue, stats.currency),
      icon: "payments",
      iconBg: "bg-[#e9590c]/10 text-[#e9590c]",
      trend: stats.monthlyRevenue > 0 ? "+12.5%" : "0%",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects.toString(),
      icon: "folder_open",
      iconBg: "bg-blue-500/10 text-blue-500",
      trend: `${stats.activeProjects} active`,
      trendColor: "text-blue-600 bg-blue-50",
    },
    {
      label: "Tasks Completed",
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: "task_alt",
      iconBg: "bg-amber-500/10 text-amber-500",
      trend: `${stats.taskCompletionRate}%`,
      trendColor: stats.taskCompletionRate >= 70 ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50",
    },
    {
      label: "Open Leads",
      value: stats.openLeads.toString(),
      icon: "person_search",
      iconBg: "bg-teal-500/10 text-teal-500",
      trend: `${stats.openLeads} pipeline`,
      trendColor: "text-slate-400 bg-slate-50",
    },
  ];

  return (
    <Shell>
      <div className="space-y-8">
        {/* KPI Row — Stitch refined dashboard pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white dark:bg-[#24272d] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
                  <span className="material-symbols-outlined">{kpi.icon}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${kpi.trendColor}`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Split (60/40) */}
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
          {/* Operational Focus (60%) */}
          <div className="xl:col-span-6 bg-white dark:bg-[#24272d] p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Operational Focus</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Key financial and operational metrics</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  hasPositiveNet
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {hasPositiveNet ? "trending_up" : "trending_down"}
                </span>
                Net {formatMoney(Math.abs(stats.completionDelta), stats.currency)}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#e9590c] text-lg">receipt_long</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expenses</span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {formatMoney(stats.monthExpenses, stats.currency)}
                </p>
                <Link href="/finance/expenses" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#e9590c]">
                  View all
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-amber-500 text-lg">pending_actions</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Outstanding</span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {formatMoney(stats.outstandingAmount, stats.currency)}
                </p>
                <p className="mt-2 text-xs text-slate-500">{stats.pendingInvoicesCount} invoices pending</p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-500 text-lg">group</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contacts</span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white font-display">{stats.totalContacts}</p>
                <Link href="/crm" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#e9590c]">
                  Open CRM
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Tasks Due */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Tasks Due in Next 7 Days
              </h4>
              {stats.dueSoonTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-6 text-sm text-slate-400 text-center">
                  <span className="material-symbols-outlined text-3xl mb-2 block">event_available</span>
                  No near-term due tasks. You&apos;re all caught up!
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.dueSoonTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/projects/${task.project.id}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">task_alt</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{task.project.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{task.priority}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (40%) — Recent Activity + Modules */}
          <div className="xl:col-span-4 space-y-8">
            {/* Enabled Modules */}
            <div className="bg-white dark:bg-[#24272d] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">Enabled Modules</h3>
              {enabledFeatureCards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-6 text-sm text-slate-400 text-center">
                  No modules enabled.
                </div>
              ) : (
                <div className="space-y-2">
                  {enabledFeatureCards.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9590c]/10 text-[#e9590c]">
                        <span className="material-symbols-outlined">{feature.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{feature.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg">chevron_right</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#24272d] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Recent Activity</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/settings/audit">
                    <span className="text-xs">View All</span>
                  </Link>
                </Button>
              </div>

              {stats.recentActivity.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-6 text-sm text-slate-400 text-center">
                  <span className="material-symbols-outlined text-3xl mb-2 block">history</span>
                  No activity recorded yet.
                </div>
              ) : (
                <div className="space-y-1">
                  {stats.recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9590c]/10 text-[#e9590c] text-xs font-bold shrink-0 mt-0.5">
                        {item.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white">
                          <span className="font-semibold">{item.userName}</span>{" "}
                          <span className="text-slate-500 dark:text-slate-400">{formatAction(item.action)}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.entity}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
