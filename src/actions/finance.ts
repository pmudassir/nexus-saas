"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireTenantPermission } from "@/lib/tenant-auth";
import { PERMISSION_KEYS } from "@/lib/permission-keys";

export async function createExpense(formData: FormData) {
  const { session, tenant } = await requireTenantPermission(
    PERMISSION_KEYS.FINANCE_EXPENSE_CREATE,
  );

  // Session is already validated in requireTenantMembership
  const userId = (session.user as { id: string }).id;

  const description = String(formData.get("description") ?? "").trim();
  const rawCategory = String(formData.get("category") ?? "").trim();
  const category = rawCategory || "General";
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const dateRaw = String(formData.get("date") ?? "").trim();

  const amount = Number.parseFloat(amountRaw);
  const date = dateRaw ? new Date(dateRaw) : new Date();

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  await prisma.expense.create({
    data: {
      description,
      category,
      amount,
      date,
      userId,
      tenantId: tenant.id,
    },
  });

  redirect("/finance/expenses");
}
