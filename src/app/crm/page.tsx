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
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              CRM
            </h1>
            <p className="text-muted-foreground mt-2">
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
          <h2 className="text-sm font-semibold text-foreground">
            Quick Add Contact
          </h2>
          <form
            className="grid gap-4 md:grid-cols-[1.5fr,1.5fr,1.5fr,1.5fr,auto] items-end"
            action={upsertContact}
          >
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                First Name
              </label>
              <Input
                name="firstName"
                required
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Last Name
              </label>
              <Input
                name="lastName"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
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
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Company
                </label>
                <Input
                  name="company"
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
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
              <div className="p-2 rounded-sm bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {totalContacts}
                </h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-sm bg-emerald-50 text-emerald-700">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {activeContacts}
                </h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-sm bg-blue-50 text-blue-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Leads</p>
                <h3 className="text-2xl font-bold text-foreground">{leads}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-foreground">
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
                      className="ring-1 ring-border bg-muted text-muted-foreground"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight mb-0.5 text-foreground">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
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
                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-sm text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border text-foreground"
                      >
                        <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-black/5 focus:text-foreground">
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Building2 className="h-4 w-4" />
                  <span>{contact.company}</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2 mb-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate group-hover/link:underline">
                      {contact.email}
                    </span>
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="group-hover/link:underline">
                      {contact.phone}
                    </span>
                  </a>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
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
