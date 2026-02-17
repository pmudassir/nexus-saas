import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function FinanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("finance");
  return <>{children}</>;
}
