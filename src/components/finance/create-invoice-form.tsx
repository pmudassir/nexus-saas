"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createInvoice } from "@/actions/invoices";

interface Client {
  id: string;
  firstName: string;
  lastName: string | null;
  company: string | null;
}

export function CreateInvoiceForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!clientId) {
      setError("Please select a client");
      return;
    }
    if (!dueDate) {
      setError("Please select a due date");
      return;
    }
    if (items.some(i => !i.description || i.quantity < 1)) {
      setError("Please fill in all item details properly");
      return;
    }

    startTransition(async () => {
       try {
         await createInvoice({
           clientId,
           dueDate,
           items
         });
         // The server action handles db creation. 
         // We redirect client side to ensure navigation state is correct.
         router.push("/finance");
         router.refresh();
       } catch (error) {
         console.error(error);
         setError(error instanceof Error ? error.message : "Failed to create invoice");
       }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/finance">
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

      <div className="rounded-md border border-border bg-card p-6 space-y-6">
        {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                {error}
            </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <select 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a client...</option>
              {clients.map(client => (
                  <option key={client.id} value={client.id}>
                      {client.company || `${client.firstName} ${client.lastName || ''}`}
                  </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, index) => (
                    <tr key={index}>
                    <td className="p-2">
                        <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full bg-transparent outline-none px-2 py-1"
                        />
                    </td>
                    <td className="p-2">
                        <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent outline-none px-2 py-1"
                        />
                    </td>
                    <td className="p-2">
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none px-2 py-1"
                        />
                    </td>
                    <td className="p-4 text-right font-medium">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                        <button 
                            onClick={() => removeItem(index)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </td>
                    </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50">
                  <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total Amount:</td>
                      <td className="px-4 py-3 text-right font-bold text-lg">
                          ${calculateTotal().toFixed(2)}
                      </td>
                      <td></td>
                  </tr>
              </tfoot>
            </table>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Line Item
          </Button>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Link href="/finance">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
                <>Saving...</>
            ) : (
                <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Invoice
                </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
