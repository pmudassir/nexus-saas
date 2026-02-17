"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTenant } from "@/actions/tenants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TenantCreationFormProps {
  plans: { id: string; name: string; priceMonthly: number }[];
}

export function TenantCreationForm({ plans }: TenantCreationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    // We can't use action={createTenant} directly if we want client-side loading state
    // So we wrap it or use useTransition, but wrapping is simpler here for clear separate state
    const formData = new FormData(event.currentTarget);
    
    try {
      await createTenant(formData);
      toast.success("Tenant created successfully");
      (event.target as HTMLFormElement).reset();
      router.refresh(); // Refresh server data
      router.replace("/admin"); // Ensure we're on the right page/fresh state
    } catch (error) {
      console.error(error);
      toast.error("Failed to create tenant");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
      <h2 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" /> Create Tenant
      </h2>
      <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Company Name
          </label>
          <input
            name="name"
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            placeholder="Acme Corp"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Slug
          </label>
          <input
            name="slug"
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            placeholder="acme"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Plan
          </label>
          <select
            name="planId"
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            defaultValue={plans[0]?.id ?? ""}
            disabled={isLoading}
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.priceMonthly / 100}/mo)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Admin Email
          </label>
          <input
            name="adminEmail"
            type="email"
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            placeholder="admin@acme.com"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Admin Name
          </label>
          <input
            name="adminName"
            type="text"
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Admin Password
          </label>
          <input
            name="adminPassword"
            type="password"
            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-black text-white hover:bg-gray-800 h-11 px-8 shadow-lg font-medium transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Create Tenant
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
