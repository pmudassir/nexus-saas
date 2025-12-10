import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, Phone, MoreHorizontal, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createEmployee } from "@/actions/employees";
import { DEPARTMENTS } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default async function EmployeesPage() {
  const { tenant } = await requireTenantMembership();

  const employees = await prisma.employee.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "ACTIVE").length,
    onLeave: employees.filter((e) => e.status === "ON_LEAVE").length,
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage your team members and their information.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Employee
                </DialogTitle>
              </DialogHeader>
              <form action={createEmployee} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position *</label>
                    <Input
                      name="position"
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <select
                      name="department"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary</label>
                  <Input
                    name="salary"
                    type="number"
                    placeholder="50000"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Create Employee</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.active}
            </div>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">On Leave</div>
            <div className="text-2xl font-bold text-amber-600">
              {stats.onLeave}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-md border border-border w-full md:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search employees..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Employee Table */}
        <div className="rounded-md border border-border bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">
                    {emp.department && (
                      <span className="px-2 py-1 rounded-md bg-muted text-xs">
                        {emp.department}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-muted-foreground">
                      <a
                        href={`mailto:${emp.email}`}
                        className="hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <Phone className="h-4 w-4 hover:text-primary cursor-pointer" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : emp.status === "ON_LEAVE"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Terminate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-muted-foreground text-sm"
                  >
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
