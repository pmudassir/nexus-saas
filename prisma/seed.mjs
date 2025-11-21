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
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Revamp the corporate website.",
      status: "ACTIVE",
      ownerId: user.id,
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
      },
      {
        title: "Frontend Implementation",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: new Date("2023-12-15"),
        projectId: project.id,
        creatorId: user.id,
      },
    ],
  });

  console.log({ user, project });
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
