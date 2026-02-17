import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { completeActivity } from '@/actions/leads';
import {
  CalendarCheck,
  Phone,
  Mail,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default async function TodayPage() {
  const { tenant } = await requireTenantMembership();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [todayActivities, overdueActivities] = await Promise.all([
    prisma.leadActivity.findMany({
      where: {
        tenantId: tenant.id,
        completed: false,
        dueDate: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      include: {
        lead: true,
      },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.leadActivity.findMany({
      where: {
        tenantId: tenant.id,
        completed: false,
        dueDate: {
          lt: todayStart,
        },
      },
      include: {
        lead: true,
      },
      orderBy: { dueDate: 'asc' },
    }),
  ]);

  const activityTypeIcons: Record<string, typeof Phone> = {
    CALL: Phone,
    EMAIL: Mail,
    MEETING: Users,
    NOTE: MessageSquare,
  };

  const activityTypeColors: Record<string, string> = {
    CALL: 'bg-blue-50 text-blue-600 border-blue-100',
    EMAIL: 'bg-purple-50 text-purple-600 border-purple-100',
    MEETING: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    NOTE: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  type ActivityItem = (typeof todayActivities)[number];

  const renderActivityCard = (activity: ActivityItem, isOverdue: boolean) => {
    const Icon = activityTypeIcons[activity.type] || MessageSquare;
    return (
      <div
        key={activity.id}
        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-soft ${
          isOverdue
            ? 'bg-red-50/50 border-red-100'
            : 'bg-white border-gray-100'
        }`}
      >
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${activityTypeColors[activity.type]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-foreground">{activity.subject}</span>
            {isOverdue && (
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                OVERDUE
              </span>
            )}
          </div>
          <Link
            href={`/crm/leads/${activity.leadId}`}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
          >
            {activity.lead.name} <ArrowRight className="w-3 h-3" />
          </Link>
          {activity.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {activity.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {activity.type}
            </span>
            {activity.dueDate && (
              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                {isOverdue
                  ? `Was due ${activity.dueDate.toLocaleDateString()}`
                  : `Due ${activity.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            )}
          </div>
        </div>
        <form action={completeActivity}>
          <input type="hidden" name="activityId" value={activity.id} />
          <button
            type="submit"
            className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-muted-foreground transition-all shadow-sm"
            title="Mark complete"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6 max-w-[900px] mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <CalendarCheck className="w-8 h-8" />
            Today&apos;s Follow-ups
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayActivities.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Due today</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overdueActivities.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Overdue</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayActivities.length + overdueActivities.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total pending</p>
            </div>
          </div>
        </div>

        {/* Overdue Activities */}
        {overdueActivities.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Overdue ({overdueActivities.length})
            </h2>
            <div className="space-y-3">
              {overdueActivities.map((a) => renderActivityCard(a, true))}
            </div>
          </div>
        )}

        {/* Today's Activities */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Due Today ({todayActivities.length})
          </h2>
          {todayActivities.length === 0 && overdueActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center">
              <CalendarCheck className="w-14 h-14 mx-auto mb-4 text-muted-foreground/20" />
              <h3 className="text-lg font-bold text-foreground mb-2">All clear!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No follow-ups scheduled for today. Head to the{' '}
                <Link href="/crm/leads" className="text-orange-600 hover:underline font-medium">
                  Lead Pipeline
                </Link>{' '}
                to schedule some.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayActivities.map((a) => renderActivityCard(a, false))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
