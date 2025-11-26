import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { FileText, Download, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: { page?: string; action?: string };
}) {
  const { tenant } = await requireTenantMembership();

  const page = parseInt(searchParams.page || '1');
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId: tenant.id,
    ...(searchParams.action && { action: searchParams.action }),
  };

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip,
    }),
    prisma.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Get unique actions for filter
  const uniqueActions = await prisma.auditLog.findMany({
    where: { tenantId: tenant.id },
    select: { action: true },
    distinct: ['action'],
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Audit Logs
            </h1>
            <p className="text-muted-foreground mt-2">
              Track all activities and changes within your workspace for security
              and compliance.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-border text-foreground hover:bg-muted text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-md border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              name="action"
              defaultValue={searchParams.action || ''}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) {
                  url.searchParams.set('action', e.target.value);
                } else {
                  url.searchParams.delete('action');
                }
                window.location.href = url.toString();
              }}
              className="rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="" className="bg-white text-foreground">
                All Actions
              </option>
              {uniqueActions.map((item) => (
                <option
                  key={item.action}
                  value={item.action}
                  className="bg-white text-foreground"
                >
                  {item.action}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-md border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Entity</th>
                  <th className="px-6 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-foreground">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div>
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      <div className="text-muted-foreground/70">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {log.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{log.entity}</div>
                      {log.entityId && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {log.entityId.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {log.ip || '—'}
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <div className="text-sm">No audit logs found</div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Activity will appear here as actions are performed
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-muted border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {totalCount} total logs
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`?page=${page - 1}${searchParams.action ? `&action=${searchParams.action}` : ''}`}
                    className="px-3 py-1.5 rounded-md bg-white border border-border hover:bg-muted text-foreground text-sm transition-colors shadow-sm"
                  >
                    Previous
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`?page=${page + 1}${searchParams.action ? `&action=${searchParams.action}` : ''}`}
                    className="px-3 py-1.5 rounded-md bg-white border border-border hover:bg-muted text-foreground text-sm transition-colors shadow-sm"
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
