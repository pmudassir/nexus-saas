'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { format } from 'date-fns';

export async function generatePayroll(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const payPeriod = formData.get('payPeriod') as string;

  if (!payPeriod) {
    throw new Error('Pay period is required');
  }

  // Get all active employees with salaries
  const employees = await prisma.employee.findMany({
    where: { tenantId: tenant.id, status: 'ACTIVE' },
  });

  // Create payroll records for each employee
  const payrollRecords = await Promise.all(
    employees.map((employee) =>
      prisma.payroll.create({
        data: {
          employeeId: employee.id,
          tenantId: tenant.id,
          payPeriod,
          amount: employee.salary || 0,
          status: 'PENDING',
        },
      })
    )
  );

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'GENERATE_PAYROLL',
      entity: 'Payroll',
      metadata: { payPeriod, employeeCount: employees.length },
    },
  });

  revalidatePath('/hr/payroll');
  return { success: true, count: payrollRecords.length };
}

export async function processPayroll(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const payrollId = formData.get('payrollId') as string;

  if (!payrollId) {
    throw new Error('Payroll ID is required');
  }

  await prisma.payroll.update({
    where: { id: payrollId },
    data: { status: 'PROCESSED' },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'PROCESS_PAYROLL',
      entity: 'Payroll',
      entityId: payrollId,
    },
  });

  revalidatePath('/hr/payroll');
}

export async function markPayrollPaid(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const payrollId = formData.get('payrollId') as string;

  if (!payrollId) {
    throw new Error('Payroll ID is required');
  }

  await prisma.payroll.update({
    where: { id: payrollId },
    data: { status: 'PAID', paymentDate: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'MARK_PAYROLL_PAID',
      entity: 'Payroll',
      entityId: payrollId,
    },
  });

  revalidatePath('/hr/payroll');
}

export async function bulkProcessPayroll(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const payPeriod = formData.get('payPeriod') as string;

  if (!payPeriod) {
    throw new Error('Pay period is required');
  }

  await prisma.payroll.updateMany({
    where: { tenantId: tenant.id, payPeriod, status: 'PENDING' },
    data: { status: 'PROCESSED' },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'BULK_PROCESS_PAYROLL',
      entity: 'Payroll',
      metadata: { payPeriod },
    },
  });

  revalidatePath('/hr/payroll');
}

export async function bulkMarkPaid(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const payPeriod = formData.get('payPeriod') as string;

  if (!payPeriod) {
    throw new Error('Pay period is required');
  }

  await prisma.payroll.updateMany({
    where: { tenantId: tenant.id, payPeriod, status: 'PROCESSED' },
    data: { status: 'PAID', paymentDate: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'BULK_MARK_PAID',
      entity: 'Payroll',
      metadata: { payPeriod },
    },
  });

  revalidatePath('/hr/payroll');
}

export async function getCurrentPayPeriod(): Promise<string> {
  return format(new Date(), 'MMM yyyy');
}
