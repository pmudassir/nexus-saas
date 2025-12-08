import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { prisma } from '@/lib/prisma';
import { Package, Users as SuppliersIcon, FileText, TrendingUp } from 'lucide-react';
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
    { name: 'Total Products', value: products, icon: Package, color: 'text-blue-500' },
    { name: 'Active Suppliers', value: suppliers, icon: SuppliersIcon, color: 'text-purple-500' },
    { name: 'Low Stock Items', value: lowStock, icon: TrendingUp, color: 'text-red-500' },
    { name: 'Pending POs', value: pendingPOs, icon: FileText, color: 'text-amber-500' },
  ];

  const modules = [
    { name: 'Products', href: '/inventory', description: 'Manage product catalog and stock levels', icon: Package },
    { name: 'Suppliers', href: '/inventory/suppliers', description: 'Supplier  database and contacts', icon: SuppliersIcon },
    { name: 'Purchase Orders', href: '/inventory/purchase-orders', description: 'Create and track purchase orders', icon: FileText },
  ];

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Package className="w-8 h-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete stock control with supplier management and purchase orders.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-md border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.name}</div>
                  <div className="text-3xl font-bold text-foreground mt-1">{stat.value}</div>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.name} href={module.href}>
              <div className="rounded-md border border-border bg-card p-6 hover:bg-muted transition-colors cursor-pointer shadow-sm">
                <module.icon className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{module.name}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
