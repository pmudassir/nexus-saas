import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  Users,
  Banknote,
  Play,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import {
  generatePayroll as generatePayrollAction,
  processPayroll,
  markPayrollPaid,
  bulkProcessPayroll,
  bulkMarkPaid,
} from "@/actions/payroll";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default async function PayrollPage() {
  const { tenant } = await requireTenantMembership();

  const [payrolls, employees] = await Promise.all([
    prisma.payroll.findMany({
      where: { tenantId: tenant.id },
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
    }),
  ]);

  // Group payrolls by period for summary view
  const payrollsByPeriod = payrolls.reduce(
    (acc, p) => {
      if (!acc[p.payPeriod]) {
        acc[p.payPeriod] = [];
      }
      acc[p.payPeriod].push(p);
      return acc;
    },
    {} as Record<string, typeof payrolls>
  );

  const periodSummaries = Object.entries(payrollsByPeriod).map(
    ([period, records]) => ({
      period,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      employeeCount: records.length,
      pending: records.filter((r) => r.status === "PENDING").length,
      processed: records.filter((r) => r.status === "PROCESSED").length,
      paid: records.filter((r) => r.status === "PAID").length,
      latestDate: records[0]?.createdAt,
    })
  );

  const currentPeriod = format(new Date(), 'MMM yyyy');
  const totalMonthlyPayroll = employees.reduce(
    (sum, e) => sum + (e.salary || 0),
    0
  );

  const stats = {
    activeEmployees: employees.length,
    monthlyPayroll: totalMonthlyPayroll,
    pendingPayments: payrolls.filter((p) => p.status === "PENDING").length,
    processedThisMonth: payrolls.filter(
      (p) => p.payPeriod === currentPeriod && p.status === "PAID"
    ).length,
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Payroll Processing
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate and process monthly payroll for your team.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Run Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Generate Payroll
                </DialogTitle>
              </DialogHeader>
              <form action={async (formData) => { 'use server'; await generatePayrollAction(formData); }} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pay Period *</label>
                  <Input
                    name="payPeriod"
                    defaultValue={currentPeriod}
                    placeholder="Dec 2024"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will generate payroll records for all {employees.length}{" "}
                    active employees.
                  </p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <div className="text-sm text-muted-foreground">
                    Estimated Total
                  </div>
                  <div className="text-2xl font-bold">
                    ${totalMonthlyPayroll.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Generate Payroll</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Active Employees
                </div>
                <div className="text-2xl font-bold">{stats.activeEmployees}</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Monthly Payroll
                </div>
                <div className="text-2xl font-bold">
                  ${stats.monthlyPayroll.toLocaleString()}
                </div>
              </div>
              <Banknote className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Pending Payments
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {stats.pendingPayments}
                </div>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Paid This Month
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.processedThisMonth}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
        </div>

        {/* Payroll Periods */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Payroll Periods</h2>
          {periodSummaries.length > 0 ? (
            <div className="grid gap-4">
              {periodSummaries.map((summary) => (
                <Card key={summary.period} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {summary.period}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {summary.employeeCount} employees •{" "}
                          <span className="font-medium text-foreground">
                            ${summary.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 text-xs">
                        {summary.pending > 0 && (
                          <span className="px-2 py-1 rounded bg-amber-50 text-amber-700">
                            {summary.pending} Pending
                          </span>
                        )}
                        {summary.processed > 0 && (
                          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">
                            {summary.processed} Processed
                          </span>
                        )}
                        {summary.paid > 0 && (
                          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">
                            {summary.paid} Paid
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {summary.pending > 0 && (
                          <form action={bulkProcessPayroll}>
                            <input
                              type="hidden"
                              name="payPeriod"
                              value={summary.period}
                            />
                            <Button type="submit" size="sm" variant="outline">
                              Process All
                            </Button>
                          </form>
                        )}
                        {summary.processed > 0 && (
                          <form action={bulkMarkPaid}>
                            <input
                              type="hidden"
                              name="payPeriod"
                              value={summary.period}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              Mark All Paid
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Payroll Records</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first payroll to get started.
              </p>
            </Card>
          )}
        </div>

        {/* Individual Payroll Records */}
        {payrolls.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Individual Records</h2>
            <div className="rounded-md border border-border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left">Employee</th>
                    <th className="px-6 py-3 text-left">Pay Period</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Payment Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payrolls.slice(0, 20).map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {record.employee.name.charAt(0)}
                          </div>
                          {record.employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">{record.payPeriod}</td>
                      <td className="px-6 py-4 font-medium">
                        ${record.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : record.status === "PROCESSED"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {record.paymentDate
                          ? format(record.paymentDate, "MMM d, yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {record.status === "PENDING" && (
                            <form action={processPayroll}>
                              <input
                                type="hidden"
                                name="payrollId"
                                value={record.id}
                              />
                              <Button type="submit" size="sm" variant="outline">
                                Process
                              </Button>
                            </form>
                          )}
                          {record.status === "PROCESSED" && (
                            <form action={markPayrollPaid}>
                              <input
                                type="hidden"
                                name="payrollId"
                                value={record.id}
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                Mark Paid
                              </Button>
                            </form>
                          )}
                          {record.status === "PAID" && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Slip
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
