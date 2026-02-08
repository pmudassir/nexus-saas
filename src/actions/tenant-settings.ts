"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export async function updateTenantBranding(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const name = formData.get("name") as string;
  const logoUrl = formData.get("logoUrl") as string | null;
  const primaryColor = formData.get("primaryColor") as string | null;
  const secondaryColor = formData.get("secondaryColor") as string | null;

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      name: name || tenant.name,
      logoUrl: logoUrl || null,
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
    },
  });

  revalidatePath("/settings/branding");
  revalidatePath("/");
}

export async function getTenantSettings() {
  const { tenant } = await requireTenantMembership();
  
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    logoUrl: tenant.logoUrl,
    primaryColor: tenant.primaryColor,
    secondaryColor: tenant.secondaryColor,
    region: tenant.region,
    status: tenant.status,
  };
}
