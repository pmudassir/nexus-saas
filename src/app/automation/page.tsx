
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
              Automations
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Streamline your workflows with automated actions.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-black text-white px-6 h-11 shadow-lg hover:bg-gray-800 transition-all font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-display">Create Automation</DialogTitle>
              </DialogHeader>
              <form action={createAutomation} className="space-y-4 mt-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Automation Name *</label>
                   <Input name="name" placeholder="e.g. New Lead Alert" required className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Trigger & Action *</label>
                   <select name="triggerType" required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                     <option value="">Select a trigger</option>
                     {TRIGGER_OPTIONS.map((opt) => (
                       <option key={opt.id} value={opt.id}>{opt.label}</option>
                     ))}
                   </select>
                </div>
                <div className="text-sm font-medium text-muted-foreground p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                  When the trigger condition is met, the action will be automatically executed.
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8">Create Automation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
           <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group">
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Total Automations</p>
                 <h3 className="text-3xl font-bold font-display text-foreground mt-1">{stats.total}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                 <Zap className="h-6 w-6" />
              </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group">
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Active</p>
                 <h3 className="text-3xl font-bold font-display text-foreground mt-1">{stats.active}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Play className="h-6 w-6" />
              </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center justify-between group">
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Paused</p>
                 <h3 className="text-3xl font-bold font-display text-foreground mt-1">{stats.paused}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                 <Pause className="h-6 w-6" />
              </div>
           </div>
        </div>

        {/* Automations List */}
        <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100 min-h-[500px]">
          <h2 className="text-xl font-bold font-display mb-8">All Automations</h2>
          {automations.length > 0 ? (
            <div className="grid gap-4">
              {automations.map((auto) => (
                <div key={auto.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl border border-gray-100 bg-white hover:bg-gray-50/50 hover:border-orange-200 hover:shadow-soft transition-all group">
                   <div className="flex items-center gap-5">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
                          auto.isActive ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400"
                      }`}>
                         <Zap className="h-7 w-7" />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-foreground mb-1">{auto.name}</h3>
                         <p className="text-sm text-muted-foreground font-medium">
                           If <span className="text-orange-600 font-bold">{auto.trigger}</span> then <span className="text-orange-600 font-bold">{auto.action}</span>
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 mt-4 md:mt-0 pl-16 md:pl-0">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          auto.isActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                         {auto.isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                         {auto.isActive ? "Active" : "Paused"}
                      </span>
                      
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                               <MoreHorizontal className="h-4 w-4" />
                            </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                           <form action={toggleAutomation}>
                              <input type="hidden" name="id" value={auto.id} />
                              <DropdownMenuItem asChild>
                                <button type="submit" className="w-full text-left font-medium cursor-pointer">
                                   {auto.isActive ? (
                                     <>
                                       <Pause className="h-4 w-4 mr-2" /> Pause
                                     </>
                                   ) : (
                                     <>
                                       <Play className="h-4 w-4 mr-2" /> Activate
                                     </>
                                   )}
                                </button>
                              </DropdownMenuItem>
                           </form>
                           <form action={deleteAutomation}>
                              <input type="hidden" name="id" value={auto.id} />
                              <DropdownMenuItem asChild>
                                <button type="submit" className="w-full text-left text-red-600 font-medium cursor-pointer focus:text-red-600 focus:bg-red-50">
                                   <Trash2 className="h-4 w-4 mr-2" /> Delete
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
             <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <Zap className="h-10 w-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold font-display text-foreground">No Automations Yet</h3>
               <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
                 Create your first automation to save time and streamline your workflow.
               </p>
               <Dialog>
                   <DialogTrigger asChild>
                     <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 px-8 py-6 text-md font-bold">
                       <Plus className="h-5 w-5 mr-2" /> New Automation
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[450px] rounded-3xl p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-display">Create Automation</DialogTitle>
                      </DialogHeader>
                      <form action={createAutomation} className="space-y-4 mt-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Automation Name *</label>
                           <Input name="name" placeholder="e.g. New Lead Alert" required className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Trigger & Action *</label>
                           <select name="triggerType" required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                             <option value="">Select a trigger</option>
                             {TRIGGER_OPTIONS.map((opt) => (
                               <option key={opt.id} value={opt.id}>{opt.label}</option>
                             ))}
                           </select>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button type="submit" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8">Create Automation</Button>
                        </div>
                      </form>
                   </DialogContent>
               </Dialog>
             </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
