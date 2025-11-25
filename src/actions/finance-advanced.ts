'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { SUPPORTED_CURRENCIES, getCurrencySymbol, formatCurrency } from '@/lib/currency';

export { SUPPORTED_CURRENCIES, getCurrencySymbol, formatCurrency };

/**
 * Create recurring invoice
 */
export async function createRecurringInvoice(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const clientId = formData.get('clientId') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const currency = (formData.get('currency') as string) || 'USD';
  const interval = formData.get('interval') as string;
  const startDate = new Date(formData.get('startDate') as string);

  // Calculate next invoice date based on interval
  const nextDate = new Date(startDate);
  if (interval === 'MONTHLY') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else if (interval === 'QUARTERLY') {
    nextDate.setMonth(nextDate.getMonth() + 3);
  } else if (interval === 'YEARLY') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  const invoiceNumber = `INV-${Date.now()}`;

  await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId,
      totalAmount,
      currency,
      dueDate: startDate,
      isRecurring: true,
      recurringInterval: interval,
      nextInvoiceDate: nextDate,
      tenantId: tenant.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'RECURRING_INVOICE_CREATED',
      entity: 'Invoice',
      entityId: invoiceNumber,
      metadata: { interval, startDate: startDate.toISOString() },
    },
  });

  revalidatePath('/finance/invoices');
}

/**
 * Generate next recurring invoice (to be called by cron job)
 */
export async function generateRecurringInvoices() {
  const now = new Date();

  // Find all recurring invoices due for generation
  const dueInvoices = await prisma.invoice.findMany({
    where: {
      isRecurring: true,
      nextInvoiceDate: {
        lte: now,
      },
    },
    include: {
      client: true,
      items: true,
    },
  });

  for (const invoice of dueInvoices) {
    // Create new invoice
    const newInvoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        clientId: invoice.clientId,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        dueDate: invoice.nextInvoiceDate!,
        tenantId: invoice.tenantId,
        items: {
          create: invoice.items.map((item) => ({
            description: item.description,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
    });

    // Update next invoice date
    const nextDate = new Date(invoice.nextInvoiceDate!);
    if (invoice.recurringInterval === 'MONTHLY') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (invoice.recurringInterval === 'QUARTERLY') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else if (invoice.recurringInterval === 'YEARLY') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        nextInvoiceDate: nextDate,
        lastGeneratedAt: now,
      },
    });
  }

  return dueInvoices.length;
}
