
import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function InventoryDashboard() {
  const { tenant } = await requireTenantMembership();

  const [products, suppliers, lowStock, pendingPOs] = await Promise.all([
    prisma.product.count({ where: { tenantId: tenant.id } }),
    prisma.supplier.count({ where: { tenantId: tenant.id } }),
    prisma.product.count({ where: { tenantId: tenant.id, stock: { lt: 10 } } }),
    prisma.purchaseOrder.count({ where: { tenantId: tenant.id, status: 'PENDING' } }),
  ]);

  const stats = [
    { name: 'Total Products', value: products, icon: 'inventory_2', color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { name: 'Active Suppliers', value: suppliers, icon: 'local_shipping', color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { name: 'Low Stock Items', value: lowStock, icon: 'trending_down', color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { name: 'Pending POs', value: pendingPOs, icon: 'receipt_long', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  ];

  const modules = [
    { name: 'Products', href: '/inventory/products', description: 'Manage product catalog & stock', icon: 'inventory_2' },
    { name: 'Suppliers', href: '/inventory/suppliers', description: 'Supplier database & contacts', icon: 'local_shipping' },
    { name: 'Purchase Orders', href: '/inventory/purchase-orders', description: 'Create and track orders', icon: 'receipt_long' },
    { name: 'Stock Movements', href: '/inventory/stock-movements', description: 'View transaction history', icon: 'swap_vert' },
  ];

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Inventory
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Complete stock control and supply chain management.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                        <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                    <span className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                        <span className="material-symbols-outlined text-xs mr-1">north_east</span> View
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Modules</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <Link key={module.name} href={module.href} className="group">
                  <div className="h-full bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-[#24272d] border border-slate-100 dark:border-slate-700 hover:border-[#e9590c]/30 rounded-xl p-6 transition-all hover:shadow-md flex flex-col items-center text-center cursor-pointer">
                    <div className="h-14 w-14 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-[#e9590c] mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#e9590c] transition-colors">{module.name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{module.description}</p>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
