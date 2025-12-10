import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Play, Square, Users, CalendarDays, Timer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { clockIn, clockOut } from "@/actions/hr";
import { format } from "date-fns";

export default async function AttendancePage() {
  const { tenant } = await requireTenantMembership();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [employees, todayAttendance, recentAttendance] = await Promise.all([
    prisma.employee.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    prisma.attendance.findMany({
      where: {
        tenantId: tenant.id,
        date: { gte: today },
      },
      include: { employee: true },
      orderBy: { clockIn: "desc" },
    }),
    prisma.attendance.findMany({
      where: { tenantId: tenant.id },
      include: { employee: true },
      orderBy: { date: "desc" },
      take: 50,
    }),
  ]);

  const activeAttendance = todayAttendance.filter((a) => !a.clockOut);
  const completedToday = todayAttendance.filter((a) => a.clockOut);

  const stats = {
    clockedIn: activeAttendance.length,
    completed: completedToday.length,
    totalHours: completedToday.reduce((acc, a) => acc + (a.totalHours || 0), 0),
    overtime: completedToday.reduce((acc, a) => acc + (a.overtime || 0), 0),
  };

  // Find employees not clocked in today
  const clockedInIds = todayAttendance.map((a) => a.employeeId);
  const notClockedIn = employees.filter((e) => !clockedInIds.includes(e.id));

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Clock className="w-8 h-8" />
              Attendance Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor employee check-ins, work hours, and overtime.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-lg font-semibold">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Clocked In</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.clockedIn}
                </div>
              </div>
              <Play className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </div>
              </div>
              <Square className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Hours Today
                </div>
                <div className="text-2xl font-bold">
                  {stats.totalHours.toFixed(1)}h
                </div>
              </div>
              <Timer className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Overtime</div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.overtime.toFixed(1)}h
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Clock In */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Play className="h-5 w-5 text-emerald-500" />
              Clock In
            </h2>
            {notClockedIn.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notClockedIn.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {employee.position}
                        </div>
                      </div>
                    </div>
                    <form action={clockIn}>
                      <input
                        type="hidden"
                        name="employeeId"
                        value={employee.id}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Clock In
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                All employees have clocked in today.
              </p>
            )}
          </Card>

          {/* Currently Working */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Currently Working ({activeAttendance.length})
            </h2>
            {activeAttendance.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activeAttendance.map((attendance) => (
                  <div
                    key={attendance.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                        {attendance.employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {attendance.employee.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In since {format(attendance.clockIn, "h:mm a")}
                        </div>
                      </div>
                    </div>
                    <form action={clockOut}>
                      <input
                        type="hidden"
                        name="attendanceId"
                        value={attendance.id}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        <Square className="h-3 w-3 mr-1" />
                        Clock Out
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No employees currently clocked in.
              </p>
            )}
          </Card>
        </div>

        {/* Recent Attendance History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Attendance History
          </h2>
          <div className="rounded-md border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Employee</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Clock In</th>
                  <th className="px-6 py-3 text-left">Clock Out</th>
                  <th className="px-6 py-3 text-left">Hours</th>
                  <th className="px-6 py-3 text-left">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentAttendance.map((record) => (
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
                    <td className="px-6 py-4">
                      {format(record.date, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-emerald-600">
                      {format(record.clockIn, "h:mm a")}
                    </td>
                    <td className="px-6 py-4">
                      {record.clockOut ? (
                        <span className="text-blue-600">
                          {format(record.clockOut, "h:mm a")}
                        </span>
                      ) : (
                        <span className="text-amber-600 text-xs font-medium">
                          Working...
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.totalHours ? `${record.totalHours.toFixed(1)}h` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {record.overtime > 0 ? (
                        <span className="text-purple-600 font-medium">
                          +{record.overtime.toFixed(1)}h
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
                {recentAttendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      No attendance records yet.
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
