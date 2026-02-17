'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantPermission } from '@/lib/tenant-auth';
import { resend, EMAIL_FROM } from '@/lib/email';
import bcrypt from 'bcryptjs';
import { PERMISSION_KEYS } from '@/lib/permission-keys';

/**
 * Invite a user to the tenant
 */
export async function inviteUser(formData: FormData) {
  const { tenant } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);

  const email = (formData.get('email') as string).toLowerCase().trim();
  const name = (formData.get('name') as string)?.trim() || '';
  const password = (formData.get('password') as string)?.trim() || '';
  const roleRaw = (formData.get('role') as string) || 'TENANT_USER';

  // Parse role — could be "TENANT_ADMIN", "TENANT_USER", or "CUSTOM:roleId"
  let role: 'TENANT_ADMIN' | 'TENANT_USER' | 'CUSTOM' = 'TENANT_USER';
  let customRoleId: string | null = null;

  if (roleRaw === 'TENANT_ADMIN') {
    role = 'TENANT_ADMIN';
  } else if (roleRaw.startsWith('CUSTOM:')) {
    role = 'CUSTOM';
    customRoleId = roleRaw.replace('CUSTOM:', '');

    const customRole = await prisma.customRole.findFirst({
      where: {
        id: customRoleId,
        tenantId: tenant.id,
      },
      select: { id: true },
    });

    if (!customRole) {
      throw new Error('Invalid custom role for this tenant');
    }
  }

  if (!email) {
    throw new Error('Email is required');
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // If user doesn't exist create an account
  if (!user) {
    const userPassword = password || Math.random().toString(36).substring(7);
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        role: 'MEMBER',
      },
    });

    // Send invitation email
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: `Invitation to join ${tenant.name} on Nexus SaaS`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>You've been invited!</h2>
              <p>Hello ${name || 'there'},</p>
              <p>You have been invited to join the workspace <strong>${tenant.name}</strong> on Nexus SaaS.</p>
              ${!password ? `<p>Your temporary password is:</p>
              <div style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; display: inline-block;">
                ${userPassword}
              </div>
              <p>Please log in and change your password immediately.</p>` : '<p>You can log in with the password provided by your administrator.</p>'}
              <a href="${process.env.NEXTAUTH_URL}/auth/signin" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Log In to Nexus
              </a>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error('Failed to send invitation email:', error);
    }

    if (process.env.NODE_ENV === 'development' && !password) {
        console.log(`Temporary password for ${email}: ${userPassword}`);
    }
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

  // Add user to tenant with role
  await prisma.tenantUser.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role,
      customRoleId,
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
  const { tenant, session } = await requireTenantPermission(PERMISSION_KEYS.SETTINGS_USERS_MANAGE);

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
