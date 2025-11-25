import { Shell } from "@/components/layout/Shell";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Plus,
  MoreVertical,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { formatDistanceToNow } from "date-fns";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function mapStatusForBadge(
  status: string,
): "in_stock" | "low_stock" | "out_of_stock" {
  const upper = status.toUpperCase();
  if (upper === "OUT_OF_STOCK") return "out_of_stock";
  if (upper === "LOW_STOCK") return "low_stock";
  return "in_stock";
}

export default async function InventoryPage() {
  const { tenant } = await requireTenantMembership();

  const products = await prisma.product.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: "asc" },
  });

  type Product = (typeof products)[number];

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum: number, product: Product) => sum + product.price * product.stock,
    0,
  );
  const lowStockCount = products.filter(
    (product: Product) => product.stock > 0 && product.stock <= 10,
  ).length;
  const outOfStockCount = products.filter(
    (product: Product) => product.stock <= 0,
  ).length;

  return (
    <Shell>
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 antialiased selection:bg-indigo-500/30">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora opacity-20" />
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)]" />
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Inventory Management
              </h1>
              <p className="text-slate-400 mt-1">
                Track stock levels, manage products, and handle orders.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total Products
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {totalProducts}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total Value
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(totalValue)}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Low Stock
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {lowStockCount}
                  </h3>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Out of Stock
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {outOfStockCount}
                  </h3>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, SKUs, or categories..."
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                className="bg-black/20 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 w-full md:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                className="bg-black/20 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 w-full md:w-auto"
              >
                Category
              </Button>
              <Button
                variant="outline"
                className="bg-black/20 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 w-full md:w-auto"
              >
                Status
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">SKU</th>
                    <th className="px-6 py-4 font-medium">Stock Level</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((item: Product) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-white/2 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-slate-500">
                              {formatDistanceToNow(item.updatedAt, {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {item.stock}
                          </span>
                          <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.stock > 20
                                  ? "bg-emerald-500"
                                  : item.stock > 0
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(item.stock, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={mapStatusForBadge(item.status)}
                          size="sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-white/10 text-slate-200"
                          >
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              Adjust Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-indigo-500/20 focus:text-indigo-300">
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
