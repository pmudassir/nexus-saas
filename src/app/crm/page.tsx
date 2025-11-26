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
    (c) => mapStatus(c.status) === "active"
  ).length;
  const leads = contacts.filter((c) => mapStatus(c.status) === "lead").length;

  return (
    <Shell>
      <div className="flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              CRM
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your contacts and customer relationships with precision.
            </p>
          </div>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
            asChild
          >
            <a href="#quick-add-contact">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </a>
          </Button>
        </div>

        {/* Quick Add Contact */}
        <div
          id="quick-add-contact"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Quick Add Contact
          </h2>
          <form
            className="grid gap-4 md:grid-cols-[1.5fr,1.5fr,1.5fr,1.5fr,auto] items-end"
            action={upsertContact}
          >
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                required
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Company
                </label>
                <input
                  name="company"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              className="mt-1 bg-slate-900 text-white hover:bg-slate-800"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Contacts</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {totalContacts}
                </h3>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Clients</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">New Leads</p>
                <h3 className="text-2xl font-bold text-slate-900">{leads}</h3>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Contact Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-slate-900">
            All Contacts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <SpotlightCard
                key={contact.id}
                className="p-5 group border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={undefined}
                      alt={`${contact.firstName} ${contact.lastName ?? ""}`}
                      fallback={getInitials(
                        contact.firstName,
                        contact.lastName
                      )}
                      size="lg"
                      className="ring-2 ring-slate-100 bg-slate-100 text-slate-600"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight mb-0.5 text-slate-900">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-slate-500">
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
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-slate-200 text-slate-700"
                      >
                        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-100 focus:text-slate-900">
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <Building2 className="h-4 w-4" />
                  <span>{contact.company}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2 mb-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group/link"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate group-hover/link:underline">
                      {contact.email}
                    </span>
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group/link"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="group-hover/link:underline">
                      {contact.phone}
                    </span>
                  </a>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Last update:{" "}
                    {formatDistanceToNow(contact.updatedAt, {
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
