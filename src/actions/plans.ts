"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";

// Get all plans (admin)
export async function getPlans() {
  await requireSuperAdmin();
  return prisma.plan.findMany({
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
    orderBy: { priceMonthly: "asc" },
  });
}

// Create plan
export async function createPlan(formData: FormData) {
  await requireSuperAdmin();

  const name = formData.get("name") as string;
  const priceMonthly = parseInt(formData.get("price") as string) || 0;
  const maxUsers = parseInt(formData.get("maxUsers") as string) || null;
  const maxStorageMb = parseInt(formData.get("maxStorage") as string) * 1024 || null; // Convert GB to MB

  await prisma.plan.create({
    data: {
      name,
      priceMonthly,
      maxUsers,
      maxStorageMb,
    },
  });

  revalidatePath("/admin/plans");
}

// Update plan
export async function updatePlan(formData: FormData) {
  await requireSuperAdmin();

  const planId = formData.get("planId") as string;
  const name = formData.get("name") as string;
  const priceMonthly = parseInt(formData.get("price") as string) || 0;

  await prisma.plan.update({
    where: { id: planId },
    data: {
      name,
      priceMonthly,
    },
  });

  revalidatePath("/admin/plans");
}

// Delete plan
export async function deletePlan(formData: FormData) {
  await requireSuperAdmin();

  const planId = formData.get("planId") as string;

  // Check for active subscriptions
  const activeCount = await prisma.subscription.count({
    where: { planId, status: "ACTIVE" },
  });

  if (activeCount > 0) {
    throw new Error("Cannot delete plan with active subscriptions");
  }

  await prisma.plan.delete({
    where: { id: planId },
  });

  revalidatePath("/admin/plans");
}
