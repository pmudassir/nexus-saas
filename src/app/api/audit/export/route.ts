import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function GET() {
  try {
    const { tenant } = await requireTenantMembership();

    const logs = await prisma.auditLog.findMany({
      where: { tenantId: tenant.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert to CSV format
    const headers = ['Timestamp', 'User', 'Email', 'Action', 'Entity Type', 'Entity ID', 'Details'];
    const csvRows = [headers.join(',')];

    for (const log of logs) {
      const row = [
        new Date(log.createdAt).toISOString(),
        log.user?.name || 'Unknown',
        log.user?.email || 'Unknown',
        log.action,
        log.entity || '',
        log.entityId || '',
        JSON.stringify(log.metadata || {}).replace(/,/g, ';'),
      ];
      csvRows.push(row.map(cell => `"${cell}"`).join(','));
    }

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json({ error: 'Failed to export audit logs' }, { status: 500 });
  }
}
