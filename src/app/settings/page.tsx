import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { getUserPermissions } from "@/lib/features";
import { prisma } from "@/lib/prisma";

export default async function SettingsIndexPage() {
  const { tenant, session, isSuperAdmin } = await requireTenantMembership();
  const userId = (session.user as { id?: string }).id;

  let canManageUsers = false;
  let canManageTenant = false;

  if (isSuperAdmin) {
    canManageUsers = true;
    canManageTenant = true;
  } else if (userId) {
    const membership = await prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (membership?.role === "TENANT_ADMIN") {
      canManageUsers = true;
      canManageTenant = true;
    } else {
      const permissionKeys = await getUserPermissions(userId, tenant.id);
      canManageUsers = permissionKeys.includes("settings.users.manage");
      canManageTenant =
        permissionKeys.includes("settings.tenant.read") ||
        permissionKeys.includes("settings.tenant.update");
    }
  }

  const iconMap: Record<string, string> = {
    Team: "group",
    Roles: "shield",
    Permissions: "checklist",
    "Lead Fields": "description",
    Branding: "palette",
    Billing: "credit_card",
    "Audit Logs": "history",
  };

  const cards = [
    { href: "/settings/team", label: "Team", desc: "Invite and manage members", show: canManageUsers },
    { href: "/settings/roles", label: "Roles", desc: "Define custom role access", show: canManageUsers },
    { href: "/settings/permissions", label: "Permissions", desc: "Fine-grained user actions", show: canManageUsers },
    { href: "/settings/lead-fields", label: "Lead Fields", desc: "Customize CRM lead forms", show: canManageUsers },
    { href: "/settings/branding", label: "Branding", desc: "Workspace logo and colors", show: canManageTenant },
    { href: "/settings/billing", label: "Billing", desc: "Plan, usage, and subscription", show: canManageTenant },
    { href: "/settings/audit", label: "Audit Logs", desc: "View important system activity", show: canManageUsers || canManageTenant },
  ].filter((c) => c.show);

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">settings</span>
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Configure workspace access, branding, billing, and governance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group">
              <div className="h-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#24272d] p-6 shadow-sm hover:shadow-md hover:border-[#e9590c]/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[#e9590c]/10 text-[#e9590c]">
                    <span className="material-symbols-outlined">{iconMap[card.label]}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400">chevron_right</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{card.label}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
