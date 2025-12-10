import { Shell } from "@/components/layout/Shell";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getCurrentUser } from "@/actions/settings";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Shell>
      <SettingsClient user={user} />
    </Shell>
  );
}
