import type { ReactNode } from "react";
import { requireFeatureAccess } from "@/lib/tenant-auth";

export default async function TasksLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireFeatureAccess("projects");
  return <>{children}</>;
}
