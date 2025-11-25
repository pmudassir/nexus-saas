import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  Plus,
  Users,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Building2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { upsertContact } from "@/actions/crm";
import { formatDistanceToNow } from "date-fns";

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
    (c) => mapStatus(c.status) === "active",
  ).length;
  const leads = contacts.filter((c) => mapStatus(c.status) === "lead").length;

  return (
    <Shell>
      <div className="flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              CRM
            </h1>
            <p className="text-zinc-400 mt-2">
              Manage your contacts and customer relationships with precision.
            </p>
          </div>
          <Button className="bg-white text-black hover:bg-zinc-200" asChild>
            <a href="#quick-add-contact">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </a>
          </Button>
        </div>

        {/* Quick Add Contact */}
        <div
          id="quick-add-contact"
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-3"
        >
          <h2 className="text-sm font-semibold text-white">Quick Add Contact</h2>
          <form
            className="grid gap-3 md:grid-cols-[1.5fr,1.5fr,1.5fr,1.5fr,auto] items-end"
            action={upsertContact}
          >
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                required
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Company
                </label>
                <input
                  name="company"
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <Button type="submit" size="sm" className="mt-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <SpotlightCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Contacts</p>
                <h3 className="text-2xl font-bold text-white">{totalContacts}</h3>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Active Clients</p>
                <h3 className="text-2xl font-bold text-white">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">New Leads</p>
                <h3 className="text-2xl font-bold text-white">{leads}</h3>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Contact Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-white">
            All Contacts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <SpotlightCard key={contact.id} className="p-5 group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={undefined}
                      alt={`${contact.firstName} ${contact.lastName ?? ""}`}
                      fallback={getInitials(contact.firstName, contact.lastName)}
                      size="lg"
                      className="ring-2 ring-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight mb-0.5 text-white">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {mapStatus(contact.status) === "lead"
                          ? "Lead"
                          : mapStatus(contact.status) === "inactive"
                          ? "Inactive"
                          : "Client"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={mapStatus(contact.status)} size="sm" />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border-zinc-800 text-zinc-200"
                      >
                        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-900/20">
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                  <Building2 className="h-4 w-4" />
                  <span>{contact.company}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2 mb-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group/link"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate group-hover/link:underline">
                      {contact.email}
                    </span>
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group/link"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="group-hover/link:underline">
                      {contact.phone}
                    </span>
                  </a>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-zinc-500">
                    Last update: {formatDistanceToNow(contact.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
