import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function HrLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("hr");
  return <>{children}</>;
}
