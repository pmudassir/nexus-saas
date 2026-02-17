import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import type { Tenant } from "@prisma/client";
import type { Session } from "next-auth";

export type TenantMembershipContext = {
  session: Session;
  tenant: Tenant;
  isSuperAdmin: boolean;
};

export async function requireTenantMembership(): Promise<TenantMembershipContext> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { id?: string; isSuperAdmin?: boolean };
  if (!user.id) {
    redirect("/login");
  }

  const tenant = await getCurrentTenant("app", user.id);

  if (!tenant) {
    // Check if user has ANY tenant membership
    const anyMembership = await prisma.tenantUser.findFirst({
      where: { userId: user.id },
    });
    if (!anyMembership) {
      redirect("/onboarding");
    }
    redirect("/");
  }

  const isSuperAdmin = Boolean(user.isSuperAdmin);

  if (!isSuperAdmin) {
    const membership = await prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      redirect("/");
    }
  }

  return {
    session: session as Session,
    tenant,
    isSuperAdmin,
  };
}
