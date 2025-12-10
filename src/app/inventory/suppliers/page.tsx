import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Truck,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createSupplier, deactivateSupplier } from "@/actions/suppliers";
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

const PAYMENT_TERMS = ['NET15', 'NET30', 'NET60', 'NET90', 'COD', 'PREPAID'];

export default async function SuppliersPage() {
  const { tenant } = await requireTenantMembership();

  const suppliers = await prisma.supplier.findMany({
    where: { tenantId: tenant.id },
    include: {
      _count: {
        select: { products: true, purchaseOrders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: suppliers.length,
    active: suppliers.filter((s) => s.status === "ACTIVE").length,
    inactive: suppliers.filter((s) => s.status === "INACTIVE").length,
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Truck className="w-8 h-8" />
              Supplier Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your supplier database and contacts.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Add New Supplier
                </DialogTitle>
              </DialogHeader>
              <form action={createSupplier} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input name="name" placeholder="Acme Supplies" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name</label>
                    <Input name="contactName" placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Terms</label>
                    <select
                      name="paymentTerms"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select terms</option>
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="contact@supplier.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input name="phone" placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                    placeholder="123 Main St, City, State"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Create Supplier</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Suppliers</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.active}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Inactive</div>
            <div className="text-2xl font-bold text-muted-foreground">
              {stats.inactive}
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-md border border-border w-full md:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Suppliers Grid */}
        {suppliers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{supplier.name}</div>
                      {supplier.contactName && (
                        <div className="text-sm text-muted-foreground">
                          {supplier.contactName}
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Orders</DropdownMenuItem>
                      <form action={deactivateSupplier}>
                        <input type="hidden" name="id" value={supplier.id} />
                        <DropdownMenuItem asChild>
                          <button
                            type="submit"
                            className="w-full text-left text-red-600"
                          >
                            Deactivate
                          </button>
                        </DropdownMenuItem>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <a
                        href={`mailto:${supplier.email}`}
                        className="hover:text-primary"
                      >
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mt-0.5" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">
                      {supplier._count.products} products
                    </span>
                    <span className="text-muted-foreground">
                      {supplier._count.purchaseOrders} orders
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      supplier.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </div>

                {supplier.paymentTerms && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Payment: {supplier.paymentTerms}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Suppliers Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first supplier to start managing your supply chain.
            </p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
