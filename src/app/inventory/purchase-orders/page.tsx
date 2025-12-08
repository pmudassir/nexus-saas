import { Shell } from "@/components/layout/Shell";
import { FileText } from "lucide-react";

export default function PurchaseOrdersPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Purchase Orders
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Create, track, and manage purchase orders for your inventory. This module is under active development.
        </p>
      </div>
    </Shell>
  );
}
