"use server";

import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { revalidatePath } from "next/cache";
import { Status, Priority } from "@prisma/client";

export async function createTask(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();
  const userId = (session.user as { id: string }).id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const projectId = formData.get("projectId") as string;
  const assigneeId = formData.get("assigneeId") as string | null;
  const priority = (formData.get("priority") as Priority) || "MEDIUM";
  const dueDate = formData.get("dueDate") as string | null;

  await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId: assigneeId || null,
      creatorId: userId,
      tenantId: tenant.id,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
}

export async function updateTaskStatus(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const taskId = formData.get("taskId") as string;
  const status = formData.get("status") as Status;

  await prisma.task.update({
    where: { 
      id: taskId,
      tenantId: tenant.id,
    },
    data: { status },
  });

  revalidatePath("/tasks");
}

export async function updateTask(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const priority = formData.get("priority") as Priority;
  const assigneeId = formData.get("assigneeId") as string | null;
  const dueDate = formData.get("dueDate") as string | null;

  await prisma.task.update({
    where: { 
      id: taskId,
      tenantId: tenant.id,
    },
    data: {
      title,
      description,
      priority,
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/tasks");
}

export async function deleteTask(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const taskId = formData.get("taskId") as string;

  await prisma.task.delete({
    where: { 
      id: taskId,
      tenantId: tenant.id,
    },
  });

  revalidatePath("/tasks");
}

export async function getTasksForUser() {
  const { tenant, session } = await requireTenantMembership();
  const userId = (session.user as { id: string }).id;

  const tasks = await prisma.task.findMany({
    where: {
      tenantId: tenant.id,
      OR: [
        { assigneeId: userId },
        { creatorId: userId },
      ],
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { dueDate: "asc" },
    ],
  });

  return tasks;
}

export async function getAllTenantTasks() {
  const { tenant } = await requireTenantMembership();

  const tasks = await prisma.task.findMany({
    where: {
      tenantId: tenant.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  return tasks;
}
