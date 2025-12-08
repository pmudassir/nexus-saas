import { Shell } from "@/components/layout/Shell";
import {
  RevenueChart,
  ProjectStatusChart,
} from "@/components/analytics/Charts";
import { Widget } from "@/components/dashboard/Widget";
import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function AnalyticsPage() {
  const { tenant } = await requireTenantMembership();

  const [invoices, expenses, , employees, contacts] =
    await Promise.all([
      prisma.invoice.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.expense.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.project.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.employee.findMany({
        where: { tenantId: tenant.id },
      }),
      prisma.contact.findMany({
        where: { tenantId: tenant.id },
      }),
    ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status.toUpperCase() === "PAID")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalEmployees = employees.length;
  const totalContacts = contacts.length;

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Deep dive into your business performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Widget
            title="Total Revenue"
            description="Paid invoices"
            icon={<TrendingUp className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
          </Widget>
          <Widget
            title="Total Expenses"
            description="Recorded expenses"
            icon={<Activity className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
          </Widget>
          <Widget
            title="Net Profit"
            description="Revenue minus expenses"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">
              {formatCurrency(netProfit)}
            </div>
          </Widget>
          <Widget
            title="Team & Clients"
            description="Employees and contacts"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">
              {totalEmployees + totalContacts}
            </div>
          </Widget>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-6">Revenue vs Expenses</h3>
            <RevenueChart />
          </div>
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-6">Project Distribution</h3>
            <ProjectStatusChart />
          </div>
        </div>
      </div>
    </Shell>
  );
}
