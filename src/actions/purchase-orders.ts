'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createPurchaseOrder(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const supplierId = formData.get('supplierId') as string;
  const expectedDate = formData.get('expectedDate') as string;
  const notes = formData.get('notes') as string;
  const itemsJson = formData.get('items') as string;

  if (!supplierId) {
    throw new Error('Supplier is required');
  }

  // Generate order number
  const count = await prisma.purchaseOrder.count({ where: { tenantId: tenant.id } });
  const orderNumber = `PO-${String(count + 1).padStart(5, '0')}`;

  // Parse items if provided
  let items: { productId: string; quantity: number; unitPrice: number }[] = [];
  let totalAmount = 0;
  
  if (itemsJson) {
    items = JSON.parse(itemsJson);
    totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  const po = await prisma.purchaseOrder.create({
    data: {
      orderNumber,
      supplierId,
      tenantId: tenant.id,
      expectedDate: expectedDate ? new Date(expectedDate) : null,
      notes: notes || null,
      totalAmount,
      status: 'PENDING',
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'CREATE',
      entity: 'PurchaseOrder',
      entityId: po.id,
      metadata: { orderNumber, supplierId },
    },
  });

  revalidatePath('/inventory/purchase-orders');
  revalidatePath('/inventory');
}

export async function receivePurchaseOrder(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const poId = formData.get('poId') as string;

  if (!poId) {
    throw new Error('Purchase order ID is required');
  }

  const po = await prisma.purchaseOrder.findFirst({
    where: { id: poId, tenantId: tenant.id },
    include: { items: true },
  });

  if (!po) {
    throw new Error('Purchase order not found');
  }

  // Update PO status
  await prisma.purchaseOrder.update({
    where: { id: poId },
    data: { status: 'RECEIVED', receivedDate: new Date() },
  });

  // Update product stock levels
  for (const item of po.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (product) {
      const newStock = product.stock + item.quantity;
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: newStock,
          status: newStock > 10 ? 'IN_STOCK' : newStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
        },
      });

      // Log stock movement
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          tenantId: tenant.id,
          type: 'IN',
          quantity: item.quantity,
          reason: 'Purchase Order Received',
          reference: po.orderNumber,
          beforeStock: product.stock,
          afterStock: newStock,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'RECEIVE',
      entity: 'PurchaseOrder',
      entityId: poId,
      metadata: { orderNumber: po.orderNumber },
    },
  });

  revalidatePath('/inventory/purchase-orders');
  revalidatePath('/inventory');
}

export async function cancelPurchaseOrder(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const poId = formData.get('poId') as string;

  if (!poId) {
    throw new Error('Purchase order ID is required');
  }

  const po = await prisma.purchaseOrder.findFirst({
    where: { id: poId, tenantId: tenant.id },
  });

  if (!po) {
    throw new Error('Purchase order not found');
  }

  await prisma.purchaseOrder.update({
    where: { id: poId },
    data: { status: 'CANCELLED' },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'CANCEL',
      entity: 'PurchaseOrder',
      entityId: poId,
      metadata: { orderNumber: po.orderNumber },
    },
  });

  revalidatePath('/inventory/purchase-orders');
  revalidatePath('/inventory');
}
