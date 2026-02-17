import type { ReactNode } from "react";
import { requireAnyTenantPermission } from "@/lib/tenant-auth";
import { PERMISSION_KEYS } from "@/lib/permission-keys";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAnyTenantPermission([
    PERMISSION_KEYS.SETTINGS_USERS_MANAGE,
    PERMISSION_KEYS.SETTINGS_TENANT_READ,
    PERMISSION_KEYS.SETTINGS_TENANT_UPDATE,
  ]);

  return <>{children}</>;
}
