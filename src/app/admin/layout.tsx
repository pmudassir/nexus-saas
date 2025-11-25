import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type SessionUserWithFlags = {
  isSuperAdmin?: boolean;
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  const isSuperAdmin = Boolean(
    session?.user && (session.user as SessionUserWithFlags).isSuperAdmin,
  );

  if (!isSuperAdmin) {
    redirect("/");
  }

  return children;
}
