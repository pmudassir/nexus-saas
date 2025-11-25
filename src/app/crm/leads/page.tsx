import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { createLead, updateLeadStage, LEAD_STAGES } from '@/actions/leads';
import { Target, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function LeadsPipeline() {
  const { tenant } = await requireTenantMembership();

  const leads = await prisma.lead.findMany({
    where: { tenantId: tenant.id },
    include: { activities: true },
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.stage === 'NEW').length,
    qualified: leads.filter((l) => l.stage === 'QUALIFIED').length,
    won: leads.filter((l) => l.stage === 'WON').length,
    totalValue: leads.filter((l) => l.value).reduce((sum, l) => sum + (l.value || 0), 0),
  };

  const stageColors: Record<string, string> = {
    NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    CONTACTED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    QUALIFIED: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    PROPOSAL: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    NEGOTIATION: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    WON: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Target className="w-8 h-8" />
              CRM Lead Pipeline
            </h1>
            <p className="text-slate-400 mt-2">
              Kanban-style lead management with scoring and activity tracking.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Leads</div>
                <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
              </div>
              <Users className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">New Leads</div>
                <div className="text-3xl font-bold text-blue-400 mt-1">{stats.new}</div>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Won Deals</div>
                <div className="text-3xl font-bold text-emerald-400 mt-1">{stats.won}</div>
              </div>
              <Target className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Pipeline Value</div>
                <div className="text-3xl font-bold text-white mt-1">${stats.totalValue.toLocaleString()}</div>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-4 md:grid-cols-7">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">{stage}</h3>
                  <div className="text-xs text-slate-400 mt-1">{stageLeads.length} leads</div>
                </div>
                <div className="space-y-3">
                  {stageLeads.slice(0, 5).map((lead) => (
                    <div
                      key={lead.id}
                      className={`rounded-lg border p-3 ${stageColors[stage]}`}
                    >
                      <div className="text-sm font-semibold text-white mb-1">{lead.name}</div>
                      {lead.company && (
                        <div className="text-xs text-slate-400">{lead.company}</div>
                      )}
                      {lead.value && (
                        <div className="text-xs text-emerald-400 mt-2">
                          ${lead.value.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <div className="text-xs text-slate-500">Score:</div>
                        <div className="text-xs font-semibold text-indigo-400">{lead.score}/100</div>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-xs text-slate-600 text-center py-4">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Form */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Lead</h2>
          <form action={createLead} className="grid gap-4 md:grid-cols-5">
            <input type="text" name="name" required placeholder="Lead Name" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" />
            <input type="email" name="email" placeholder="Email" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" />
            <input type="text" name="company" placeholder="Company" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" />
            <input type="number" name="value" placeholder="Deal Value" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" />
            <Button type="submit" className="w-full">Add Lead</Button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
