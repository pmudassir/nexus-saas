import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
            <h1 className="text-4xl font-bold tracking-tight text-[#37352f]">
              CRM
            </h1>
            <p className="text-[#9B9A97] mt-2">
              Manage your contacts and customer relationships with precision.
            </p>
          </div>
          <Button
            asChild
          >
            <a href="#quick-add-contact">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </a>
          </Button>
        </div>

        {/* Quick Add Contact */}
        <Card
          id="quick-add-contact"
          className="p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-[#37352f]">
            Quick Add Contact
          </h2>
          <form
            className="grid gap-4 md:grid-cols-[1.5fr,1.5fr,1.5fr,1.5fr,auto] items-end"
            action={upsertContact}
          >
            <div>
              <label className="block text-xs font-medium text-[#9B9A97] mb-1">
                First Name
              </label>
              <Input
                name="firstName"
                required
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9B9A97] mb-1">
                Last Name
              </label>
              <Input
                name="lastName"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9B9A97] mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#9B9A97] mb-1">
                  Company
                </label>
                <Input
                  name="company"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9B9A97] mb-1">
                  Phone
                </label>
                <Input
                  name="phone"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              className="mt-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-sm bg-[rgba(235,236,252,1)] text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-[#9B9A97]">Total Contacts</p>
                <h3 className="text-2xl font-bold text-[#37352f]">
                  {totalContacts}
                </h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-sm bg-[rgba(219,237,219,1)] text-[rgb(28,56,41)]">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-[#9B9A97]">Active Clients</p>
                <h3 className="text-2xl font-bold text-[#37352f]">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-sm bg-[rgba(235,236,252,1)] text-blue-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-[#9B9A97]">New Leads</p>
                <h3 className="text-2xl font-bold text-[#37352f]">{leads}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-[#37352f]">
            All Contacts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <Card
                key={contact.id}
                className="p-5 group hover:shadow-md transition-all"
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
                      className="ring-1 ring-[#E9E9E8] bg-[#F7F7F5] text-[#5F5E5B]"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight mb-0.5 text-[#37352f]">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-[#9B9A97]">
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
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(55,53,47,0.08)] rounded-sm text-[#9B9A97] hover:text-[#37352f]">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-[#E9E9E8] text-[#37352f]"
                      >
                        <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[rgba(55,53,47,0.08)] focus:text-[#37352f]">
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#E9E9E8]" />
                        <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-[#9B9A97] mb-3">
                  <Building2 className="h-4 w-4" />
                  <span>{contact.company}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2 mb-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-[#9B9A97] hover:text-indigo-600 transition-colors group/link"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate group-hover/link:underline">
                      {contact.email}
                    </span>
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-[#9B9A97] hover:text-indigo-600 transition-colors group/link"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="group-hover/link:underline">
                      {contact.phone}
                    </span>
                  </a>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-[#E9E9E8]">
                  <p className="text-xs text-[#9B9A97]">
                    Last update:{" "}
                    {formatDistanceToNow(contact.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
