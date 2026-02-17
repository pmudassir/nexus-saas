import { auth } from "@/auth";
import { redirect } from "next/navigation";

type SessionUserWithAdmin = {
  id?: string;
  isSuperAdmin?: boolean;
};

export async function requireSuperAdmin() {
  const session = await auth();
  const user = session?.user as SessionUserWithAdmin | undefined;

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  if (!user.isSuperAdmin) {
    throw new Error("Unauthorized - Super admin only");
  }

  return user;
}

export async function requireSuperAdminPageAccess() {
  const session = await auth();
  const user = session?.user as SessionUserWithAdmin | undefined;

  if (!user?.id || !user.isSuperAdmin) {
    redirect("/");
  }

  return user;
}
