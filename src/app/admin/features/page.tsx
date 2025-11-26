import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { toggleFeature } from '@/actions/features';
import { FEATURES } from '@/lib/features';
import type { Tenant, TenantFeature } from '@prisma/client';

type TenantWithFeatures = Tenant & {
  features: TenantFeature[];
};

const FEATURE_LABELS = {
  [FEATURES.WEBSITE_BUILDER]: 'Website Builder',
  [FEATURES.FINANCE]: 'Finance',
  [FEATURES.HR]: 'HR & Employee',
  [FEATURES.INVENTORY]: 'Inventory',
  [FEATURES.CRM]: 'CRM & Sales',
  [FEATURES.ANALYTICS]: 'Analytics',
  [FEATURES.PROJECTS]: 'Projects',
  [FEATURES.AUTOMATION]: 'Automation',
};

export default async function FeaturesPage() {
  const tenantsRaw = await prisma.tenant.findMany({
    include: {
      features: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const tenants = tenantsRaw as TenantWithFeatures[];

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Feature Management
          </h1>
          <p className="text-muted-foreground">
            Control which features are enabled for each tenant.
          </p>
        </div>

        <div className="rounded-md border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 sticky left-0 bg-muted border-r border-border">
                    Tenant
                  </th>
                  {Object.values(FEATURES).map((feature) => (
                    <th key={feature} className="px-4 py-3 text-center">
                      {FEATURE_LABELS[feature]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-foreground">
                {tenants.map((tenant) => {
                  const featureMap = new Map(
                    tenant.features.map((f) => [f.key, f]),
                  );

                  return (
                    <tr
                      key={tenant.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium sticky left-0 bg-white border-r border-border group-hover:bg-muted/50">
                        <div>
                          <div className="text-foreground">{tenant.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {tenant.slug}
                          </div>
                        </div>
                      </td>
                      {Object.values(FEATURES).map((featureKey) => {
                        const feature = featureMap.get(featureKey);
                        const isEnabled = feature?.enabled ?? false;

                        return (
                          <td key={featureKey} className="px-4 py-4 text-center">
                            <form action={toggleFeature}>
                              <input
                                type="hidden"
                                name="tenantId"
                                value={tenant.id}
                              />
                              <input
                                type="hidden"
                                name="featureKey"
                                value={featureKey}
                              />
                              <input
                                type="hidden"
                                name="enabled"
                                value={String(isEnabled)}
                              />
                              <button
                                type="submit"
                                className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                  isEnabled
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                                    : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                                }`}
                              >
                                {isEnabled ? 'Enabled' : 'Disabled'}
                              </button>
                            </form>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {tenants.length === 0 && (
                  <tr>
                    <td
                      colSpan={Object.keys(FEATURES).length + 1}
                      className="px-6 py-10 text-center text-muted-foreground text-sm"
                    >
                      No tenants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Feature Definitions
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(FEATURE_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="rounded-lg bg-muted border border-border p-4"
              >
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
