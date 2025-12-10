'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createSupplier(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const name = formData.get('name') as string;
  const contactName = formData.get('contactName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const paymentTerms = formData.get('paymentTerms') as string;
  const notes = formData.get('notes') as string;

  if (!name) {
    throw new Error('Supplier name is required');
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      contactName: contactName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      paymentTerms: paymentTerms || null,
      notes: notes || null,
      tenantId: tenant.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'CREATE',
      entity: 'Supplier',
      entityId: supplier.id,
      metadata: { name },
    },
  });

  revalidatePath('/inventory/suppliers');
  revalidatePath('/inventory');
}

export async function updateSupplier(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const contactName = formData.get('contactName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const paymentTerms = formData.get('paymentTerms') as string;
  const notes = formData.get('notes') as string;
  const status = formData.get('status') as string;

  if (!id) {
    throw new Error('Supplier ID is required');
  }

  const existing = await prisma.supplier.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!existing) {
    throw new Error('Supplier not found');
  }

  await prisma.supplier.update({
    where: { id },
    data: {
      name: name || existing.name,
      contactName: contactName || existing.contactName,
      email: email || existing.email,
      phone: phone || existing.phone,
      address: address || existing.address,
      paymentTerms: paymentTerms || existing.paymentTerms,
      notes: notes || existing.notes,
      status: status || existing.status,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'UPDATE',
      entity: 'Supplier',
      entityId: id,
    },
  });

  revalidatePath('/inventory/suppliers');
  revalidatePath('/inventory');
}

export async function deactivateSupplier(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Supplier ID is required');
  }

  await prisma.supplier.update({
    where: { id },
    data: { status: 'INACTIVE' },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'DEACTIVATE',
      entity: 'Supplier',
      entityId: id,
    },
  });

  revalidatePath('/inventory/suppliers');
  revalidatePath('/inventory');
}
