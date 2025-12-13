import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Plus,
  Users,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Building2,
  Search,
  Filter
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
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  className="pl-9 pr-4 py-2.5 rounded-full bg-white border border-transparent shadow-soft text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
                />
             </div>
             <Dialog>
               <DialogTrigger asChild>
                  <Button className="rounded-full bg-black text-white px-6 h-11 shadow-lg hover:bg-gray-800 transition-all font-medium">
                    <Plus className="h-4 w-4 mr-2" /> Add Contact
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
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
                      <Button type="submit" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8">
                        <UserPlus className="h-4 w-4 mr-2" /> Save Contact
                      </Button>
                    </div>
                  </form>
               </DialogContent>
             </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                <h3 className="text-3xl font-bold font-display text-foreground mt-1">
                  {totalContacts}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <h3 className="text-3xl font-bold font-display text-foreground mt-1">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <h3 className="text-3xl font-bold font-display text-foreground mt-1">{leads}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100 min-h-[500px]">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display">All Contacts</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-gray-50 px-4 py-2 rounded-full">
                 <Filter className="h-4 w-4" /> Filter
              </button>
           </div>
           
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="group relative bg-white border border-gray-100 hover:border-orange-200 hover:shadow-soft-lg p-5 rounded-3xl transition-all duration-300"
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
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-4 bg-gray-50 w-fit px-3 py-1.5 rounded-full">
                  <Building2 className="h-3 w-3" />
                  <span>{contact.company || "No Company"}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2.5 mb-4">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 text-sm text-foreground hover:text-orange-600 transition-colors group/link p-2 rounded-xl hover:bg-orange-50"
                  >
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover/link:bg-orange-200 group-hover/link:text-orange-700 transition-colors">
                        <Mail className="h-3 w-3 shrink-0" />
                    </div>
                    <span className="truncate font-medium">
                      {contact.email}
                    </span>
                  </a>
                  {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2.5 text-sm text-foreground hover:text-orange-600 transition-colors group/link p-2 rounded-xl hover:bg-orange-50"
                      >
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover/link:bg-orange-200 group-hover/link:text-orange-700 transition-colors">
                            <Phone className="h-3 w-3 shrink-0" />
                        </div>
                        <span className="font-medium">
                          {contact.phone}
                        </span>
                      </a>
                  )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-black hover:bg-gray-800 text-white shadow-md">View Profile</Button> 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
