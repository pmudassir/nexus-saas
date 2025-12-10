import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { format } from "date-fns";

export default async function StockMovementsPage() {
  const { tenant } = await requireTenantMembership();

  const movements = await prisma.stockMovement.findMany({
    where: { tenantId: tenant.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const stats = {
    total: movements.length,
    in: movements.filter((m) => m.type === "IN").length,
    out: movements.filter((m) => m.type === "OUT").length,
    totalIn: movements
      .filter((m) => m.type === "IN")
      .reduce((sum, m) => sum + m.quantity, 0),
    totalOut: movements
      .filter((m) => m.type === "OUT")
      .reduce((sum, m) => sum + m.quantity, 0),
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ArrowUpDown className="w-8 h-8" />
            Stock Movements
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all inventory changes and stock adjustments.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Movements</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <div className="text-sm text-muted-foreground">Stock In</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              +{stats.totalIn}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.in} transactions
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Stock Out</div>
            </div>
            <div className="text-2xl font-bold text-red-600">
              -{stats.totalOut}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.out} transactions
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Net Change</div>
            <div
              className={`text-2xl font-bold ${stats.totalIn - stats.totalOut >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {stats.totalIn - stats.totalOut >= 0 ? "+" : ""}
              {stats.totalIn - stats.totalOut}
            </div>
          </Card>
        </div>

        {/* Movements Table */}
        {movements.length > 0 ? (
          <div className="rounded-md border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Before → After</th>
                  <th className="px-6 py-3 text-left">Reason</th>
                  <th className="px-6 py-3 text-left">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(movement.createdAt, "MMM d, yyyy h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {movement.product.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {movement.product.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          movement.type === "IN"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {movement.type === "IN" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span
                        className={
                          movement.type === "IN"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      >
                        {movement.type === "IN" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="text-muted-foreground">
                        {movement.beforeStock}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold">{movement.afterStock}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {movement.reason || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {movement.reference && (
                        <span className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
                          {movement.reference}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stock Movements</h3>
            <p className="text-muted-foreground mb-4">
              Stock movements will appear here when you adjust product stock or
              receive purchase orders.
            </p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
