import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    const email = "admin@nexus.com";
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Resetting user ${email}...`);

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        isSuperAdmin: true,
      },
      create: {
        email,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
        isSuperAdmin: true,
      },
    });
    console.log("User upserted:", user.id);

    // 2. Ensure Default Tenant exists
    const tenant = await prisma.tenant.upsert({
      where: { slug: "default" },
      update: {},
      create: {
        name: "Default Tenant",
        slug: "default",
        status: "ACTIVE",
      },
    });
    console.log("Default tenant ensured:", tenant.id);

    // 3. Ensure Membership
    await prisma.tenantUser.upsert({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: user.id,
        },
      },
      update: {
        role: "TENANT_ADMIN",
      },
      create: {
        tenantId: tenant.id,
        userId: user.id,
        role: "TENANT_ADMIN",
      },
    });
    console.log("Membership ensured.");

    console.log("\n✅ Admin user reset successfully.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error resetting admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
