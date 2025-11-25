import { Shell } from "@/components/layout/Shell";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Briefcase,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createEmployee } from "@/actions/hr";

function getInitials(firstName: string, lastName?: string | null) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export default async function HRPage() {
  const { tenant } = await requireTenantMembership();

  const employees = await prisma.employee.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const totalEmployees = employees.length;
  const onLeaveCount = employees.filter(
    (employee) => employee.status === "ON_LEAVE",
  ).length;
  const openPositions = Math.max(0, 5 - totalEmployees);
  const upcomingReviews = Math.min(totalEmployees, 12);

  const formatStatusForBadge = (
    status: string,
  ): "active" | "inactive" | "on_leave" => {
    const lower = status.toLowerCase();
    if (lower === "on_leave") return "on_leave";
    if (lower === "inactive") return "inactive";
    return "active";
  };

  return (
    <Shell>
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 antialiased selection:bg-indigo-500/30">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora opacity-20" />
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)]" />
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Human Resources
              </h1>
              <p className="text-slate-400 mt-1">
                Manage employees, payroll, and time off requests.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Time Off
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>

          {/* Quick Add Employee */}
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-200">
              Quick Add Employee
            </h2>
            <form
              className="grid gap-3 md:grid-cols-[1.5fr,1.5fr,1.5fr,1fr,1fr,auto] items-end"
              action={createEmployee}
            >
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  First Name
                </label>
                <input
                  name="firstName"
                  required
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Alice"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Last Name
                </label>
                <input
                  name="lastName"
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Freeman"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="alice@nexus.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Department
                </label>
                <input
                  name="department"
                  required
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Engineering"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Position
                  </label>
                  <input
                    name="position"
                    required
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Salary (USD)
                  </label>
                  <input
                    name="salary"
                    type="number"
                    step="0.01"
                    required
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="120000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Hire Date
                </label>
                <input
                  name="hireDate"
                  type="date"
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>
              <Button type="submit" size="sm" className="mt-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total Employees
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {totalEmployees}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Open Positions
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {openPositions}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">On Leave</p>
                  <h3 className="text-2xl font-bold text-white">
                    {onLeaveCount}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Upcoming Reviews
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {upcomingReviews}
                  </h3>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Employee Directory */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <SpotlightCard
                key={employee.id}
                className="p-5 border-white/5 bg-slate-900/50 backdrop-blur-xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={undefined}
                      alt={`${employee.firstName} ${employee.lastName ?? ""}`}
                      fallback={getInitials(employee.firstName, employee.lastName)}
                      size="lg"
                      className="ring-2 ring-white/10 bg-indigo-500/20 text-indigo-300"
                    />
                    <div>
                      <h3 className="font-semibold text-base text-white">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {employee.position}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-900 border-white/10 text-slate-200"
                    >
                      <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuTrigger className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300">
                        Terminate
                      </DropdownMenuTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Briefcase className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <StatusBadge
                    status={formatStatusForBadge(employee.status)}
                    size="sm"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    {employee.id}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
