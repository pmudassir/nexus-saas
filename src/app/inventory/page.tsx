
import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { Package, Users as SuppliersIcon, FileText, TrendingUp, ArrowUpDown, ArrowUpRight } from 'lucide-react';
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
    { name: 'Total Products', value: products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Suppliers', value: suppliers, icon: SuppliersIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Low Stock Items', value: lowStock, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Pending POs', value: pendingPOs, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const modules = [
    { name: 'Products', href: '/inventory/products', description: 'Manage product catalog & stock', icon: Package },
    { name: 'Suppliers', href: '/inventory/suppliers', description: 'Supplier database & contacts', icon: SuppliersIcon },
    { name: 'Purchase Orders', href: '/inventory/purchase-orders', description: 'Create and track orders', icon: FileText },
    { name: 'Stock Movements', href: '/inventory/stock-movements', description: 'View transaction history', icon: ArrowUpDown },
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
            <div key={stat.name} className="bg-white rounded-3xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                        <ArrowUpRight className="h-3 w-3 mr-1" /> View
                    </span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <h3 className="text-3xl font-bold font-display text-foreground mt-1">{stat.value}</h3>
                </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display">Modules</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <Link key={module.name} href={module.href} className="group">
                  <div className="h-full bg-gray-50 hover:bg-white border border-gray-100 hover:border-orange-200 rounded-3xl p-6 transition-all hover:shadow-soft flex flex-col items-center text-center cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                        <module.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-600 transition-colors">{module.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{module.description}</p>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
