'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createProduct(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const name = formData.get('name') as string;
  let sku = formData.get('sku') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const stock = parseInt(formData.get('stock') as string) || 0;
  const category = formData.get('category') as string;
  const supplierId = formData.get('supplierId') as string;

  if (!name) {
    throw new Error('Product name is required');
  }

  // Auto-generate SKU if not provided
  if (!sku) {
    const count = await prisma.product.count({ where: { tenantId: tenant.id } });
    sku = `SKU-${String(count + 1).padStart(5, '0')}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      price,
      stock,
      category: category || null,
      supplierId: supplierId || null,
      status: stock > 10 ? 'IN_STOCK' : stock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
      tenantId: tenant.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'CREATE',
      entity: 'Product',
      entityId: product.id,
      metadata: { name, sku },
    },
  });

  revalidatePath('/inventory/products');
  revalidatePath('/inventory');
}

export async function updateProduct(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const category = formData.get('category') as string;
  const supplierId = formData.get('supplierId') as string;

  if (!id) {
    throw new Error('Product ID is required');
  }

  const existing = await prisma.product.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!existing) {
    throw new Error('Product not found');
  }

  const newStock = isNaN(stock) ? existing.stock : stock;

  await prisma.product.update({
    where: { id },
    data: {
      name: name || existing.name,
      sku: sku || existing.sku,
      price: isNaN(price) ? existing.price : price,
      stock: newStock,
      category: category || existing.category,
      supplierId: supplierId || existing.supplierId,
      status: newStock > 10 ? 'IN_STOCK' : newStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'UPDATE',
      entity: 'Product',
      entityId: id,
    },
  });

  revalidatePath('/inventory/products');
  revalidatePath('/inventory');
}

export async function adjustStock(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const productId = formData.get('productId') as string;
  const type = formData.get('type') as 'IN' | 'OUT';
  const quantity = parseInt(formData.get('quantity') as string) || 0;
  const reason = formData.get('reason') as string;

  if (!productId || !quantity || !type) {
    throw new Error('Product, quantity, and type are required');
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId: tenant.id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const beforeStock = product.stock;
  const afterStock = type === 'IN' ? beforeStock + quantity : beforeStock - quantity;

  if (afterStock < 0) {
    throw new Error('Insufficient stock');
  }

  // Update product stock
  await prisma.product.update({
    where: { id: productId },
    data: {
      stock: afterStock,
      status: afterStock > 10 ? 'IN_STOCK' : afterStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
    },
  });

  // Create stock movement record
  await prisma.stockMovement.create({
    data: {
      productId,
      tenantId: tenant.id,
      type,
      quantity,
      reason: reason || (type === 'IN' ? 'Stock In' : 'Stock Out'),
      beforeStock,
      afterStock,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'ADJUST_STOCK',
      entity: 'Product',
      entityId: productId,
      metadata: { type, quantity, beforeStock, afterStock },
    },
  });

  revalidatePath('/inventory/products');
  revalidatePath('/inventory');
}

export async function deleteProduct(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Product ID is required');
  }

  const product = await prisma.product.findFirst({
    where: { id, tenantId: tenant.id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: (session.user as { id: string }).id,
      action: 'DELETE',
      entity: 'Product',
      entityId: id,
      metadata: { name: product.name },
    },
  });

  revalidatePath('/inventory/products');
  revalidatePath('/inventory');
}
