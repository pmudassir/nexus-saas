import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function BuilderLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("website_builder");
  return <>{children}</>;
}
