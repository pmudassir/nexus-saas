'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

export async function createWidget(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  
  await prisma.dashboardWidget.create({
    data: {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      dataSource: formData.get('dataSource') as string,
      metric: formData.get('metric') as string || null,
      chartType: formData.get('chartType') as string || null,
      size: formData.get('size') as string || 'MEDIUM',
      tenantId: tenant.id,
    },
  });

  revalidatePath('/analytics');
}

export async function deleteWidget(formData: FormData) {
  const widgetId = formData.get('widgetId') as string;
  
  await prisma.dashboardWidget.delete({
    where: { id: widgetId },
  });

  revalidatePath('/analytics');
}

export const WIDGET_TYPES = ['METRIC', 'CHART', 'TABLE', 'LIST'] as const;
export const CHART_TYPES = ['LINE', 'BAR', 'PIE', 'DOUGHNUT'] as const;
export const DATA_SOURCES = ['Revenue', 'Expenses', 'Invoices', 'Leads', 'Employees', 'Products'] as const;
