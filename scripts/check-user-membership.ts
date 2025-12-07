import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkUserMembership() {
  try {
    const userId = 'cm3uvcxlc0000md08kkd3lx6x';
    
    console.log("Checking user:", userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log("User found:", user ? user.email : "No user found");

    if (user) {
      const memberships = await prisma.tenantUser.findMany({
        where: { userId },
        include: { tenant: true }
      });
      
      console.log("Memberships found:", memberships.length);
      memberships.forEach(m => {
        console.log(`- Tenant: ${m.tenant.name} (${m.tenant.slug}), Role: ${m.role}`);
      });

      const defaultTenant = await prisma.tenant.findUnique({ where: { slug: 'default' } });
      if (defaultTenant) {
        console.log("Default tenant ID:", defaultTenant.id);
        const hasDefaultMembership = memberships.some(m => m.tenantId === defaultTenant.id);
        console.log("Has default tenant membership:", hasDefaultMembership);
      } else {
        console.log("Default tenant NOT found in DB");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserMembership();
