'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Create or update a contact
 */
export async function upsertContact(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const contactId = formData.get('contactId') as string | null;
  
  // Try to get first/last name directly (from structured form)
  const firstNameRaw = formData.get('firstName');
  const lastNameRaw = formData.get('lastName');
  
  // Or fallback to 'name' (from simple form)
  const nameRaw = formData.get('name');
  
  const emailRaw = formData.get('email');
  const phoneRaw = formData.get('phone');
  const companyRaw = formData.get('company');
  const tagsRaw = formData.get('tags');
  const notesRaw = formData.get('notes');

  let firstName = typeof firstNameRaw === 'string' ? firstNameRaw.trim() : '';
  let lastName = typeof lastNameRaw === 'string' ? lastNameRaw.trim() : '';
  let name = typeof nameRaw === 'string' ? nameRaw.trim() : '';

  // If we have first/last name, construct full name
  if (firstName) {
    name = firstName + (lastName ? ` ${lastName}` : '');
  } 
  // If we only have full name, try to split it to populate first/last if they are empty
  else if (name && !firstName) {
    const nameParts = name.split(' ');
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ') || '';
  }

  const email = typeof emailRaw === 'string' ? emailRaw.trim() : '';
  const phone = typeof phoneRaw === 'string' ? phoneRaw.trim() : null;
  const company = typeof companyRaw === 'string' ? companyRaw.trim() : null;
  const tags = typeof tagsRaw === 'string' 
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) 
    : [];
  const notes = typeof notesRaw === 'string' ? notesRaw.trim() : null;

  if (!name || !email) {
     // If this is a server action called from a form without client-side validation,
     // we should handle this more gracefully, but throwing error is standard pattern for now.
    throw new Error('Name and email are required');
  }

  const data = {
    firstName,
    lastName: lastName || null,
    name,  // Store full name for convenience
    email,
    phone,
    company,
    tags,
    notes,
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

  const fullName = contact.name || `${contact.firstName} ${contact.lastName || ''}`.trim();

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'CONTACT_DELETED',
      entity: 'Contact',
      entityId: contactId,
      metadata: { name: fullName, email: contact.email },
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
  const activityRaw = formData.get('activity');
  const activity = typeof activityRaw === 'string' ? activityRaw.trim() : '';

  if (!contactId || !activity) {
    throw new Error('Contact ID and activity are required');
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
