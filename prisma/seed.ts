import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

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
          tasks: {
            create: [
              {
                title: "Design Mockups",
                status: "TODO",
                priority: "HIGH",
                dueDate: new Date("2023-12-01"),
                creator: {
                  connect: { email: "admin@nexus.com" },
                },
              },
              {
                title: "Frontend Implementation",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                dueDate: new Date("2023-12-15"),
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
