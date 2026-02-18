import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  FileText,
  Layers,
  Receipt,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

const FEATURE_LINKS: Record<
  string,
  { title: string; description: string; href: string; icon: typeof Layers }
> = {
  projects: {
    title: "Projects",
    description: "Track project delivery and execution",
    href: "/projects",
    icon: Briefcase,
  },
  crm: {
    title: "CRM",
    description: "Manage leads, pipeline, and follow-ups",
    href: "/crm",
    icon: Target,
  },
  finance: {
    title: "Finance",
    description: "Invoices, expenses, and reporting",
    href: "/finance",
    icon: CircleDollarSign,
  },
  inventory: {
    title: "Inventory",
    description: "Stock control and purchase operations",
    href: "/inventory",
    icon: Layers,
  },
  hr: {
    title: "HR",
    description: "Employee, payroll, and leave workflows",
    href: "/hr",
    icon: Users,
  },
  analytics: {
    title: "Analytics",
    description: "Monitor performance insights",
    href: "/analytics",
    icon: TrendingUp,
  },
  website_builder: {
    title: "Site Builder",
    description: "Publish and optimize tenant website",
    href: "/builder",
    icon: FileText,
  },
  automation: {
    title: "Automation",
    description: "Automate recurring internal workflows",
    href: "/automation",
    icon: ShieldCheck,
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
  const today = new Date();

  const enabledFeatureCards = stats.enabledFeatures
    .map((featureKey) => FEATURE_LINKS[featureKey])
    .filter(Boolean)
    .slice(0, 6);

  const hasPositiveNet = stats.completionDelta >= 0;

  return (
    <Shell>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50 via-white to-amber-50 p-8 shadow-soft">
          <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-orange-100/60 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700/70">
                Workspace Command Center
              </p>
              <h1 className="mt-2 text-4xl font-display font-bold tracking-tight text-foreground">
                {stats.tenantName}
              </h1>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {today.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/finance/invoices/new">Create Invoice</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects/new">New Project</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tasks">Review Tasks</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/settings/team">Manage Team</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Revenue (MTD)
            </p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">
              {formatMoney(stats.monthlyRevenue, stats.currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Paid invoices this month</p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Outstanding
            </p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">
              {formatMoney(stats.outstandingAmount, stats.currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.pendingInvoicesCount} pending/overdue invoices
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Active Projects
            </p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">{stats.activeProjects}</p>
            <Link href="/projects" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
              Open projects <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tasks Completed
            </p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">
              {stats.completedTasks}/{stats.totalTasks}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stats.taskCompletionRate}% completion rate</p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Open Leads</p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">{stats.openLeads}</p>
            <Link href="/crm/leads" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
              View pipeline <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Team Members</p>
            <p className="mt-2 text-2xl font-display font-bold text-foreground">{stats.teamMembers}</p>
            <Link href="/settings/team" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
              Manage team <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-foreground">Operational Focus</h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  hasPositiveNet
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {hasPositiveNet ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                Net {formatMoney(Math.abs(stats.completionDelta), stats.currency)}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Receipt className="h-4 w-4 text-orange-600" />
                  Expenses (MTD)
                </div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatMoney(stats.monthExpenses, stats.currency)}
                </p>
                <Link href="/finance/expenses" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                  Manage expenses <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  Contacts
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{stats.totalContacts}</p>
                <Link href="/crm" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                  Open CRM <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Tasks Due in Next 7 Days
              </h3>
              {stats.dueSoonTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-muted-foreground">
                  No near-term due tasks.
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.dueSoonTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/projects/${task.project.id}`}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.project.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-foreground">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                        </p>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{task.priority}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-xl font-display font-bold text-foreground">Enabled Modules</h2>
            <div className="space-y-2">
              {enabledFeatureCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-muted-foreground">
                  No modules enabled.
                </div>
              ) : (
                enabledFeatureCards.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="block rounded-2xl border border-gray-100 p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-foreground">Recent Activity</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings/audit">Open Audit Logs</Link>
            </Button>
          </div>

          {stats.recentActivity.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-muted-foreground">
              No activity recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-2xl border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{item.userName}</span> {formatAction(item.action)}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.entity}</p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{timeAgo(item.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
