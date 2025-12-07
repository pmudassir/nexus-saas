// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createDefaultTenant() {
  try {
    // Check if default tenant exists
    const existing = await prisma.tenant.findUnique({
      where: { slug: "default" },
    });

    if (existing) {
      console.log("✓ Default tenant already exists");
      return;
    }

    // Create default tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: "Default Tenant",
        slug: "default",
        status: "ACTIVE",
      },
    });

    console.log("✓ Created default tenant:", tenant.name);

    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@nexus.com" },
    });

    if (adminUser) {
      // Create tenant membership for admin
      await prisma.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: adminUser.id,
          role: "TENANT_ADMIN",
        },
      });
      console.log("✓ Added admin user to default tenant");
    }

    // Update existing projects and tasks to belong to default tenant
    const updatedProjects = await prisma.project.updateMany({
      where: { tenantId: null },
      data: { tenantId: tenant.id },
    });

    const updatedTasks = await prisma.task.updateMany({
      where: { tenantId: null },
      data: { tenantId: tenant.id },
    });

    console.log(`✓ Updated ${updatedProjects.count} projects and ${updatedTasks.count} tasks`);
    console.log("\n✅ Default tenant setup complete!");
  } catch (error) {
    console.error("❌ Error creating default tenant:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultTenant();
