"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export async function createEmployee(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const salaryRaw = String(formData.get("salary") ?? "").trim();
  const hireDateRaw = String(formData.get("hireDate") ?? "").trim();

  const salary = Number.parseFloat(salaryRaw || "0");
  const hireDate = hireDateRaw ? new Date(hireDateRaw) : new Date();

  if (!firstName || !email || !department || !position || !Number.isFinite(salary) || salary <= 0) {
    return;
  }

  await prisma.employee.create({
    data: {
      firstName,
      lastName: lastName || "",
      email,
      department,
      position,
      salary,
      hireDate,
      status: "ACTIVE",
      tenantId: tenant.id,
    },
  });

  redirect("/hr");
}
