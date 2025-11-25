'use server';

import { resend, EMAIL_FROM } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Send invoice via email
 */
export async function sendInvoice(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const invoiceId = formData.get('invoiceId') as string;

  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId: tenant.id,
    },
    include: {
      client: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const clientEmail = invoice.client?.email;
  const clientName = invoice.client ? `${invoice.client.firstName} ${invoice.client.lastName || ''}`.trim() : 'Valued Customer';

  if (!clientEmail) {
    throw new Error('Client email not found');
  }

  // Generate invoice HTML
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #333; margin: 0; }
        .info { margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .details { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .total { font-size: 24px; font-weight: bold; color: #6366f1; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${tenant.name}</h1>
        <p>Invoice #${invoice.invoiceNumber}</p>
      </div>
      
      <div class="info">
        <div class="info-row">
          <strong>Date:</strong>
          <span>${new Date(invoice.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <strong>Due Date:</strong>
          <span>${new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <strong>Status:</strong>
          <span style="color: ${invoice.status === 'PAID' ? '#10b981' : '#f59e0b'}">
            ${invoice.status}
          </span>
        </div>
      </div>
      
      <div class="details">
        <h3>Invoice Details</h3>
        <p><strong>Client:</strong> ${clientName}</p>
        
        <div class="total">
          Total Amount: $${invoice.totalAmount.toFixed(2)} ${invoice.currency}
        </div>
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>${tenant.name} • Powered by Nexus SaaS</p>
      </div>
    </body>
    </html>
  `;

  // Send email
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: clientEmail,
      subject: `Invoice #${invoice.invoiceNumber} from ${tenant.name}`,
      html: invoiceHtml,
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'INVOICE_SENT',
        entity: 'Invoice',
        entityId: invoiceId,
        metadata: { to: clientEmail, invoiceNumber: invoice.invoiceNumber },
      },
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send invoice email');
  }
}

/**
 * Send invoice reminder
 */
export async function sendInvoiceReminder(formData: FormData) {
  const { tenant } = await requireTenantMembership();

  const invoiceId = formData.get('invoiceId') as string;

  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      tenantId: tenant.id,
      status: 'PENDING',
    },
    include: {
      client: true,
    },
  });

  if (!invoice || !invoice.client?.email) {
    throw new Error('Invoice not found or client email missing');
  }

  const clientName = `${invoice.client.firstName} ${invoice.client.lastName || ''}`.trim();

  const daysOverdue = Math.floor(
    (Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const reminderHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f59e0b;">Payment Reminder</h2>
      <p>Dear ${clientName},</p>
      <p>This is a friendly reminder that invoice <strong>#${invoice.invoiceNumber}</strong> 
      for <strong>$${invoice.totalAmount.toFixed(2)}</strong> is ${daysOverdue > 0 ? `${daysOverdue} days overdue` : 'due soon'}.</p>
      
      <p><strong>Original Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      
      <p>Please process the payment at your earliest convenience.</p>
      
      <p>Best regards,<br>${tenant.name}</p>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: invoice.client.email,
      subject: `Payment Reminder: Invoice #${invoice.invoiceNumber}`,
      html: reminderHtml,
    });

    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'INVOICE_REMINDER_SENT',
        entity: 'Invoice',
        entityId: invoiceId,
        metadata: { daysOverdue },
      },
    });
  } catch (error) {
    console.error('Reminder email failed:', error);
    throw new Error('Failed to send reminder');
  }
}
