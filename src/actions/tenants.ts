"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { initializeFeatures } from "./features";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

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
  const adminEmail = String(formData.get("adminEmail") ?? "").trim().toLowerCase();
  const adminPassword = String(formData.get("adminPassword") ?? "").trim();
  const adminName = String(formData.get("adminName") ?? "").trim();

  if (!name || !slug || !planId) {
    return;
  }

  // Basic safety: ensure slug is unique
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
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
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Initialize default features for the tenant
  await initializeFeatures(tenant.id);

  // Create admin user for the tenant if email + password provided
  if (adminEmail && adminPassword) {
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName || adminEmail.split("@")[0],
          password: hashedPassword,
        },
      });
    }

    // Add as TENANT_ADMIN
    await prisma.tenantUser.upsert({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: adminUser.id,
        },
      },
      update: { role: "TENANT_ADMIN" },
      create: {
        tenantId: tenant.id,
        userId: adminUser.id,
        role: "TENANT_ADMIN",
      },
    });
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateTenant(formData: FormData) {
  const session = await auth();
  const isSuperAdmin = Boolean(
    session?.user && (session.user as { isSuperAdmin?: boolean }).isSuperAdmin,
  );
  if (!isSuperAdmin) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));
  // Optional status update if provided
  const statusRaw = formData.get("status");
  
  const data: Prisma.TenantUpdateInput = {
    name,
    slug,
  };
  
  if (statusRaw) {
    data.status = statusRaw as Prisma.TenantUpdateInput["status"];
  }

  await prisma.tenant.update({
    where: { id },
    data,
  });

  revalidatePath("/admin");
}

export async function deleteTenant(formData: FormData) {
  const session = await auth();
  const isSuperAdmin = Boolean(
    session?.user && (session.user as { isSuperAdmin?: boolean }).isSuperAdmin,
  );
  if (!isSuperAdmin) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id"));

  // Delete dependencies first to avoid FK constraints
  // Note: This covers basic relations. If tenants have created Projects/Tasks etc, 
  // those need to be deleted too or this will fail.
  // For a full system reset, we'd need a recursive delete or DB CASADE.
  try {
    await prisma.$transaction([
      prisma.subscription.deleteMany({ where: { tenantId: id } }),
      prisma.tenantUser.deleteMany({ where: { tenantId: id } }),
      prisma.tenantFeature.deleteMany({ where: { tenantId: id } }),
      // Add other cleanups as needed
      prisma.tenant.delete({ where: { id } }),
    ]);
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    throw new Error("Failed to delete tenant. It may have related data.");
  }

  revalidatePath("/admin");
}
