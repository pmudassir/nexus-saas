import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { upsertContact } from "@/actions/crm";
import Link from "next/link";


function getInitials(firstName: string, lastName?: string | null) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

function mapStatus(status: string): "active" | "lead" | "inactive" {
  const upper = status.toUpperCase();
  if (upper === "LEAD") return "lead";
  if (upper === "INACTIVE") return "inactive";
  return "active";
}

export default async function CRMPage() {
  const { tenant } = await requireTenantMembership();

  const contacts = await prisma.contact.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(
    (c) => mapStatus(c.status) === "active"
  ).length;
  const leads = contacts.filter((c) => mapStatus(c.status) === "lead").length;

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              CRM
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage your contacts and customer relationships.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/crm/leads">
               <Button variant="outline">
                 <span className="material-symbols-outlined text-lg mr-2">group</span> Leads
               </Button>
             </Link>
             <Link href="/crm/today">
               <Button variant="outline">
                 <span className="material-symbols-outlined text-lg mr-2">call</span> Follow-ups
               </Button>
             </Link>
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  className="pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e9590c]/20 w-64 text-slate-900 dark:text-slate-100"
                />
             </div>
             <Dialog>
               <DialogTrigger asChild>
                  <Button>
                    <span className="material-symbols-outlined text-lg mr-2">person_add</span> Add Contact
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-display">Add New Contact</DialogTitle>
                  </DialogHeader>
                  <form action={upsertContact} className="grid gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">First Name *</label>
                        <Input name="firstName" required placeholder="John" className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Last Name</label>
                        <Input name="lastName" placeholder="Smith" className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email *</label>
                      <Input name="email" type="email" required placeholder="john@example.com" className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Company</label>
                        <Input name="company" placeholder="Acme Inc" className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Phone</label>
                        <Input name="phone" placeholder="+1 234 567 8900" className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button type="submit">
                        <span className="material-symbols-outlined text-lg mr-2">person_add</span> Save Contact
                      </Button>
                    </div>
                  </form>
               </DialogContent>
             </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#e9590c]/10 text-[#e9590c]">
                <span className="material-symbols-outlined">contacts</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Contacts</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {totalContacts}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <span className="material-symbols-outlined">how_to_reg</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Clients</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined">person_search</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New Leads</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{leads}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px]">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">All Contacts</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
                 <span className="material-symbols-outlined text-lg">filter_list</span> Filter
              </button>
           </div>
           
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="group relative bg-white dark:bg-[#24272d] border border-slate-100 dark:border-slate-800 hover:border-[#e9590c]/30 hover:shadow-md p-5 rounded-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="h-12 w-12 ring-2 ring-gray-50"
                      src={undefined}
                      alt={`${contact.firstName} ${contact.lastName ?? ""}`}
                      fallback={getInitials(contact.firstName, contact.lastName)}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base leading-tight mb-0.5 text-foreground group-hover:text-orange-600 transition-colors">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {mapStatus(contact.status) === "lead"
                          ? "Lead"
                          : mapStatus(contact.status) === "inactive"
                          ? "Inactive"
                          : "Client"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                        mapStatus(contact.status) === 'active' ? 'bg-emerald-500' : 
                        mapStatus(contact.status) === 'lead' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-gray-100 shadow-md"
                      >
                        <DropdownMenuItem className="font-medium cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium cursor-pointer">
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium cursor-pointer">
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem className="text-red-600 font-medium cursor-pointer focus:bg-red-50 focus:text-red-600">
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">domain</span>
                  <span>{contact.company || "No Company"}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2.5 mb-4">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-[#e9590c] transition-colors group/link p-2 rounded-xl hover:bg-[#e9590c]/5"
                  >
                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover/link:bg-[#e9590c]/20 group-hover/link:text-[#e9590c] transition-colors">
                        <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <span className="truncate font-medium">
                      {contact.email}
                    </span>
                  </a>
                  {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-[#e9590c] transition-colors group/link p-2 rounded-xl hover:bg-[#e9590c]/5"
                      >
                        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover/link:bg-[#e9590c]/20 group-hover/link:text-[#e9590c] transition-colors">
                            <span className="material-symbols-outlined text-sm">call</span>
                        </div>
                        <span className="font-medium">
                          {contact.phone}
                        </span>
                      </a>
                  )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button size="sm">View Profile</Button> 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
