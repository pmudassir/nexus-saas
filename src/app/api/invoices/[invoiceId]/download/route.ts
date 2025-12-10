import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId },
    include: {
      client: true,
      items: true,
      tenant: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // Generate simple text-based invoice (can be upgraded to proper PDF later)
  const invoiceContent = `
================================================================
                        I N V O I C E
================================================================

Invoice Number: ${invoice.invoiceNumber}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

----------------------------------------------------------------
FROM:
${invoice.tenant.name}
----------------------------------------------------------------

TO:
${invoice.client?.firstName || ''} ${invoice.client?.lastName || ''}
${invoice.client?.email || ''}
${invoice.client?.phone || ''}
----------------------------------------------------------------

ITEMS:
----------------------------------------------------------------
${
  invoice.items && invoice.items.length > 0
    ? invoice.items
        .map(
          (item) =>
            `${item.description?.padEnd(30) || 'Item'.padEnd(30)} ${String(item.quantity).padStart(5)} x $${Number(item.unitPrice).toFixed(2).padStart(10)} = $${Number(item.total).toFixed(2).padStart(12)}`
        )
        .join('\n')
    : 'No items'
}

----------------------------------------------------------------
                                       SUBTOTAL: $${Number(invoice.totalAmount).toFixed(2).padStart(12)}
                                          TOTAL: $${Number(invoice.totalAmount).toFixed(2).padStart(12)} ${invoice.currency}
----------------------------------------------------------------

Status: ${invoice.status}

================================================================
Thank you for your business!
================================================================
`;

  return new NextResponse(invoiceContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.txt"`,
    },
  });
}
