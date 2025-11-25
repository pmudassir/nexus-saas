'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import fs from 'fs/promises';
import path from 'path';

export async function createSitePage(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const title = String(formData.get('title') ?? '').trim();
  let pathValue = String(formData.get('path') ?? '').trim();

  if (!title) {
    throw new Error('Page title is required');
  }

  // Default path if not provided
  if (!pathValue) {
    pathValue = '/' + title.toLowerCase().replace(/\s+/g, '-');
  }

  // Ensure path starts with /
  if (!pathValue.startsWith('/')) {
    pathValue = '/' + pathValue;
  }

  await prisma.sitePage.create({
    data: {
      tenantId: tenant.id,
      title,
      path: pathValue,
      isHome: pathValue === '/',
    },
  });

  revalidatePath('/builder');
}

export async function addSiteBlock(formData: FormData) {
  const pageId = formData.get('pageId') as string;
  const type = formData.get('type') as string;

  if (!pageId || !type) {
    throw new Error('Missing required fields');
  }

  // Count existing blocks to set order
  const count = await prisma.siteBlock.count({
    where: { pageId },
  });

  // Default data based on block type
  const defaultData: Record<string, unknown> = {
    HERO: {
      heading: 'Hero Heading',
      subheading: 'This is a subheading for your hero section',
      ctaLabel: 'Get Started',
    },
    TEXT: {
      heading: 'Section Heading',
      body: 'Add your content here. Click to edit.',
    },
    FEATURES: {
      heading: 'Features',
      features: [
        { title: 'Feature 1', description: 'Description' },
        { title: 'Feature 2', description: 'Description' },
        { title: 'Feature 3', description: 'Description' },
      ],
    },
    GALLERY: {
      heading: 'Gallery',
      items: [],
    },
    CONTACT: {
      heading: 'Contact Us',
      email: 'hello@example.com',
      phone: '(555) 123-4567',
    },
  };

  await prisma.siteBlock.create({
    data: {
      pageId,
      type: type as 'HERO' | 'TEXT' | 'FEATURES' | 'GALLERY' | 'CONTACT',
      order: count,
      data: defaultData[type] || {},
    },
  });

  revalidatePath('/builder');
}

export async function updateBlockData(formData: FormData) {
  const blockId = formData.get('blockId') as string;
  const dataJson = formData.get('data') as string;

  if (!blockId || !dataJson) {
    throw new Error('Missing required fields');
  }

  const data = JSON.parse(dataJson);

  await prisma.siteBlock.update({
    where: { id: blockId },
    data: { data },
  });

  revalidatePath('/builder');
}

export async function deleteBlock(formData: FormData) {
  const blockId = formData.get('blockId') as string;

  if (!blockId) {
    throw new Error('Missing block ID');
  }

  await prisma.siteBlock.delete({
    where: { id: blockId },
  });

  revalidatePath('/builder');
}

export async function duplicateBlock(formData: FormData) {
  const blockId = formData.get('blockId') as string;

  if (!blockId) {
    throw new Error('Missing block ID');
  }

  const original = await prisma.siteBlock.findUnique({
    where: { id: blockId },
  });

  if (!original) {
    throw new Error('Block not found');
  }

  const count = await prisma.siteBlock.count({
    where: { pageId: original.pageId },
  });

  await prisma.siteBlock.create({
    data: {
      pageId: original.pageId,
      type: original.type,
      order: count,
      data: original.data as never, // Type cast for Prisma JSON field
    },
  });

  revalidatePath('/builder');
}

export async function updateBlockOrder(formData: FormData) {
  const pageId = formData.get('pageId') as string;
  const blockIdsJson = formData.get('blockIds') as string;

  if (!pageId || !blockIdsJson) {
    throw new Error('Missing required fields');
  }

  const blockIds = JSON.parse(blockIdsJson) as string[];

  // Update order for each block
  await Promise.all(
    blockIds.map((id, index) =>
      prisma.siteBlock.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );

  revalidatePath('/builder');
}

/**
 * Apply a template to create pages and blocks for a tenant
 */
export async function applyTemplate(formData: FormData) {
  const templateKey = formData.get('templateKey') as string;

  if (!templateKey) {
    throw new Error('Template key is required');
  }

  const { tenant } = await requireTenantMembership();

  // Load template from file
  const templatePath = path.join(process.cwd(), 'templates', `${templateKey}.json`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = JSON.parse(templateContent);

  // Create pages and blocks from template
  for (const pageData of template.pages) {
    const page = await prisma.sitePage.create({
      data: {
        tenantId: tenant.id,
        title: pageData.title,
        path: pageData.path,
        isHome: pageData.isHome,
      },
    });

    // Create blocks for the page
    for (const blockData of pageData.blocks) {
      await prisma.siteBlock.create({
        data: {
          pageId: page.id,
          type: blockData.type,
          order: blockData.order,
          data: blockData.data,
        },
      });
    }
  }

  revalidatePath('/builder');
  revalidatePath('/builder/templates');
  redirect('/builder');
}
