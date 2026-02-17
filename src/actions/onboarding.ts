'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { initializeTenantFeatures } from '@/lib/features';

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as { id: string; email?: string };
  const companyName = (formData.get('companyName') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (!companyName || !slug) {
    throw new Error('Company name and slug are required');
  }

  // Check slug uniqueness
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    throw new Error('This workspace URL is already taken. Please choose a different one.');
  }

  // Get the default/free plan (first plan by price)
  const defaultPlan = await prisma.plan.findFirst({
    orderBy: { priceMonthly: 'asc' },
  });

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: companyName,
      slug,
      status: 'ACTIVE',
    },
  });

  // Create subscription if a plan exists
  if (defaultPlan) {
    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: defaultPlan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Add current user as TENANT_ADMIN
  await prisma.tenantUser.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role: 'TENANT_ADMIN',
    },
  });

  // Initialize default features
  await initializeTenantFeatures(tenant.id);

  // Process invited team members
  const inviteEmails: string[] = [];
  const inviteRoles: string[] = [];
  for (let i = 0; i < 5; i++) {
    const email = (formData.get(`inviteEmail${i}`) as string)?.trim();
    const role = (formData.get(`inviteRole${i}`) as string) || 'TENANT_USER';
    if (email) {
      inviteEmails.push(email);
      inviteRoles.push(role);
    }
  }

  // Create user records for invited members and add to tenant
  for (let i = 0; i < inviteEmails.length; i++) {
    const email = inviteEmails[i];
    const role = inviteRoles[i] as 'TENANT_ADMIN' | 'TENANT_USER';

    // Find or create user
    let invitedUser = await prisma.user.findUnique({ where: { email } });
    if (!invitedUser) {
      invitedUser = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
        },
      });
    }

    // Add to tenant (skip if already a member)
    await prisma.tenantUser.upsert({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: invitedUser.id,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        userId: invitedUser.id,
        role,
      },
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      action: 'TENANT_ONBOARDED',
      entity: 'Tenant',
      entityId: tenant.id,
      metadata: {
        companyName,
        slug,
        invitedMembers: inviteEmails.length,
      },
    },
  });

  revalidatePath('/');
  redirect('/');
}
