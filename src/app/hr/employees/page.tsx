import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, Phone, MoreHorizontal } from "lucide-react";

const employees = [
  {
    id: "EMP-001",
    name: "Alice Johnson",
    role: "Software Engineer",
    department: "Engineering",
    email: "alice@nexus.com",
    status: "ACTIVE",
  },
  {
    id: "EMP-002",
    name: "Bob Smith",
    role: "Product Manager",
    department: "Product",
    email: "bob@nexus.com",
    status: "ACTIVE",
  },
  {
    id: "EMP-003",
    name: "Charlie Brown",
    role: "Designer",
    department: "Design",
    email: "charlie@nexus.com",
    status: "ON_LEAVE",
  },
  {
    id: "EMP-004",
    name: "Diana Prince",
    role: "HR Manager",
    department: "HR",
    email: "diana@nexus.com",
    status: "ACTIVE",
  },
];

export default function EmployeesPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Directory of all active team members.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-md border border-border w-full md:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search employees..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        <div className="rounded-md border border-border bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{emp.role}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-muted text-xs">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 hover:text-primary cursor-pointer" />
                      <Phone className="h-4 w-4 hover:text-primary cursor-pointer" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
