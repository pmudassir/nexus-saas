"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export async function createContact(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!firstName || !email) {
    return;
  }

  await prisma.contact.create({
    data: {
      firstName,
      lastName: lastName || "",
      email,
      company,
      phone,
      status: "LEAD",
      tenantId: tenant.id,
    },
  });

  redirect("/crm");
}
