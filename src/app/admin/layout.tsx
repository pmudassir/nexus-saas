import type { ReactNode } from 'react';
import { requireSuperAdminPageAccess } from '@/lib/admin-auth';
import { AdminShell } from '@/components/layout/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSuperAdminPageAccess();

  return <AdminShell>{children}</AdminShell>;
}
