'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Update SEO metadata for a page
 */
export async function updatePageSEO(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const pageId = formData.get('pageId') as string;
  const metaTitle = (formData.get('metaTitle') as string) || null;
  const metaDescription = (formData.get('metaDescription') as string) || null;
  const metaKeywords = (formData.get('metaKeywords') as string) || null;
  const ogImage = (formData.get('ogImage') as string) || null;

  if (!pageId) {
    throw new Error('Page ID is required');
  }

  // Verify page belongs to tenant
  const page = await prisma.sitePage.findFirst({
    where: {
      id: pageId,
      tenantId: tenant.id,
    },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  await prisma.sitePage.update({
    where: { id: pageId },
    data: {
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    },
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'PAGE_SEO_UPDATED',
      entity: 'SitePage',
      entityId: pageId,
      metadata: { metaTitle, metaDescription },
    },
  });

  revalidatePath('/builder');
  revalidatePath(`/builder/seo/${pageId}`);
}

/**
 * Generate XML sitemap for tenant
 */
export async function generateSitemap() {
  const { tenant } = await requireTenantMembership();

  const pages = await prisma.sitePage.findMany({
    where: { tenantId: tenant.id },
    select: {
      path: true,
      updatedAt: true,
    },
  });

  const domain = tenant.customDomain || `${tenant.slug}.yoursaas.com`;
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://${domain}${page.path}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
}
