import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  CalendarDays,
  User,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import {
  submitLeaveRequest,
  approveLeave,
  rejectLeave,
} from "@/actions/hr";
import { LEAVE_TYPES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default async function LeaveManagementPage() {
  const { tenant } = await requireTenantMembership();

  const [leaveRequests, employees] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: { tenantId: tenant.id },
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  const stats = {
    pending: leaveRequests.filter((r) => r.status === "PENDING").length,
    approved: leaveRequests.filter((r) => r.status === "APPROVED").length,
    rejected: leaveRequests.filter((r) => r.status === "REJECTED").length,
  };

  const pendingRequests = leaveRequests.filter((r) => r.status === "PENDING");
  const historyRequests = leaveRequests.filter((r) => r.status !== "PENDING");

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Leave Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and approve employee leave requests.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Submit Leave Request
                </DialogTitle>
              </DialogHeader>
              <form action={submitLeaveRequest} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee *</label>
                  <select
                    name="employeeId"
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Leave Type *</label>
                  <select
                    name="leaveType"
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {LEAVE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date *</label>
                    <Input name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date *</label>
                    <Input name="endDate" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason *</label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Please provide a reason for your leave request..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Pending Approval
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </div>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Approved</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.approved}
                </div>
              </div>
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Rejected</div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Pending Requests</h2>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {request.employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {request.employee.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.employee.position}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="px-2 py-0.5 rounded bg-muted">
                            {request.leaveType}
                          </span>
                          <span>
                            {format(request.startDate, "MMM d")} -{" "}
                            {format(request.endDate, "MMM d, yyyy")}
                          </span>
                          <span className="text-muted-foreground">
                            ({request.days} days)
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {request.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <form action={approveLeave}>
                        <input
                          type="hidden"
                          name="leaveId"
                          value={request.id}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </form>
                      <form action={rejectLeave}>
                        <input
                          type="hidden"
                          name="leaveId"
                          value={request.id}
                        />
                        <input type="hidden" name="reason" value="Rejected" />
                        <Button type="submit" size="sm" variant="outline">
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Request History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Request History</h2>
          <div className="rounded-md border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Employee</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Days</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {request.employee.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-muted text-xs">
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(request.startDate, "MMM d")} -{" "}
                      {format(request.endDate, "MMM d")}
                    </td>
                    <td className="px-6 py-4">{request.days}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(request.createdAt, "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
                {historyRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      No leave history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
