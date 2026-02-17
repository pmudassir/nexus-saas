import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { getUserPermissions, hasPermission } from "@/lib/features";
import type { Tenant } from "@prisma/client";
import type { Session } from "next-auth";
import { cache } from "react";

export type TenantMembershipContext = {
  session: Session;
  tenant: Tenant;
  isSuperAdmin: boolean;
};

const getTenantMembershipContext = cache(async (): Promise<TenantMembershipContext> => {
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
      if (user.isSuperAdmin) {
        redirect("/admin");
      }
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
});

export async function requireTenantMembership(): Promise<TenantMembershipContext> {
  return getTenantMembershipContext();
}

export async function requireTenantPermission(
  permissionKey: string,
): Promise<TenantMembershipContext> {
  const context = await requireTenantMembership();

  if (context.isSuperAdmin) {
    return context;
  }

  const user = context.session.user as { id?: string };
  if (!user.id) {
    redirect("/login");
  }

  const allowed = await hasPermission(user.id, context.tenant.id, permissionKey);
  if (!allowed) {
    throw new Error(`Forbidden: missing permission ${permissionKey}`);
  }

  return context;
}

export async function requireFeatureAccess(
  featureKey: string,
): Promise<TenantMembershipContext> {
  const context = await requireTenantMembership();

  if (context.isSuperAdmin) {
    return context;
  }

  const user = context.session.user as { id?: string };
  if (!user.id) {
    redirect("/login");
  }

  const [membership, feature] = await Promise.all([
    prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId: context.tenant.id,
          userId: user.id,
        },
      },
      include: {
        customRole: true,
      },
    }),
    prisma.tenantFeature.findUnique({
      where: {
        tenantId_key: {
          tenantId: context.tenant.id,
          key: featureKey,
        },
      },
    }),
  ]);

  if (!membership) {
    redirect("/");
  }

  if (!feature?.enabled) {
    redirect("/");
  }

  if (
    membership.role === "CUSTOM" &&
    membership.customRole &&
    !membership.customRole.featureKeys.includes(featureKey)
  ) {
    redirect("/");
  }

  return context;
}

export async function requireAnyTenantPermission(
  permissionKeys: string[],
): Promise<TenantMembershipContext> {
  const context = await requireTenantMembership();

  if (context.isSuperAdmin) {
    return context;
  }

  const user = context.session.user as { id?: string };
  if (!user.id) {
    redirect("/login");
  }

  const membership = await prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId: context.tenant.id,
        userId: user.id,
      },
    },
    select: {
      role: true,
    },
  });

  if (membership?.role === "TENANT_ADMIN") {
    return context;
  }

  const userPermissions = await getUserPermissions(user.id, context.tenant.id);
  const hasAnyPermission = permissionKeys.some((key) =>
    userPermissions.includes(key),
  );
  if (hasAnyPermission) {
    return context;
  }

  redirect("/");
}
