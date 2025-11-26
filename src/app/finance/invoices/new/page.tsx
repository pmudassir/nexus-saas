import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewInvoicePage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/finance/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Invoice
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to generate a new invoice.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-border bg-white p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <select className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select a client...</option>
                <option>Acme Corp</option>
                <option>Globex Inc</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="date"
                className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Line Items</h3>
            <div className="rounded-md border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-medium">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 w-24">Qty</th>
                    <th className="px-4 py-3 w-32">Price</th>
                    <th className="px-4 py-3 w-32 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Item description"
                        className="w-full bg-transparent outline-none px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        defaultValue={1}
                        className="w-full bg-transparent outline-none px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none px-2 py-1"
                      />
                    </td>
                    <td className="p-4 text-right font-medium">$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
            >
              Add Line Item
            </Button>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Link href="/finance/invoices">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
