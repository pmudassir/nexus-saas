'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import bcrypt from 'bcryptjs';

/**
 * Invite a user to the tenant
 */
export async function inviteUser(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const email = (formData.get('email') as string).toLowerCase().trim();
  const name = (formData.get('name') as string).trim();
  const role = (formData.get('role') as 'TENANT_ADMIN' | 'TENANT_USER') || 'TENANT_USER';

  if (!email) {
    throw new Error('Email is required');
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // If user doesn't exist create a placeholder account
  // In production, this would send an invitation email instead
  if (!user) {
    const tempPassword = Math.random().toString(36).substring(7);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        role: 'MEMBER',
      },
    });

    // TODO: Send invitation email with tempPassword
    console.log(`Temporary password for ${email}: ${tempPassword}`);
  }

  // Check if already a member
  const existingMembership = await prisma.tenantUser.findUnique({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: user.id,
      },
    },
  });

  if (existingMembership) {
    throw new Error('User is already a member of this tenant');
  }

  // Add user to tenant
  await prisma.tenantUser.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role,
    },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'USER_INVITED',
      entity: 'TenantUser',
      entityId: user.id,
      metadata: { email, role },
    },
  });

  revalidatePath('/settings/team');
}

/**
 * Remove a user from the tenant
 */
export async function removeUser(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const tenantUserId = formData.get('tenantUserId') as string;

  if (!tenantUserId) {
    throw new Error('Tenant user ID is required');
  }

  // Get the tenant user
  const tenantUser = await prisma.tenantUser.findUnique({
    where: { id: tenantUserId },
    include: { user: true },
  });

  if (!tenantUser || tenantUser.tenantId !== tenant.id) {
    throw new Error('Unauthorized');
  }

  // Prevent self-removal
  const currentUserId = (session.user as { id: string }).id;
  if (tenantUser.userId === currentUserId) {
    throw new Error('Cannot remove yourself from the tenant');
  }

  // Delete the tenant user
  await prisma.tenantUser.delete({
    where: { id: tenantUserId },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'USER_REMOVED',
      entity: 'TenantUser',
      entityId: tenantUser.userId,
      metadata: { email: tenantUser.user.email },
    },
  });

  revalidatePath('/settings/team');
}
