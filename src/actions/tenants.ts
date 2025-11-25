"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { initializeFeatures } from "./features";

export async function createTenant(formData: FormData) {
  const session = await auth();

  const isSuperAdmin = Boolean(
    session?.user && (session.user as { isSuperAdmin?: boolean }).isSuperAdmin,
  );
  if (!isSuperAdmin) {
    redirect("/");
  }

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const planId = String(formData.get("planId") ?? "").trim();

  if (!name || !slug || !planId) {
    return;
  }

  // Basic safety: ensure slug is unique
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    // In a real app, we'd surface a form error via redirect + search params
    return;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      status: "ACTIVE",
    },
  });

  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planId,
      status: "ACTIVE",
    },
  });

  // Initialize default features for the tenant
  await initializeFeatures(tenant.id);

  revalidatePath("/admin");
  redirect("/admin");
}
