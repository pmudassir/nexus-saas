'use server';

import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Generate PDF for an invoice (placeholder - requires jsPDF or similar)
 * In production, use a proper PDF library like jsPDF, PDFKit, or Puppeteer
 */
export async function generateInvoicePDF(invoiceId: string): Promise<Buffer> {
  const { tenant } = await requireTenantMembership();

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId: tenant.id,
    },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Placeholder: In production, use jsPDF or similar library
  // For now, return a simple text representation
  const pdfContent = `
    ========================================
    INVOICE #${invoice.invoiceNumber}
    ========================================
    
    From: ${tenant.name}
    To: ${invoice.client?.firstName} ${invoice.client?.lastName || ''}
    Email: ${invoice.client?.email || 'N/A'}
    
    Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
    Status: ${invoice.status}
    
    ----------------------------------------
    ITEMS:
    ----------------------------------------
    ${invoice.items?.map((item) => `
    ${item.description || 'Item'}: ${item.quantity} x $${item.unitPrice} = $${item.total}
    `).join('\n') || 'No items'}
    
    ----------------------------------------
    TOTAL: $${invoice.totalAmount} ${invoice.currency}
    ========================================
    
    Thank you for your business!
  `;

  return Buffer.from(pdfContent, 'utf-8');
}

/**
 * Download invoice as PDF
 */
export async function downloadInvoicePDF(invoiceId: string): Promise<{
  buffer: Buffer;
  filename: string;
}> {
  const buffer = await generateInvoicePDF(invoiceId);

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { invoiceNumber: true },
  });

  return {
    buffer,
    filename: `invoice-${invoice?.invoiceNumber || invoiceId}.txt`, // Change to .pdf when using real PDF library
  };
}
