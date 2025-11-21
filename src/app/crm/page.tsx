import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, MoreHorizontal } from "lucide-react";

const contacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    company: "Tech Corp",
    phone: "+1 234 567 8900",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Design Studio",
    phone: "+1 234 567 8901",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    company: "Marketing Inc",
    phone: "+1 234 567 8902",
    status: "LEAD",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    company: "Sales Co",
    phone: "+1 234 567 8903",
    status: "ACTIVE",
  },
];

export default function CRMPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Contacts
            </h3>
            <div className="text-3xl font-bold">{contacts.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active Clients
            </h3>
            <div className="text-3xl font-bold">
              {contacts.filter((c) => c.status === "ACTIVE").length}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Leads
            </h3>
            <div className="text-3xl font-bold">
              {contacts.filter((c) => c.status === "LEAD").length}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{contact.company}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-muted-foreground">
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
