import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function HRDashboard() {
  const { tenant } = await requireTenantMembership();

  const [employees, leaveRequests, todayAttendance] = await Promise.all([
    prisma.employee.count({ where: { tenantId: tenant.id } }),
    prisma.leaveRequest.count({ where: { tenantId: tenant.id, status: 'PENDING' } }),
    prisma.attendance.count({ where: { tenantId: tenant.id, date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
  ]);

  const stats = [
    { name: 'Total Employees', value: employees, icon: Users, color: 'text-blue-500' },
    { name: 'Pending Leave Requests', value: leaveRequests, icon: Calendar, color: 'text-amber-500' },
    { name: 'Clocked In Today', value: todayAttendance, icon: Clock, color: 'text-emerald-500' },
  ];

  const modules = [
    { name: 'Leave Management', href: '/hr/leave', description: 'Manage leave requests and approvals', icon: Calendar },
    { name: 'Attendance Tracking', href: '/hr/attendance', description: 'Clock in/out and overtime tracking', icon: Clock },
    { name: 'Payroll Processing', href: '/hr/payroll', description: 'Monthly payroll and pay slips', icon: DollarSign },
  ];

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="w-8 h-8" />
            HR Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete employee management with leave, attendance, and payroll.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-md border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.name}</div>
                  <div className="text-3xl font-bold text-foreground mt-1">{stat.value}</div>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.name} href={module.href}>
              <div className="rounded-md border border-border bg-card p-6 hover:bg-muted transition-colors cursor-pointer shadow-sm">
                <module.icon className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{module.name}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
