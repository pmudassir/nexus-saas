import { Shell } from '@/components/layout/Shell';
import { getWorkspaceStats } from '@/actions/workspace';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Target,
  UserCheck,
  DollarSign,
  BookUser,
  ArrowRight,
  Activity,
  Clock,
} from 'lucide-react';

export default async function WorkspacePage() {
  const stats = await getWorkspaceStats();

  const cards = [
    {
      label: 'Team Members',
      value: stats.membershipsCount,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/settings/team',
    },
    {
      label: 'Employees',
      value: stats.employeesCount,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/hr/employees',
    },
    {
      label: 'Open Leads',
      value: stats.openLeadsCount,
      icon: Target,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/crm/leads',
    },
    {
      label: 'Won Deals',
      value: stats.wonLeadsCount,
      icon: Briefcase,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      href: '/crm/leads',
    },
    {
      label: 'Contacts',
      value: stats.contactsCount,
      icon: BookUser,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/crm',
    },
    {
      label: 'Pipeline Value',
      value: `$${stats.pipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      href: '/crm/leads',
    },
  ];

  const actionLabels: Record<string, string> = {
    CONTACT_CREATED: 'added a contact',
    CONTACT_UPDATED: 'updated a contact',
    CONTACT_DELETED: 'deleted a contact',
    LEAD_CREATED: 'created a lead',
    LEAD_DELETED: 'deleted a lead',
    FOLLOW_UP_SCHEDULED: 'scheduled a follow-up',
    EMPLOYEE_CREATED: 'added an employee',
    EMPLOYEE_UPDATED: 'updated an employee',
    EMPLOYEE_TERMINATED: 'terminated an employee',
    TEAM_MEMBER_ADDED: 'added a team member',
    TEAM_MEMBER_REMOVED: 'removed a team member',
    TENANT_ONBOARDED: 'onboarded the workspace',
  };

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            {stats.tenantName}
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Workspace overview — monitor team activity and key metrics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 hover:shadow-soft-lg transition-all group"
            >
              <div className={`h-10 w-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links + Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Lead Pipeline', href: '/crm/leads', icon: Target },
                { label: 'Today\'s Follow-ups', href: '/crm/today', icon: Clock },
                { label: 'Contacts', href: '/crm', icon: BookUser },
                { label: 'HR Dashboard', href: '/hr', icon: UserCheck },
                { label: 'Team Settings', href: '/settings/team', icon: Users },
                { label: 'Projects', href: '/projects', icon: Briefcase },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-foreground transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors text-muted-foreground">
                    <link.icon className="w-4 h-4" />
                  </div>
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Recent Activity
            </h2>
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Activity className="w-10 h-10 mx-auto mb-2 opacity-20" />
                No activity yet. Start using the platform to see activity here.
              </div>
            ) : (
              <div className="space-y-1">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-foreground shrink-0 mt-0.5">
                      {activity.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-bold">{activity.userName}</span>{' '}
                        <span className="text-muted-foreground">
                          {actionLabels[activity.action] || activity.action.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.entity} • {activity.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
