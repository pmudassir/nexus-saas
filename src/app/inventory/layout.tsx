import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function InventoryLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("inventory");
  return <>{children}</>;
}
