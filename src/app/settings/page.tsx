import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { getUserPermissions } from "@/lib/features";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Shield,
  Palette,
  CreditCard,
  FileText,
  ListChecks,
  ChevronRight,
} from "lucide-react";

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

  const cards = [
    { href: "/settings/team", label: "Team", desc: "Invite and manage members", icon: Users, show: canManageUsers },
    { href: "/settings/roles", label: "Roles", desc: "Define custom role access", icon: Shield, show: canManageUsers },
    { href: "/settings/permissions", label: "Permissions", desc: "Fine-grained user actions", icon: ListChecks, show: canManageUsers },
    { href: "/settings/lead-fields", label: "Lead Fields", desc: "Customize CRM lead forms", icon: FileText, show: canManageUsers },
    { href: "/settings/branding", label: "Branding", desc: "Workspace logo and colors", icon: Palette, show: canManageTenant },
    { href: "/settings/billing", label: "Billing", desc: "Plan, usage, and subscription", icon: CreditCard, show: canManageTenant },
    { href: "/settings/audit", label: "Audit Logs", desc: "View important system activity", icon: FileText, show: canManageUsers || canManageTenant },
  ].filter((c) => c.show);

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Configure workspace access, branding, billing, and governance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group">
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-soft hover:shadow-soft-lg hover:border-orange-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{card.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
