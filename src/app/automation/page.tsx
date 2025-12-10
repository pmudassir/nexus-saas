import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Zap, Play, Pause, Trash2, MoreHorizontal } from "lucide-react";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { prisma } from "@/lib/prisma";
import {
  createAutomation,
  toggleAutomation,
  deleteAutomation,
} from "@/actions/automation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TRIGGER_OPTIONS = [
  {
    id: "new-lead",
    label: "New Lead Notification",
    trigger: "New Contact Created",
    action: "Send Email Notification",
  },
  {
    id: "invoice-overdue",
    label: "Invoice Overdue Alert",
    trigger: "Invoice Due Date Passed",
    action: "Send Reminder Email",
  },
  {
    id: "task-completed",
    label: "Task Completion Alert",
    trigger: "Task Marked Complete",
    action: "Notify Project Owner",
  },
  {
    id: "low-stock",
    label: "Low Stock Alert",
    trigger: "Product Stock Low",
    action: "Create Purchase Order Alert",
  },
  {
    id: "leave-approved",
    label: "Leave Approval Notice",
    trigger: "Leave Request Approved",
    action: "Notify HR and Employee",
  },
];

export default async function AutomationPage() {
  const { tenant } = await requireTenantMembership();

  const automations = await prisma.automation.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: automations.length,
    active: automations.filter((a) => a.isActive).length,
    paused: automations.filter((a) => !a.isActive).length,
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Zap className="w-8 h-8" />
              Automations
            </h1>
            <p className="text-muted-foreground mt-1">
              Streamline your workflows with automated actions.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Create Automation</DialogTitle>
              </DialogHeader>
              <form action={createAutomation} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    name="name"
                    placeholder="e.g. New Lead Alert"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger & Action *</label>
                  <select
                    name="triggerType"
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a trigger</option>
                    {TRIGGER_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  <strong>How it works:</strong> When the trigger condition is
                  met, the action will be automatically executed.
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Create Automation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-emerald-500" />
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.active}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4 text-amber-500" />
              <div className="text-sm text-muted-foreground">Paused</div>
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {stats.paused}
            </div>
          </Card>
        </div>

        {/* Automations List */}
        {automations.length > 0 ? (
          <div className="grid gap-4">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className="flex items-center justify-between p-4 rounded-md border border-border bg-white hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      auto.isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{auto.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      If <span className="text-primary">{auto.trigger}</span>{" "}
                      then <span className="text-primary">{auto.action}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      auto.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {auto.isActive ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      <Pause className="h-3 w-3" />
                    )}
                    {auto.isActive ? "ACTIVE" : "PAUSED"}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <form action={toggleAutomation}>
                        <input type="hidden" name="id" value={auto.id} />
                        <DropdownMenuItem asChild>
                          <button type="submit" className="w-full text-left">
                            {auto.isActive ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </button>
                        </DropdownMenuItem>
                      </form>
                      <form action={deleteAutomation}>
                        <input type="hidden" name="id" value={auto.id} />
                        <DropdownMenuItem asChild>
                          <button
                            type="submit"
                            className="w-full text-left text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </DropdownMenuItem>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Automations</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automation to streamline your workflows.
            </p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
