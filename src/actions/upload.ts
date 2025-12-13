'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { sanitizeFilename } from '@/lib/sanitize';
import { prisma } from '@/lib/prisma';

interface FileMetadata {
  filename?: string;
  url?: string;
  size?: number;
  type?: string;
}

/**
 * Upload a file to the public directory
 * In production, this would use S3/Cloudflare R2
 */
export async function uploadFile(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only images are allowed.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate safe filename
  const timestamp = Date.now();
  const originalName = file.name.split('.')[0];
  const extension = file.name.split('.').pop();
  const safeFilename = sanitizeFilename(`${originalName}-${timestamp}.${extension}`);

  // Create tenant directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', tenant.slug);
  await mkdir(uploadDir, { recursive: true });

  // Save file
  const filepath = join(uploadDir, safeFilename);
  await writeFile(filepath, buffer);

  // Return public URL
  const publicUrl = `/uploads/${tenant.slug}/${safeFilename}`;

  // Log the upload
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: 'FILE_UPLOADED',
      entity: 'Asset',
      metadata: {
        filename: safeFilename,
        size: file.size,
        type: file.type,
        url: publicUrl,
      },
    },
  });

  return { url: publicUrl, filename: safeFilename };
}

/**
 * Get list of uploaded files for tenant
 */
export async function getUploadedFiles() {
  const { tenant } = await requireTenantMembership();

  const logs = await prisma.auditLog.findMany({
    where: {
      tenantId: tenant.id,
      action: 'FILE_UPLOADED',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  });

  return logs.map((log) => {
    const metadata = log.metadata as FileMetadata | null;
    return {
      id: log.id,
      filename: metadata?.filename || 'unknown',
      url: metadata?.url || '',
      size: metadata?.size || 0,
      type: metadata?.type || 'image/*',
      uploadedAt: log.createdAt,
    };
  });
}
