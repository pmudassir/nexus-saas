import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/crm/ContactCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Plus, Users, UserCheck, UserPlus } from "lucide-react";

const contacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john@techcorp.com",
    company: "Tech Corp",
    phone: "+1 234 567 8900",
    status: "active" as const,
    role: "CEO",
    lastContact: "2 days ago",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@designstudio.com",
    company: "Design Studio",
    phone: "+1 234 567 8901",
    status: "active" as const,
    role: "Creative Director",
    lastContact: "1 week ago",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@marketinginc.com",
    company: "Marketing Inc",
    phone: "+1 234 567 8902",
    status: "lead" as const,
    role: "Marketing Manager",
    lastContact: "3 days ago",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@salesco.com",
    company: "Sales Co",
    phone: "+1 234 567 8903",
    status: "active" as const,
    role: "VP Sales",
    lastContact: "5 days ago",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@startup.io",
    company: "Startup Inc",
    phone: "+1 234 567 8904",
    status: "lead" as const,
    role: "Founder",
    lastContact: "1 day ago",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa@consulting.com",
    company: "Consulting Group",
    phone: "+1 234 567 8905",
    status: "inactive" as const,
    role: "Senior Consultant",
    lastContact: "2 months ago",
  },
];

export default function CRMPage() {
  const activeContacts = contacts.filter((c) => c.status === "active").length;
  const leads = contacts.filter((c) => c.status === "lead").length;
  const inactiveContacts = contacts.filter(
    (c) => c.status === "inactive"
  ).length;

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
            <p className="text-muted-foreground">
              Manage your contacts and customer relationships.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Contacts"
            value={contacts.length}
            description="All contacts in your CRM"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Clients"
            value={activeContacts}
            description="Currently active customers"
            icon={<UserCheck className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="New Leads"
            value={leads}
            description="Potential customers"
            icon={<UserPlus className="h-5 w-5" />}
            trend={{ value: 25, isPositive: true }}
          />
        </div>

        {/* Contact Cards Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Contacts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} {...contact} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
