import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { scheduleFollowUp, completeActivity, updateLeadStage } from '@/actions/leads';
import { LEAD_STAGES, ACTIVITY_TYPES } from '@/lib/constants';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenant } = await requireTenantMembership();

  const lead = await prisma.lead.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Lead not found.</p>
          <Link href="/crm/leads" className="text-orange-600 font-medium mt-2 hover:underline">
            ← Back to Pipeline
          </Link>
        </div>
      </Shell>
    );
  }

  const now = new Date();
  const pendingActivities = lead.activities.filter((a) => !a.completed);
  const completedActivities = lead.activities.filter((a) => a.completed);
  const nextFollowUp = pendingActivities
    .filter((a) => a.dueDate)
    .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))[0];
  const lastActivity = lead.activities[0];
  const overdueCount = pendingActivities.filter(
    (a) => a.dueDate && a.dueDate < now
  ).length;

  const stageIndex = LEAD_STAGES.indexOf(lead.stage as typeof LEAD_STAGES[number]);

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

  return (
    <Shell>
      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
        {/* Back Link + Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/crm/leads"
            className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:shadow-soft-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {lead.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {lead.company && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <Building2 className="w-3.5 h-3.5" /> {lead.company}
                </span>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {lead.phone}
                </a>
              )}
            </div>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">{overdueCount} overdue</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Stage</p>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-lg font-bold text-foreground">{lead.stage}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {LEAD_STAGES.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= stageIndex
                      ? lead.stage === 'WON' ? 'bg-emerald-500' : lead.stage === 'LOST' ? 'bg-red-400' : 'bg-orange-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Score</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="text-lg font-bold text-foreground">{lead.score}/100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${lead.score}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Deal Value</p>
            <p className="text-lg font-bold text-emerald-600">
              {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Next Follow-up</p>
            {nextFollowUp ? (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className={`text-sm font-bold ${nextFollowUp.dueDate! < now ? 'text-red-600' : 'text-foreground'}`}>
                  {nextFollowUp.dueDate!.toLocaleDateString()}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None scheduled</p>
            )}
            {lastActivity && (
              <p className="text-xs text-muted-foreground mt-1">
                Last: {lastActivity.type} on {lastActivity.createdAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Stage Update + Schedule Follow-up */}
          <div className="space-y-6">
            {/* Update Stage */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">Move Stage</h3>
              <div className="grid grid-cols-2 gap-2">
                {LEAD_STAGES.map((stage) => (
                  <form key={stage} action={updateLeadStage}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <input type="hidden" name="stage" value={stage} />
                    <button
                      type="submit"
                      disabled={lead.stage === stage}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                        lead.stage === stage
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-gray-50 text-muted-foreground border-gray-100 hover:bg-gray-100 hover:text-foreground'
                      } disabled:opacity-70`}
                    >
                      {stage}
                    </button>
                  </form>
                ))}
              </div>
            </div>

            {/* Schedule Follow-up */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">Schedule Follow-up</h3>
              <form action={scheduleFollowUp} className="space-y-3">
                <input type="hidden" name="leadId" value={lead.id} />
                <select
                  name="type"
                  required
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Follow-up subject..."
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                />
                <textarea
                  name="description"
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all resize-none"
                />
                <input
                  type="date"
                  name="dueDate"
                  required
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                />
                <Button type="submit" className="w-full rounded-full bg-orange-600 text-white hover:bg-orange-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" /> Schedule
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Activity Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Activities */}
            {pendingActivities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Upcoming ({pendingActivities.length})
                </h3>
                <div className="space-y-3">
                  {pendingActivities.map((activity) => {
                    const Icon = activityTypeIcons[activity.type] || MessageSquare;
                    const isOverdue = activity.dueDate && activity.dueDate < now;
                    return (
                      <div
                        key={activity.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border ${
                          isOverdue ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${activityTypeColors[activity.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{activity.subject}</span>
                            {isOverdue && (
                              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">OVERDUE</span>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{activity.type}</span>
                            {activity.dueDate && (
                              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                                Due: {activity.dueDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <form action={completeActivity}>
                          <input type="hidden" name="activityId" value={activity.id} />
                          <button
                            type="submit"
                            className="h-9 w-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-muted-foreground transition-all shadow-sm"
                            title="Mark complete"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Activity History ({completedActivities.length + pendingActivities.filter(a => !a.dueDate).length})
              </h3>
              {lead.activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No activities yet. Schedule a follow-up to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {completedActivities.map((activity) => {
                    const Icon = activityTypeIcons[activity.type] || MessageSquare;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100 opacity-70"
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${activityTypeColors[activity.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm text-foreground line-through">{activity.subject}</span>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{activity.type}</span>
                            <span className="text-xs text-muted-foreground">
                              {activity.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
