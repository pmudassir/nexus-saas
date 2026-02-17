import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { createRole, deleteRole } from '@/actions/roles';
import { FEATURES } from '@/lib/features';
import { Shield, Plus, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RemoveRoleButton } from './RemoveRoleButton';

const FEATURE_LABELS: Record<string, string> = {
  [FEATURES.WEBSITE_BUILDER]: 'Site Builder',
  [FEATURES.FINANCE]: 'Finance',
  [FEATURES.HR]: 'HR',
  [FEATURES.INVENTORY]: 'Inventory',
  [FEATURES.CRM]: 'CRM',
  [FEATURES.ANALYTICS]: 'Analytics',
  [FEATURES.PROJECTS]: 'Projects',
  [FEATURES.AUTOMATION]: 'Automation',
};

export default async function RolesPage() {
  const { tenant } = await requireTenantMembership();

  // Get all custom roles with member count
  const roles = await prisma.customRole.findMany({
    where: { tenantId: tenant.id },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Get enabled features for this tenant
  const enabledFeatures = await prisma.tenantFeature.findMany({
    where: { tenantId: tenant.id, enabled: true },
    select: { key: true },
  });
  const enabledKeys = enabledFeatures.map((f) => f.key);

  return (
    <Shell>
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Role Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create custom roles to control what each team member can access.
          </p>
        </div>

        {/* Create Role Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Role
          </h2>
          <form action={createRole} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                Role Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Digital Marketing"
                className="w-full max-w-sm rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Allowed Features
              </label>
              <div className="flex flex-wrap gap-2">
                {enabledKeys.map((featureKey) => (
                  <label
                    key={featureKey}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer text-sm has-checked:bg-orange-50 has-checked:border-orange-400 has-checked:text-orange-700"
                  >
                    <input
                      type="checkbox"
                      name="feature"
                      value={featureKey}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    {FEATURE_LABELS[featureKey] || featureKey}
                  </label>
                ))}
              </div>
              {/* Hidden input to collect selected features */}
              <input type="hidden" name="featureKeys" id="featureKeysInput" />
            </div>
            <Button
              type="submit"
              className="rounded-full bg-black text-white hover:bg-gray-800 h-10 px-6 font-medium shadow-md"
              formAction={async (formData: FormData) => {
                'use server';
                // Collect checked checkboxes into the featureKeys field
                const features = formData.getAll('feature') as string[];
                formData.set('featureKeys', features.join(','));
                await createRole(formData);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Create Role
            </Button>
          </form>
        </div>

        {/* Existing Roles */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Custom Roles ({roles.length})
          </h2>

          {roles.length === 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-12 shadow-soft text-center">
              <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No custom roles yet. Create one to control team access.
              </p>
            </div>
          )}

          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{role.name}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    <Users className="w-3 h-3" />
                    {role._count.members} member{role._count.members !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.featureKeys.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No features assigned</span>
                  ) : (
                    role.featureKeys.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-100"
                      >
                        {FEATURE_LABELS[key] || key}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <RemoveRoleButton roleId={role.id} roleName={role.name} deleteRole={deleteRole} />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
