import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function CrmLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("crm");
  return <>{children}</>;
}
