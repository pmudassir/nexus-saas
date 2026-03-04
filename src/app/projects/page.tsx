
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  MoreHorizontal,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createProject, deleteProject } from "@/actions/projects";
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
import Link from "next/link";

export default async function ProjectsListPage() {
  const { tenant } = await requireTenantMembership();

  const projects = await prisma.project.findMany({
    where: { tenantId: tenant.id },
    include: {
      owner: true,
      _count: {
        select: { tasks: true },
      },
      tasks: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  };

  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-4xl font-display font-bold text-foreground">Projects</h1>
             <p className="text-muted-foreground mt-2 font-medium">Manage and track your ongoing projects.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e9590c]/20 w-64 text-slate-900 dark:text-slate-100"
                />
             </div>
             <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <span className="material-symbols-outlined text-lg mr-2">add</span> New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-display">Create New Project</DialogTitle>
                  </DialogHeader>
                  <form action={createProject} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Project Name *</label>
                      <Input
                        name="name"
                        placeholder="e.g. Website Redesign"
                        required
                        className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm resize-none focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Project description..."
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="submit">Create Project</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects</p>
                 <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500">
                 <span className="material-symbols-outlined">work</span>
              </div>
           </div>
           
           <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active</p>
                 <p className="text-2xl font-black text-[#e9590c] mt-1">{stats.active}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#e9590c]/10 text-[#e9590c]">
                 <span className="material-symbols-outlined">folder_open</span>
              </div>
           </div>

           <div className="bg-white dark:bg-[#24272d] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                 <p className="text-2xl font-black text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                 <span className="material-symbols-outlined">check_circle</span>
              </div>
           </div>
        </div>

        {/* Projects List */}
        <div className="bg-white dark:bg-[#24272d] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px]">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">All Projects</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
                 <span className="material-symbols-outlined text-lg">filter_list</span> Filter
              </button>
           </div>
           
           {projects.length > 0 ? (
             <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   <div className="col-span-12 md:col-span-5">Project Name</div>
                   <div className="col-span-6 md:col-span-3 hidden md:block">Owner</div>
                   <div className="col-span-6 md:col-span-2 hidden md:block">Tasks</div>
                   <div className="col-span-6 md:col-span-2 hidden md:block text-right">Status</div>
                </div>

                <div className="space-y-3">
                  {projects.map((project) => {
                     const completedTasks = project.tasks.filter(t => t.status === "DONE").length;
                     const totalTasks = project._count.tasks;
                     const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                     return (
                       <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-5 bg-white dark:bg-[#24272d] hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-xl transition-all items-center group">
                          <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                             <div className="h-10 w-10 rounded-xl bg-[#e9590c]/10 flex items-center justify-center text-[#e9590c] font-bold">
                                {project.name[0]}
                             </div>
                             <div>
                                <Link href={`/projects/${project.id}`} className="font-bold text-base text-foreground hover:text-orange-600 transition-colors block">
                                   {project.name}
                                </Link>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.description || "No description"}</p>
                             </div>
                          </div>
                          
                          <div className="col-span-6 md:col-span-3 hidden md:flex items-center gap-3">
                             <Avatar 
                               className="h-8 w-8 ring-2 ring-white"
                               fallback={project.owner?.name?.[0] || "?"}
                               size="sm"
                             />
                             <span className="text-sm font-medium text-foreground">{project.owner?.name}</span>
                          </div>

                          <div className="col-span-6 md:col-span-2 hidden md:flex flex-col justify-center gap-1.5 pr-8">
                             <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                <span>Progress</span>
                                <span>{progress}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-[#e9590c] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                             </div>
                          </div>

                          <div className="col-span-6 md:col-span-2 hidden md:flex items-center justify-end gap-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                project.status === "ACTIVE" 
                                  ? "bg-emerald-50 text-emerald-600" 
                                  : project.status === "COMPLETED" 
                                    ? "bg-blue-50 text-blue-600" 
                                    : "bg-gray-100 text-gray-500"
                              }`}>
                                {project.status}
                              </span>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/projects/${project.id}`} className="font-medium cursor-pointer">View Details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/projects/${project.id}/edit`} className="font-medium cursor-pointer">Edit Project</Link>
                                  </DropdownMenuItem>
                                  <form action={deleteProject}>
                                    <input type="hidden" name="id" value={project.id} />
                                    <DropdownMenuItem asChild>
                                      <button type="submit" className="w-full text-left text-red-600 font-medium cursor-pointer focus:text-red-600 focus:bg-red-50">Delete</button>
                                    </DropdownMenuItem>
                                  </form>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                       </div>
                     );
                  })}
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                   <span className="material-symbols-outlined text-4xl text-slate-300">folder_open</span>
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">No Projects Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-sm">
                  Get started by creating your first project to organize your tasks and team.
                </p>
                <Dialog>
                   <DialogTrigger asChild>
                     <Button size="lg">
                       <span className="material-symbols-outlined text-lg mr-2">add</span> Create Project
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[450px]">
                      {/* Duplicate of the form above, ideally standard component */}
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-display">Create New Project</DialogTitle>
                      </DialogHeader>
                      <form action={createProject} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Project Name *</label>
                          <Input name="name" placeholder="e.g. Website Redesign" required className="rounded-xl border-gray-200 bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Description</label>
                          <textarea name="description" rows={3} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm resize-none" placeholder="Project description..." />
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button type="submit">Create Project</Button>
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
