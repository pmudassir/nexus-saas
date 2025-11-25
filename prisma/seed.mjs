import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const plan = await prisma.plan.upsert({
    where: { name: "Pro Management" },
    update: {},
    create: {
      name: "Pro Management",
      description: "Full business management suite",
      priceMonthly: 4900,
      currency: "USD",
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Default Tenant",
      slug: "default",
      status: "ACTIVE",
      region: "us-east-1",
    },
  });

  await prisma.subscription.upsert({
    where: {
      tenantId_planId: {
        tenantId: tenant.id,
        planId: plan.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      planId: plan.id,
      status: "ACTIVE",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "admin@nexus.com" },
    update: {
      isSuperAdmin: true,
    },
    create: {
      email: "admin@nexus.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      isSuperAdmin: true,
    },
  });

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

  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Revamp the corporate website.",
      status: "ACTIVE",
      ownerId: user.id,
      tenantId: tenant.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Design Mockups",
        status: "TODO",
        priority: "HIGH",
        dueDate: new Date("2023-12-01"),
        projectId: project.id,
        creatorId: user.id,
        tenantId: tenant.id,
      },
      {
        title: "Frontend Implementation",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: new Date("2023-12-15"),
        projectId: project.id,
        creatorId: user.id,
        tenantId: tenant.id,
      },
    ],
  });
  // Seed some basic finance data for the default tenant
  await prisma.contact.createMany({
    data: [
      {
        firstName: "Acme",
        lastName: "Corp",
        email: "billing@acme.test",
        company: "Acme Corp",
        tenantId: tenant.id,
      },
      {
        firstName: "Globex",
        lastName: "Inc",
        email: "accounts@globex.test",
        company: "Globex Inc",
        tenantId: tenant.id,
      },
    ],
    skipDuplicates: true,
  });

  const firstContact = await prisma.contact.findFirst({
    where: { tenantId: tenant.id },
  });

  if (firstContact) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-1001",
        status: "PAID",
        dueDate: new Date(),
        totalAmount: 1250,
        tenantId: tenant.id,
        clientId: firstContact.id,
        items: {
          create: [
            {
              description: "Initial setup fee",
              quantity: 1,
              unitPrice: 1250,
              total: 1250,
            },
          ],
        },
      },
    });

    await prisma.expense.createMany({
      data: [
        {
          description: "Software subscription",
          amount: 99,
          category: "SaaS",
          date: new Date(),
          userId: user.id,
          tenantId: tenant.id,
        },
        {
          description: "Team lunch",
          amount: 150,
          category: "Meals",
          date: new Date(),
          userId: user.id,
          tenantId: tenant.id,
        },
      ],
    });
  }

  // Seed some basic HR data for the default tenant
  await prisma.employee.createMany({
    data: [
      {
        firstName: "Alice",
        lastName: "Freeman",
        email: "alice@nexus.com",
        phone: "+1 (555) 123-4567",
        position: "Senior Developer",
        department: "Engineering",
        salary: 120000,
        hireDate: new Date("2022-01-10"),
        status: "ACTIVE",
        tenantId: tenant.id,
      },
      {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob@nexus.com",
        phone: "+1 (555) 234-5678",
        position: "Product Manager",
        department: "Product",
        salary: 110000,
        hireDate: new Date("2022-03-15"),
        status: "ACTIVE",
        tenantId: tenant.id,
      },
      {
        firstName: "Charlie",
        lastName: "Davis",
        email: "charlie@nexus.com",
        phone: "+1 (555) 345-6789",
        position: "UX Designer",
        department: "Design",
        salary: 90000,
        hireDate: new Date("2023-02-01"),
        status: "ON_LEAVE",
        tenantId: tenant.id,
      },
    ],
    skipDuplicates: true,
  });

  const hrEmployees = await prisma.employee.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
    take: 2,
  });

  if (hrEmployees.length > 0) {
    await prisma.payroll.createMany({
      data: hrEmployees.map((employee, index) => ({
        employeeId: employee.id,
        tenantId: tenant.id,
        payPeriod: "Oct 2023",
        amount: index === 0 ? 9500 : 8200,
        status: "PAID",
        paymentDate: new Date(),
      })),
    });
  }

  // Seed some basic inventory data for the default tenant
  await prisma.product.createMany({
    data: [
      {
        name: "MacBook Pro 16-inch",
        category: "Electronics",
        sku: "MBP-16-M3",
        stock: 45,
        price: 2499,
        status: "IN_STOCK",
        tenantId: tenant.id,
      },
      {
        name: "Ergonomic Office Chair",
        category: "Furniture",
        sku: "CHR-ERGO-V2",
        stock: 12,
        price: 599,
        status: "LOW_STOCK",
        tenantId: tenant.id,
      },
      {
        name: "Wireless Mechanical Keyboard",
        category: "Electronics",
        sku: "KB-MECH-WL",
        stock: 128,
        price: 149,
        status: "IN_STOCK",
        tenantId: tenant.id,
      },
      {
        name: "27-inch 4K Monitor",
        category: "Electronics",
        sku: "MON-4K-27",
        stock: 0,
        price: 499,
        status: "OUT_OF_STOCK",
        tenantId: tenant.id,
      },
      {
        name: "Standing Desk Frame",
        category: "Furniture",
        sku: "DSK-STD-FRM",
        stock: 8,
        price: 399,
        status: "LOW_STOCK",
        tenantId: tenant.id,
      },
    ],
    skipDuplicates: true,
  });

  // Seed a simple marketing homepage for the default tenant
  const homePage = await prisma.sitePage.upsert({
    where: {
      tenantId_path: {
        tenantId: tenant.id,
        path: "/",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      title: "Home",
      path: "/",
      isHome: true,
    },
  });

  await prisma.siteBlock.upsert({
    where: {
      // There is no natural unique content key, so we use a composite of pageId+order via @@unique not defined.
      // For seeding purposes, fall back to id-based upsert by using a fixed id.
      id: homePage.id,
    },
    update: {},
    create: {
      id: homePage.id,
      pageId: homePage.id,
      order: 0,
      type: "HERO",
      data: {
        heading: "Welcome to Default Tenant",
        subheading: "Your new multi-tenant SaaS workspace",
        ctaLabel: "Get Started",
      },
    },
  });

  console.log({ user, tenant, plan, project, homePage });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
