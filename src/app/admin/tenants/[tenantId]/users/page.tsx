import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireSuperAdminPageAccess } from "@/lib/admin-auth";

interface TenantUsersPageProps {
  params: Promise<{
    tenantId: string;
  }>;
}

export default async function TenantUsersPage({ params }: TenantUsersPageProps) {
  const { tenantId } = await params;
  await requireSuperAdminPageAccess();

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      memberships: {
        include: {
          user: true,
          customRole: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/admin">
           <Button variant="ghost" size="icon" className="rounded-full shadow-soft hover:shadow-lg bg-white h-10 w-10 text-muted-foreground hover:text-foreground hover:scale-105 transition-all">
              <ArrowLeft className="h-5 w-5" />
           </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-3">
             <Users className="h-8 w-8 text-orange-500" />
             {tenant.name} Users
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
             Manage user access for this tenant. ({tenant.memberships.length} members)
          </p>
        </div>
      </div>

       <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display">
              All Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <tr>
                   <th className="px-6 py-3">Name</th>
                   <th className="px-6 py-3">Email</th>
                   <th className="px-6 py-3">Role</th>
                   <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-foreground">
                {tenant.memberships.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50/80 transition-colors">
                     <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs uppercase border border-orange-200">
                           {(membership.user.name?.[0] || membership.user.email[0]).toUpperCase()}
                        </div>
                        {membership.user.name || "—"}
                     </td>
                     <td className="px-6 py-4 text-muted-foreground">{membership.user.email}</td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${
                            membership.role === 'TENANT_ADMIN' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                           {membership.role === "CUSTOM" && membership.customRole 
                              ? membership.customRole.name 
                              : membership.role.replace("TENANT_", "")}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-muted-foreground text-xs">
                        {new Date(membership.createdAt).toLocaleDateString()}
                     </td>
                  </tr>
                ))}
                {tenant.memberships.length === 0 && (
                   <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                         No users found.
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
}
