import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { createLead, updateLeadStage } from '@/actions/leads';
import { LEAD_STAGES } from '@/lib/constants';
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
    NEW: 'bg-blue-50 text-blue-700 border-blue-100',
    CONTACTED: 'bg-purple-50 text-purple-700 border-purple-100',
    QUALIFIED: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    PROPOSAL: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    NEGOTIATION: 'bg-orange-50 text-orange-700 border-orange-100',
    WON: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    LOST: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Target className="w-8 h-8" />
              CRM Lead Pipeline
            </h1>
            <p className="text-muted-foreground mt-2">
              Kanban-style lead management with scoring and activity tracking.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
                <div className="text-3xl font-bold text-foreground mt-1">{stats.total}</div>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">New Leads</div>
                <div className="text-3xl font-bold text-blue-600 mt-1">{stats.new}</div>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Won Deals</div>
                <div className="text-3xl font-bold text-emerald-600 mt-1">{stats.won}</div>
              </div>
              <Target className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
                <div className="text-3xl font-bold text-foreground mt-1">${stats.totalValue.toLocaleString()}</div>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-4 md:grid-cols-7">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="rounded-md border border-border bg-muted/50 p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{stageLeads.length} leads</div>
                </div>
                <div className="space-y-3">
                  {stageLeads.slice(0, 5).map((lead) => (
                    <div
                      key={lead.id}
                      className={`rounded-md border p-3 shadow-sm ${stageColors[stage]}`}
                    >
                      <div className="text-sm font-semibold text-foreground mb-1">{lead.name}</div>
                      {lead.company && (
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      )}
                      {lead.value && (
                        <div className="text-xs text-emerald-600 mt-2 font-medium">
                          ${lead.value.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <div className="text-xs text-muted-foreground">Score:</div>
                        <div className="text-xs font-semibold text-indigo-600">{lead.score}/100</div>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Form */}
        <div className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Add New Lead</h2>
          <form action={createLead} className="grid gap-4 md:grid-cols-5">
            <input type="text" name="name" required placeholder="Lead Name" className="rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <input type="email" name="email" placeholder="Email" className="rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <input type="text" name="company" placeholder="Company" className="rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <input type="number" name="value" placeholder="Deal Value" className="rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">Add Lead</Button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
