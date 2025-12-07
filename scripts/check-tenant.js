const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkTenant() {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "default" },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });

    if (tenant) {
      console.log("✓ Default tenant exists:");
      console.log("  ID:", tenant.id);
      console.log("  Name:", tenant.name);
      console.log("  Slug:", tenant.slug);
      console.log("  Status:", tenant.status);
      console.log("  Memberships:", tenant.memberships.length);
      
      tenant.memberships.forEach((m) => {
        console.log(`    - ${m.user.email} (${m.role})`);
      });
    } else {
      console.log("✗ Default tenant NOT found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTenant();
