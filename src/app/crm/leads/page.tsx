import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { createLead } from '@/actions/leads';
import { LEAD_STAGES } from '@/lib/constants';
import { Target, TrendingUp, DollarSign, Users, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function LeadsPipeline() {
  const { tenant } = await requireTenantMembership();

  const now = new Date();

  const leads = await prisma.lead.findMany({
    where: { tenantId: tenant.id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.stage === 'NEW').length,
    won: leads.filter((l) => l.stage === 'WON').length,
    totalValue: leads.filter((l) => l.value).reduce((sum, l) => sum + (l.value || 0), 0),
  };

  const stageColors: Record<string, string> = {
    NEW: 'border-blue-200 bg-blue-50/80',
    CONTACTED: 'border-purple-200 bg-purple-50/80',
    QUALIFIED: 'border-indigo-200 bg-indigo-50/80',
    PROPOSAL: 'border-yellow-200 bg-yellow-50/80',
    NEGOTIATION: 'border-orange-200 bg-orange-50/80',
    WON: 'border-emerald-200 bg-emerald-50/80',
    LOST: 'border-red-200 bg-red-50/80',
  };

  const stageHeaderColors: Record<string, string> = {
    NEW: 'bg-blue-500',
    CONTACTED: 'bg-purple-500',
    QUALIFIED: 'bg-indigo-500',
    PROPOSAL: 'bg-yellow-500',
    NEGOTIATION: 'bg-orange-500',
    WON: 'bg-emerald-500',
    LOST: 'bg-red-500',
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Target className="w-8 h-8" />
              Lead Pipeline
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Track and manage leads through your sales pipeline.
            </p>
          </div>
          <Link href="/crm/today">
            <Button variant="ghost" className="rounded-full h-11 px-5 font-medium bg-white shadow-soft hover:shadow-soft-lg">
              <Calendar className="h-4 w-4 mr-2" /> Today&apos;s Follow-ups
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New Leads', value: stats.new, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Won Deals', value: stats.won, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pipeline Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</div>
                  <div className="text-2xl font-bold text-foreground mt-1">{stat.value}</div>
                </div>
                <div className={`h-11 w-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid gap-3 md:grid-cols-7">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stageHeaderColors[stage]}`} />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{stage}</h3>
                  <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-100">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {stageLeads.slice(0, 6).map((lead) => {
                    const pendingActivities = lead.activities.filter((a) => !a.completed && a.dueDate);
                    const nextFollowUp = pendingActivities
                      .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))[0];
                    const isOverdue = nextFollowUp?.dueDate && nextFollowUp.dueDate < now;
                    const lastActivity = lead.activities[0];

                    return (
                      <Link
                        key={lead.id}
                        href={`/crm/leads/${lead.id}`}
                        className={`block rounded-xl border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${stageColors[stage]}`}
                      >
                        <div className="text-sm font-bold text-foreground mb-0.5 truncate">{lead.name}</div>
                        {lead.company && (
                          <div className="text-[11px] text-muted-foreground truncate">{lead.company}</div>
                        )}
                        <div className="flex items-center justify-between mt-2 gap-1">
                          {lead.value ? (
                            <span className="text-[11px] text-emerald-700 font-bold">
                              ${lead.value.toLocaleString()}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded px-1 py-0.5">
                            {lead.score}
                          </span>
                        </div>
                        {/* Follow-up indicator */}
                        {(nextFollowUp || lastActivity) && (
                          <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1.5">
                            {isOverdue ? (
                              <>
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-red-600">Overdue</span>
                              </>
                            ) : nextFollowUp ? (
                              <>
                                <Calendar className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {nextFollowUp.dueDate!.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </>
                            ) : lastActivity ? (
                              <span className="text-[10px] text-muted-foreground">
                                Last: {lastActivity.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                  {stageLeads.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-6 opacity-60">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Form */}
        <div className="rounded-2xl bg-white p-6 shadow-soft border border-gray-100">
          <h2 className="text-lg font-bold font-display text-foreground mb-4">Add New Lead</h2>
          <form action={createLead} className="grid gap-4 md:grid-cols-5">
            <input
              type="text"
              name="name"
              required
              placeholder="Lead Name"
              className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
            />
            <input
              type="number"
              name="value"
              placeholder="Deal Value"
              className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
            />
            <Button type="submit" className="w-full rounded-full bg-black text-white hover:bg-gray-800 font-medium">
              Add Lead
            </Button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
