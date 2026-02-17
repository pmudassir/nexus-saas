import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function AutomationLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("automation");
  return <>{children}</>;
}
