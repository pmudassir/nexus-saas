'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Create expense with receipt
 */
export async function createExpense(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;
  const currency = (formData.get('currency') as string) || 'USD';
  const receiptUrl = formData.get('receiptUrl') as string | null;
  const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
  const userId = (session.user as { id: string }).id;

  await prisma.expense.create({
    data: {
      description,
      amount,
      category,
      currency,
      receiptUrl,
      date,
      tenantId: tenant.id,
      userId,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'EXPENSE_CREATED',
      entity: 'Expense',
      entityId: description,
      metadata: { amount, category, currency },
    },
  });

  revalidatePath('/finance/expenses');
}

/**
 * Approve expense
 */
export async function approveExpense(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const expenseId = formData.get('expenseId') as string;
  const userId = (session.user as { id: string }).id;

  await prisma.expense.update({
    where: { id: expenseId },
    data: {
      approvalStatus: 'APPROVED',
      approvedBy: userId,
      approvedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'EXPENSE_APPROVED',
      entity: 'Expense',
      entityId: expenseId,
      metadata: { approvedBy: userId },
    },
  });

  revalidatePath('/finance/expenses');
}

/**
 * Reject expense
 */
export async function rejectExpense(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const expenseId = formData.get('expenseId') as string;
  const reason = formData.get('reason') as string;
  const userId = (session.user as { id: string }).id;

  await prisma.expense.update({
    where: { id: expenseId },
    data: {
      approvalStatus: 'REJECTED',
      approvedBy: userId,
      approvedAt: new Date(),
      rejectionReason: reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'EXPENSE_REJECTED',
      entity: 'Expense',
      entityId: expenseId,
      metadata: { rejectedBy: userId, reason },
    },
  });

  revalidatePath('/finance/expenses');
}


