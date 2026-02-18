import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PERMISSIONS = [
  "settings.users.manage",
  "settings.tenant.read",
  "settings.tenant.update",
  "finance.invoice.create",
  "finance.invoice.read",
  "finance.invoice.update",
  "finance.invoice.delete",
  "finance.expense.create",
  "finance.expense.read",
  "finance.expense.update",
  "finance.expense.delete",
  "projects.project.create",
  "projects.project.read",
  "projects.project.update",
  "projects.project.delete",
  "projects.task.create",
  "projects.task.read",
  "projects.task.update",
  "projects.task.delete",
];

async function seedPermissions() {
  await prisma.permission.createMany({
    data: DEFAULT_PERMISSIONS.map((key) => {
      const [module, resource, action] = key.split(".");
      return {
        key,
        module,
        action,
        description: `${module}.${resource}.${action}`,
      };
    }),
    skipDuplicates: true,
  });
}

async function main() {
  await seedPermissions();

  const hashedPassword = await bcrypt.hash("password", 10);

  // Create default tenant first
  const tenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Default Tenant",
      slug: "default",
      status: "ACTIVE",
    },
  });

  console.log({ tenant });

  const user = await prisma.user.upsert({
    where: { email: "admin@nexus.com" },
    update: {},
    create: {
      email: "admin@nexus.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      projects: {
        create: {
          name: "Website Redesign",
          description: "Revamp the corporate website.",
          status: "ACTIVE",
          tenantId: tenant.id,
          tasks: {
            create: [
              {
                title: "Design Mockups",
                status: "TODO",
                priority: "HIGH",
                dueDate: new Date("2023-12-01"),
                tenant: {
                  connect: { id: tenant.id },
                },
                creator: {
                  connect: { email: "admin@nexus.com" },
                },
              },
              {
                title: "Frontend Implementation",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                dueDate: new Date("2023-12-15"),
                tenant: {
                  connect: { id: tenant.id },
                },
                creator: {
                  connect: { email: "admin@nexus.com" },
                },
              },
            ],
          },
        },
      },
    },
  });

  // Create tenant membership for admin user
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: user.id,
      role: "TENANT_ADMIN",
    },
  });

  console.log({ user });
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
