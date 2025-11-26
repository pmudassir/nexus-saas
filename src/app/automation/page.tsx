import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Play, Pause, MoreHorizontal } from "lucide-react";
import { requireTenantMembership } from "@/lib/tenant-auth";

const automations = [
  {
    id: "AUTO-001",
    name: "New Lead Notification",
    trigger: "New Contact Created",
    action: "Send Email to Sales",
    status: "ACTIVE",
  },
  {
    id: "AUTO-002",
    name: "Invoice Overdue Alert",
    trigger: "Invoice Due Date Passed",
    action: "Send Reminder Email",
    status: "ACTIVE",
  },
  {
    id: "AUTO-003",
    name: "Welcome Email Sequence",
    trigger: "New User Signup",
    action: "Send Welcome Email",
    status: "PAUSED",
  },
];

export default async function AutomationPage() {
  await requireTenantMembership();
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
            <p className="text-muted-foreground">
              Streamline your workflows with automated actions.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
        </div>

        <div className="grid gap-4">
          {automations.map((auto) => (
            <div
              key={auto.id}
              className="flex items-center justify-between p-4 rounded-md border border-border bg-white hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    auto.status === "ACTIVE"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{auto.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    If <span className="text-primary">{auto.trigger}</span> then{" "}
                    <span className="text-primary">{auto.action}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    auto.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}
                >
                  {auto.status === "ACTIVE" ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                  {auto.status}
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
