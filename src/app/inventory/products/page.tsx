import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createProduct, adjustStock, deleteProduct } from "@/actions/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Office Supplies',
  'Food & Beverage',
  'Clothing',
  'Raw Materials',
  'Packaging',
  'Other',
];

export default async function ProductsPage() {
  const { tenant } = await requireTenantMembership();

  const [products, suppliers] = await Promise.all([
    prisma.product.findMany({
      where: { tenantId: tenant.id },
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.supplier.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === "IN_STOCK").length,
    lowStock: products.filter((p) => p.status === "LOW_STOCK").length,
    outOfStock: products.filter((p) => p.status === "OUT_OF_STOCK").length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8" />
              Product Catalog
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory and stock levels.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              <form action={createProduct} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name *</label>
                    <Input name="name" placeholder="Widget Pro" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU</label>
                    <Input name="sku" placeholder="WDG-001" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price *</label>
                    <Input name="price" type="number" step="0.01" placeholder="99.99" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Stock</label>
                    <Input name="stock" type="number" placeholder="100" defaultValue="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      name="category"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier</label>
                    <select
                      name="supplierId"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Create Product</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <div className="text-sm text-muted-foreground">In Stock</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{stats.inStock}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="text-sm text-muted-foreground">Low Stock</div>
            </div>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Out of Stock</div>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Inventory Value</div>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-md border border-border w-full md:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Products Table */}
        {products.length > 0 ? (
          <div className="rounded-md border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Supplier</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {product.sku || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {product.category && (
                        <span className="px-2 py-0.5 rounded bg-muted text-xs">
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "IN_STOCK"
                            ? "bg-emerald-50 text-emerald-700"
                            : product.status === "LOW_STOCK"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.supplier?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                Adjust Stock
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
                              </DialogHeader>
                              <form action={adjustStock} className="space-y-4 mt-4">
                                <input type="hidden" name="productId" value={product.id} />
                                <div className="text-sm text-muted-foreground">
                                  Current stock: <span className="font-semibold text-foreground">{product.stock}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Type *</label>
                                    <select
                                      name="type"
                                      required
                                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                                    >
                                      <option value="IN">Stock In (+)</option>
                                      <option value="OUT">Stock Out (-)</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Quantity *</label>
                                    <Input name="quantity" type="number" min="1" required placeholder="10" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Reason</label>
                                  <Input name="reason" placeholder="Reason for adjustment" />
                                </div>
                                <div className="flex justify-end">
                                  <Button type="submit">Adjust Stock</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <DropdownMenuItem asChild>
                              <button type="submit" className="w-full text-left text-red-600">
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </form>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first product to start managing your inventory.
            </p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
