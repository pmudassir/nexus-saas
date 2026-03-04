import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function HRDashboard() {
  const { tenant } = await requireTenantMembership();

  // Get start of today for attendance query
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [employees, leaveRequests, todayAttendance] = await Promise.all([
    prisma.employee.count({ where: { tenantId: tenant.id } }),
    prisma.leaveRequest.count({ where: { tenantId: tenant.id, status: 'PENDING' } }),
    prisma.attendance.count({ where: { tenantId: tenant.id, date: { gte: today } } }),
  ]);

  const stats = [
    { name: 'Total Employees', value: employees, icon: 'group', color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { name: 'Pending Leaves', value: leaveRequests, icon: 'event_busy', color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { name: 'Clocked In', value: todayAttendance, icon: 'schedule', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  ];

  const modules = [
    { name: 'Leave Management', href: '/hr/leave', description: 'Manage leave requests and approvals', icon: 'event_available' },
    { name: 'Attendance Tracking', href: '/hr/attendance', description: 'Clock in/out and overtime tracking', icon: 'schedule' },
    { name: 'Payroll Processing', href: '/hr/payroll', description: 'Monthly payroll and pay slips', icon: 'payments' },
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
             <div key={stat.name} className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                        <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                    <span className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                        <span className="material-symbols-outlined text-xs mr-1">north_east</span> View
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">HR Modules</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-3">
              {modules.map((module) => (
                <Link key={module.name} href={module.href} className="group">
                  <div className="h-full bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-[#24272d] border border-slate-100 dark:border-slate-700 hover:border-[#e9590c]/30 rounded-xl p-6 transition-all hover:shadow-md flex flex-col items-center text-center cursor-pointer">
                    <div className="h-14 w-14 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-[#e9590c] mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#e9590c] transition-colors">{module.name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{module.description}</p>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
