import { AdminSidebar } from './AdminSidebar';
import { Shell } from './Shell';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Shell sidebar={<AdminSidebar />}>
      {children}
    </Shell>
  );
}
