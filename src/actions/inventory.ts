'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

// Supplier Management
export async function createSupplier(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  
  await prisma.supplier.create({
    data: {
      name: formData.get('name') as string,
      contactName: formData.get('contactName') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      tenantId: tenant.id,
    },
  });

  revalidatePath('/inventory/suppliers');
}

// Purchase Orders
export async function createPurchaseOrder(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const orderNumber = `PO-${Date.now()}`;
  
  await prisma.purchaseOrder.create({
    data: {
      orderNumber,
      supplierId: formData.get('supplierId') as string,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      tenantId: tenant.id,
    },
  });

  revalidatePath('/inventory/purchase-orders');
}

// Stock Movement
export async function recordStockMovement(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const productId = formData.get('productId') as string;
  const type = formData.get('type') as string;
  const quantity = parseInt(formData.get('quantity') as string);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const beforeStock = product.stock;
  const afterStock = type === 'IN' ? beforeStock + quantity : beforeStock - quantity;

  await prisma.$transaction([
    prisma.stockMovement.create({
      data: {
        productId,
        type,
        quantity,
        beforeStock,
        afterStock,
        reason: formData.get('reason') as string || null,
        tenantId: tenant.id,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: afterStock },
    }),
  ]);

  revalidatePath('/inventory');
}
