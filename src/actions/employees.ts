'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createEmployee(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const position = formData.get('position') as string;
  const department = formData.get('department') as string;
  const salary = parseFloat(formData.get('salary') as string) || 0;

  if (!name || !email || !position) {
    throw new Error('Name, email, and position are required');
  }

  const employee = await prisma.employee.create({
    data: {
      name,
      email,
      position,
      department: department || null,
      salary,
      tenantId: tenant.id,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'CREATE',
      entity: 'Employee',
      entityId: employee.id,
      metadata: { name, position },
    },
  });

  revalidatePath('/hr/employees');
  revalidatePath('/hr');
}

export async function updateEmployee(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const position = formData.get('position') as string;
  const department = formData.get('department') as string;
  const salary = parseFloat(formData.get('salary') as string) || 0;
  const status = formData.get('status') as string;

  if (!id) {
    throw new Error('Employee ID is required');
  }

  // Verify employee belongs to tenant
  const existing = await prisma.employee.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!existing) {
    throw new Error('Employee not found');
  }

  await prisma.employee.update({
    where: { id },
    data: {
      name: name || existing.name,
      email: email || existing.email,
      position: position || existing.position,
      department: department || existing.department,
      salary: salary || existing.salary,
      status: status || existing.status,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'UPDATE',
      entity: 'Employee',
      entityId: id,
    },
  });

  revalidatePath('/hr/employees');
  revalidatePath('/hr');
}

export async function terminateEmployee(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Employee ID is required');
  }

  // Verify employee belongs to tenant
  const existing = await prisma.employee.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!existing) {
    throw new Error('Employee not found');
  }

  await prisma.employee.update({
    where: { id },
    data: { status: 'TERMINATED' },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'TERMINATE',
      entity: 'Employee',
      entityId: id,
      metadata: { previousStatus: existing.status },
    },
  });

  revalidatePath('/hr/employees');
  revalidatePath('/hr');
}

export async function getEmployees(tenantId: string) {
  return prisma.employee.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
}


