
import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { Users, Calendar, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function HRDashboard() {
  const { tenant } = await requireTenantMembership();

  const [employees, leaveRequests, todayAttendance] = await Promise.all([
    prisma.employee.count({ where: { tenantId: tenant.id } }),
    prisma.leaveRequest.count({ where: { tenantId: tenant.id, status: 'PENDING' } }),
    prisma.attendance.count({ where: { tenantId: tenant.id, date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
  ]);

  const stats = [
    { name: 'Total Employees', value: employees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Leaves', value: leaveRequests, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Clocked In', value: todayAttendance, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const modules = [
    { name: 'Leave Management', href: '/hr/leave', description: 'Manage leave requests and approvals', icon: Calendar },
    { name: 'Attendance Tracking', href: '/hr/attendance', description: 'Clock in/out and overtime tracking', icon: Clock },
    { name: 'Payroll Processing', href: '/hr/payroll', description: 'Monthly payroll and pay slips', icon: DollarSign },
  ];

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">
                HR Management
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                Complete employee management with leave, attendance, and payroll.
              </p>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
             <div key={stat.name} className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                        <ArrowUpRight className="h-3 w-3 mr-1" /> View
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <h3 className="text-3xl font-bold font-display text-foreground mt-1">{stat.value}</h3>
                </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display">HR Modules</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-3">
              {modules.map((module) => (
                <Link key={module.name} href={module.href} className="group">
                  <div className="h-full bg-gray-50 hover:bg-white border border-gray-100 hover:border-orange-200 rounded-3xl p-6 transition-all hover:shadow-soft flex flex-col items-center text-center cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                        <module.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-600 transition-colors">{module.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{module.description}</p>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
