"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { initializeTenantFeatures } from "@/lib/features";
import { requireSuperAdmin } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function createTenant(formData: FormData) {
  await requireSuperAdmin();

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
  await initializeTenantFeatures(tenant.id);

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

}

export async function updateTenant(formData: FormData) {
  await requireSuperAdmin();

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
  await requireSuperAdmin();

  const id = String(formData.get("id"));

  try {
    await prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({
        where: { invoice: { tenantId: id } },
      });
      await tx.purchaseOrderItem.deleteMany({
        where: { purchaseOrder: { tenantId: id } },
      });
      await tx.siteBlock.deleteMany({
        where: { page: { tenantId: id } },
      });
      await tx.task.deleteMany({ where: { tenantId: id } });
      await tx.leaveRequest.deleteMany({ where: { tenantId: id } });
      await tx.attendance.deleteMany({ where: { tenantId: id } });
      await tx.payroll.deleteMany({ where: { tenantId: id } });
      await tx.leadActivity.deleteMany({ where: { tenantId: id } });
      await tx.stockMovement.deleteMany({ where: { tenantId: id } });

      await tx.project.deleteMany({ where: { tenantId: id } });
      await tx.invoice.deleteMany({ where: { tenantId: id } });
      await tx.expense.deleteMany({ where: { tenantId: id } });
      await tx.contact.deleteMany({ where: { tenantId: id } });
      await tx.automation.deleteMany({ where: { tenantId: id } });
      await tx.purchaseOrder.deleteMany({ where: { tenantId: id } });
      await tx.product.deleteMany({ where: { tenantId: id } });
      await tx.supplier.deleteMany({ where: { tenantId: id } });
      await tx.sitePage.deleteMany({ where: { tenantId: id } });
      await tx.employee.deleteMany({ where: { tenantId: id } });
      await tx.lead.deleteMany({ where: { tenantId: id } });
      await tx.dashboardWidget.deleteMany({ where: { tenantId: id } });

      await tx.leadFieldConfig.deleteMany({ where: { tenantId: id } });
      await tx.auditLog.deleteMany({ where: { tenantId: id } });
      await tx.domain.deleteMany({ where: { tenantId: id } });
      await tx.subscription.deleteMany({ where: { tenantId: id } });
      await tx.tenantFeature.deleteMany({ where: { tenantId: id } });
      await tx.tenantUser.deleteMany({ where: { tenantId: id } });
      await tx.customRole.deleteMany({ where: { tenantId: id } });
      await tx.tenant.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    throw new Error("Failed to delete tenant and all related data.");
  }

  revalidatePath("/admin");
}
