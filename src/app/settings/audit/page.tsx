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
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Audit Logs
            </h1>
            <p className="text-slate-400 mt-2">
              Track all activities and changes within your workspace for security
              and compliance.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
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
              className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value="" className="bg-slate-900">
                All Actions
              </option>
              {uniqueActions.map((item) => (
                <option
                  key={item.action}
                  value={item.action}
                  className="bg-slate-900"
                >
                  {item.action}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Entity</th>
                  <th className="px-6 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20 text-slate-100">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      <div className="text-slate-500">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {log.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {log.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{log.entity}</div>
                      {log.entityId && (
                        <div className="text-xs text-slate-500 font-mono">
                          {log.entityId.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {log.ip || '—'}
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <div className="text-sm">No audit logs found</div>
                      <div className="text-xs text-slate-500 mt-1">
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
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Page {page} of {totalPages} · {totalCount} total logs
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`?page=${page - 1}${searchParams.action ? `&action=${searchParams.action}` : ''}`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    Previous
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`?page=${page + 1}${searchParams.action ? `&action=${searchParams.action}` : ''}`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
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
