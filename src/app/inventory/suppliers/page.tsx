import { Shell } from "@/components/layout/Shell";
import { Truck } from "lucide-react";

export default function SuppliersPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Truck className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Supplier Management
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Manage your supplier database, contracts, and contacts in one place. This module is coming soon.
        </p>
      </div>
    </Shell>
  );
}
