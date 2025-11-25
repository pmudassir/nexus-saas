'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Create or update a contact
 */
export async function upsertContact(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const contactId = formData.get('contactId') as string | null;
  const name = (formData.get('name') as string).trim();
  const email = (formData.get('email') as string).trim();
  const phone = (formData.get('phone') as string).trim() || null;
  const company = (formData.get('company') as string).trim() || null;
  const tags = (formData.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean);
  const notes = (formData.get('notes') as string).trim() || null;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const userId = (session.user as { id: string }).id;

  const data = {
    name,
    email,
    phone,
    company,
    tags,
    notes,
    userId,
    tenantId: tenant.id,
  };

  if (contactId) {
    // Update existing
    await prisma.contact.update({
      where: { id: contactId },
      data,
    });

    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'CONTACT_UPDATED',
        entity: 'Contact',
        entityId: contactId,
        metadata: { name, email },
      },
    });
  } else {
    // Create new
    const contact = await prisma.contact.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'CONTACT_CREATED',
        entity: 'Contact',
        entityId: contact.id,
        metadata: { name, email },
      },
    });
  }

  revalidatePath('/crm');
}

/**
 * Delete a contact
 */
export async function deleteContact(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const contactId = formData.get('contactId') as string;

  if (!contactId) {
    throw new Error('Contact ID is required');
  }

  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      tenantId: tenant.id,
    },
  });

  if (!contact) {
    throw new Error('Contact not found');
  }

  await prisma.contact.delete({
    where: { id: contactId },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'CONTACT_DELETED',
      entity: 'Contact',
      entityId: contactId,
      metadata: { name: contact.name, email: contact.email },
    },
  });

  revalidatePath('/crm');
}

/**
 * Add activity note to contact
 */
export async function addContactActivity(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const contactId = formData.get('contactId') as string;
  const activity = (formData.get('activity') as string).trim();

  if (!contactId || !activity) {
    throw new Error('Contact ID and activity are required');  }

  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      tenantId: tenant.id,
    },
  });

  if (!contact) {
    throw new Error('Contact not found');
  }

  // Add to notes with timestamp
  const timestamp = new Date().toISOString();
  const newActivity = `[${timestamp}] ${activity}`;
  const updatedNotes = contact.notes 
    ? `${contact.notes}\n${newActivity}` 
    : newActivity;

  await prisma.contact.update({
    where: { id: contactId },
    data: { notes: updatedNotes },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'CONTACT_ACTIVITY_ADDED',
      entity: 'Contact',
      entityId: contactId,
      metadata: { activity },
    },
  });

  revalidatePath('/crm');
  revalidatePath(`/crm/${contactId}`);
}
