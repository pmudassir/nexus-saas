
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Paperclip,
  Plus,
  Share2,
  Circle,
  Check,
  Users
} from "lucide-react";

export default function TasksPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm font-medium">Thursday, 20th February</p>
              <h1 className="text-4xl font-display font-bold text-foreground">
                Good Evening! John,
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full h-10 px-4 border-gray-200">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button className="rounded-full h-10 px-4 bg-white border border-gray-200 text-foreground hover:bg-gray-50 shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white rounded-full px-8 py-4 w-fit shadow-soft border border-gray-100">
             <div className="flex items-center gap-2">
               <Clock className="h-5 w-5 text-foreground" />
               <span className="font-bold text-lg">12hrs</span>
               <span className="text-muted-foreground text-sm">Time Saved</span>
             </div>
             <div className="h-8 w-px bg-border" />
             <div className="flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5 text-foreground" />
               <span className="font-bold text-lg">24</span>
               <span className="text-muted-foreground text-sm">Projects Completed</span>
             </div>
             <div className="h-8 w-px bg-border" />
             <div className="flex items-center gap-2">
               <div className="h-5 w-5 rounded-full border-2 border-foreground flex items-center justify-center text-[10px] font-bold">8</div>
               <span className="font-bold text-lg">7</span>
               <span className="text-muted-foreground text-sm">Projects In-progress</span>
             </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-4xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                 <div className="h-4 w-4 text-foreground">⋮</div> 
               </div> 
               <h2 className="text-xl font-bold font-display">My Projects</h2>
               <button className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium flex items-center gap-1 hover:bg-gray-50 ml-2">
                 This Week <span className="text-[10px]">▼</span>
               </button>
            </div>
            <Button variant="ghost" className="rounded-full bg-gray-50 hover:bg-gray-100 px-4">See All</Button>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50/50 rounded-2xl mb-2 text-sm font-medium text-muted-foreground">
               <div className="col-span-1 md:col-span-5 flex items-center gap-2">
                 <span>✎</span> Task Name
               </div>
               <div className="col-span-1 md:col-span-4 items-center gap-2 hidden md:flex">
                 <Users className="h-4 w-4" /> Assign
               </div>
               <div className="col-span-1 md:col-span-3 items-center gap-2 hidden md:flex">
                 <div className="h-4 w-4 rounded-full border border-current border-dashed" /> Status
               </div>
            </div>

            <div className="space-y-2">
              {[
                { name: "Help DStudio get more customers", comments: 7, attach: 2, assign: "Phoenix Winters", img: "/avatars/01.png", status: "In Progress", color: "bg-green-100 text-green-700" },
                { name: "Plan a trip", comments: 10, attach: 3, assign: "Cohen Merritt", img: "/avatars/02.png", status: "Pending", color: "bg-pink-100 text-pink-700" },
                { name: "Return a package", comments: 5, attach: 8, assign: "Lukas Juarez", img: "/avatars/03.png", status: "Completed", color: "bg-blue-100 text-blue-700" },
              ].map((task, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50/50 rounded-2xl transition-colors items-center border border-transparent hover:border-gray-100">
                   <div className="col-span-12 md:col-span-5">
                      <div className="flex items-center justify-between pr-8">
                        <span className="font-medium text-foreground">{task.name}</span>
                        <div className="flex items-center gap-3 text-gray-400 text-xs">
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {task.comments}</span>
                          <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" /> {task.attach}</span>
                        </div>
                      </div>
                   </div>
                   <div className="col-span-6 md:col-span-4 flex items-center gap-3 mt-2 md:mt-0">
                      <Avatar src={task.img} fallback={task.assign[0]} className="h-8 w-8" />
                      <span className="font-bold text-sm hidden md:inline">{task.assign}</span>
                   </div>
                   <div className="col-span-6 md:col-span-3 mt-2 md:mt-0 text-right md:text-left">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${task.color}`}>
                        {task.status}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Schedule */}
           <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-foreground" />
                    <h2 className="text-xl font-bold font-display">Schedule</h2>
                 </div>
                 <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">•••</button>
              </div>

              <div className="flex justify-between mb-8 px-2 overflow-x-auto">
                 {[
                   { day: "Mo", date: "15", active: false },
                   { day: "Tu", date: "16", active: false },
                   { day: "We", date: "17", active: true },
                   { day: "Th", date: "18", active: false },
                   { day: "Fr", date: "19", active: false },
                   { day: "Sa", date: "20", active: false },
                   { day: "Su", date: "14", active: false },
                 ].map((d, i) => (
                   <div key={i} className={`flex flex-col items-center gap-2 cursor-pointer ${d.active ? 'text-purple-600' : 'text-gray-500'}`}>
                      <span className="text-xs font-bold">{d.day}</span>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${d.active ? 'bg-purple-100' : ''}`}>
                        {d.date}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4 group">
                    <div className="w-1 rounded-full bg-green-400 h-10 mt-1" />
                    <div className="flex-1">
                       <h3 className="font-bold text-foreground">Kickoff Meeting</h3>
                       <p className="text-xs text-muted-foreground mt-1">01:00 PM to 02:30 PM</p>
                    </div>
                    <div className="flex -space-x-3">
                       <Avatar fallback="A" className="h-8 w-8 border-2 border-white" />
                       <Avatar fallback="B" className="h-8 w-8 border-2 border-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">•••</button>
                 </div>

                 <div className="flex gap-4 group">
                    <div className="w-1 rounded-full bg-blue-500 h-10 mt-1" />
                    <div className="flex-1">
                       <h3 className="font-bold text-foreground">Create Wordpress website for...</h3>
                       <p className="text-xs text-muted-foreground mt-1">04:00 PM to 02:30 PM</p>
                    </div>
                    <div className="flex -space-x-3">
                       <Avatar fallback="C" className="h-8 w-8 border-2 border-white" />
                       <Avatar fallback="D" className="h-8 w-8 border-2 border-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">•••</button>
                 </div>

                 <div className="flex gap-4 group">
                    <div className="w-1 rounded-full bg-pink-400 h-10 mt-1" />
                    <div className="flex-1">
                       <h3 className="font-bold text-foreground">Create User flow for hotel booking</h3>
                       <p className="text-xs text-muted-foreground mt-1">05:00 PM to 02:30 PM</p>
                    </div>
                    <div className="flex -space-x-3">
                       <Avatar fallback="E" className="h-8 w-8 border-2 border-white" />
                       <Avatar fallback="F" className="h-8 w-8 border-2 border-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">•••</button>
                 </div>
              </div>
           </div>

           {/* Notes */}
           <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100 min-h-[400px]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="h-6 w-6"><span className="text-xl">📝</span></div>
                 <h2 className="text-xl font-bold font-display">Notes</h2>
              </div>
              
              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="mt-1"><Circle className="h-5 w-5 text-gray-300" /></div>
                    <div>
                       <h3 className="font-bold text-foreground">Landing Page For Website</h3>
                       <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                         To get started on a landing page, could you provide a bit more detail about its purpose?
                       </p>
                       <div className="border-b border-dashed border-gray-200 mt-4 w-full" />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="mt-1"><Circle className="h-5 w-5 text-gray-300" /></div>
                    <div>
                       <h3 className="font-bold text-foreground">Fixing icons with dark backgrounds</h3>
                       <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                         Use icons that are easily recognizable and straightforward. Avoid overly complex designs.
                       </p>
                       <div className="border-b border-dashed border-gray-200 mt-4 w-full" />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="mt-1"><div className="h-5 w-5 rounded-full bg-purple-200 text-purple-600 flex items-center justify-center"><Check className="h-3 w-3" /></div></div>
                    <div>
                       <h3 className="font-bold line-through decoration-gray-400 text-gray-400">Discussion regarding userflow improvement</h3>
                       <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                         What&apos;s the main goal of the landing page? (e.g., lead generation, product)
                       </p>
                       <div className="border-b border-dashed border-gray-200 mt-4 w-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Shell>
  );
}
