import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Search,
  Package,
  Truck,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import {
  createPurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "@/actions/purchase-orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default async function PurchaseOrdersPage() {
  const { tenant } = await requireTenantMembership();

  const [purchaseOrders, suppliers] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where: { tenantId: tenant.id },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.supplier.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter((po) => po.status === "PENDING").length,
    received: purchaseOrders.filter((po) => po.status === "RECEIVED").length,
    cancelled: purchaseOrders.filter((po) => po.status === "CANCELLED").length,
    totalValue: purchaseOrders
      .filter((po) => po.status !== "CANCELLED")
      .reduce((sum, po) => sum + po.totalAmount, 0),
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Purchase Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and track orders from your suppliers.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Purchase Order
                </DialogTitle>
              </DialogHeader>
              <form action={createPurchaseOrder} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier *</label>
                  <select
                    name="supplierId"
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Date</label>
                  <Input name="expectedDate" type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Order notes..."
                  />
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 You can add items to this order after creation.
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="submit">Create Order</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <div className="text-sm text-muted-foreground">Received</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.received}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-md border border-border w-full md:w-96">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Purchase Orders Table */}
        {purchaseOrders.length > 0 ? (
          <div className="rounded-md border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Order #</th>
                  <th className="px-6 py-3 text-left">Supplier</th>
                  <th className="px-6 py-3 text-left">Order Date</th>
                  <th className="px-6 py-3 text-left">Expected</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {purchaseOrders.map((po) => (
                  <tr
                    key={po.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium font-mono">
                      {po.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        {po.supplier.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(po.orderDate, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      {po.expectedDate ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(po.expectedDate, "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        {po.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${po.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          po.status === "RECEIVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : po.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {po.status === "PENDING" && (
                          <>
                            <form action={receivePurchaseOrder}>
                              <input type="hidden" name="poId" value={po.id} />
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Receive
                              </Button>
                            </form>
                            <form action={cancelPurchaseOrder}>
                              <input type="hidden" name="poId" value={po.id} />
                              <Button type="submit" size="sm" variant="outline">
                                Cancel
                              </Button>
                            </form>
                          </>
                        )}
                        {po.status === "RECEIVED" && (
                          <span className="text-xs text-muted-foreground">
                            {po.receivedDate &&
                              format(po.receivedDate, "MMM d")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Purchase Orders</h3>
            <p className="text-muted-foreground mb-4">
              Create your first purchase order to track incoming inventory.
            </p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
