'use server';

import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function getWorkspaceStats() {
  const { tenant } = await requireTenantMembership();

  const [
    membershipsCount,
    employeesCount,
    openLeadsCount,
    wonLeadsCount,
    contactsCount,
    pipelineValue,
    recentActivity,
  ] = await Promise.all([
    prisma.tenantUser.count({ where: { tenantId: tenant.id } }),
    prisma.employee.count({ where: { tenantId: tenant.id, status: 'ACTIVE' } }),
    prisma.lead.count({
      where: { tenantId: tenant.id, stage: { notIn: ['WON', 'LOST'] } },
    }),
    prisma.lead.count({ where: { tenantId: tenant.id, stage: 'WON' } }),
    prisma.contact.count({ where: { tenantId: tenant.id } }),
    prisma.lead.aggregate({
      where: { tenantId: tenant.id, stage: { notIn: ['WON', 'LOST'] } },
      _sum: { value: true },
    }),
    prisma.auditLog.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    tenantName: tenant.name,
    membershipsCount,
    employeesCount,
    openLeadsCount,
    wonLeadsCount,
    contactsCount,
    pipelineValue: pipelineValue._sum.value || 0,
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      entityId: a.entityId,
      metadata: a.metadata,
      createdAt: a.createdAt,
      userName: a.user?.name || a.user?.email || 'System',
    })),
  };
}
