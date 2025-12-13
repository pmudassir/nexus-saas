import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { RevenueChart } from "@/components/analytics/Charts";
import {
  Clock,
  ArrowUpRight
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await getDashboardStats();

  return (
    <Shell>
      <div className="min-h-screen w-full space-y-8 pb-8">
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center font-display font-bold text-2xl shadow-xl">
              Nx
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
                Financial
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Start searching here..." 
                  className="pl-10 pr-4 py-3 rounded-full bg-white border-0 shadow-soft w-64 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground"
                />
             </div>
             <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-white shadow-soft hover:shadow-soft-lg hover:scale-105 transition-all text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
             </Button>
             <div className="h-12 w-12 rounded-full overflow-hidden shadow-soft border-2 border-white hover:border-primary transition-colors cursor-pointer">
                <img src="https://github.com/shadcn.png" alt="Profile" className="h-full w-full object-cover" />
             </div>
          </div>
        </div>
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-4xl p-8 shadow-soft-lg relative overflow-hidden mb-8">
           <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-orange-50 text-3xl font-display font-bold text-orange-600">
                    19
                 </div>
                 <div className="flex flex-col">
                    <span className="text-foreground font-bold text-lg">Tue,</span>
                    <span className="text-muted-foreground font-medium">December</span>
                 </div>
                 <div className="h-12 w-px bg-border mx-4 hidden md:block" />
                 <Link href="/tasks">
                  <Button className="rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-lg shadow-orange-500/30 px-6 h-12 text-md font-medium border-0">
                      Show my Tasks <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                 </Link>
                 <button className="h-12 w-12 rounded-full border border-border flex items-center justify-center bg-white hover:bg-gray-50 transition">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                 </button>
              </div>
           </div>
           
           <div className="text-center md:text-right mt-6 md:mt-0 relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                Hey, Need help? 👋
              </h2>
              <div className="flex items-center justify-end gap-2">
                 <p className="text-2xl md:text-3xl text-muted-foreground/40 font-light tracking-tight">
                   Just ask me anything!
                 </p>
                 <button className="h-12 w-12 rounded-full bg-white shadow-soft flex items-center justify-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                 </button>
              </div>
           </div>
           
           {/* Decor */}
           <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-orange-50/30 to-transparent pointer-events-none" />
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           {/* Col 1: VISA Card */}
           <div className="bg-white rounded-4xl p-8 shadow-soft relative overflow-hidden flex flex-col justify-between h-[340px]">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-xl font-display">VISA</h3>
                    <p className="text-muted-foreground text-xs mt-1 font-medium">Linked to main account</p>
                    <p className="font-mono text-lg mt-2 text-foreground font-bold tracking-widest">**** 2719</p>
                 </div>
                 <div className="px-4 py-1.5 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 bg-gray-50">
                    Direct Debits <span className="text-[8px]">▼</span>
                 </div>
              </div>
              
              <div className="flex gap-3">
                 <button className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-lg shadow-black/20">Receive</button>
                 <button className="bg-gray-100 text-foreground px-8 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition">Send</button>
              </div>

              <div className="mt-auto flex justify-between items-end">
                 <div>
                   <p className="text-muted-foreground text-xs font-medium mb-1">Monthly regular fee</p>
                   <p className="font-display font-bold text-3xl text-foreground">$ 25.00</p>
                 </div>
                 <div className="text-orange-600 bg-orange-50 px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 hover:bg-orange-100 cursor-pointer transition">
                    <div className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">✎</div> 
                    Edit cards limitation
                 </div>
              </div>
           </div>

           {/* Col 2: Income & Paid Stats */}
           <div className="flex flex-col gap-6 h-[340px]">
              <div className="bg-white rounded-4xl p-6 shadow-soft flex-1 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-foreground border border-gray-100">
                       <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-muted-foreground border border-gray-100">Weekly ▼</div>
                 </div>
                 <div>
                    <p className="text-muted-foreground text-xs font-medium mb-1">Total income</p>
                    <p className="font-display font-bold text-3xl text-foreground tracking-tight">$ 23,194.80</p>
                 </div>
              </div>
              <div className="bg-white rounded-4xl p-6 shadow-soft flex-1 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-foreground border border-gray-100">
                       <Clock className="h-5 w-5" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-muted-foreground border border-gray-100">Weekly ▼</div>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-muted-foreground text-xs font-medium mb-1">Total paid</p>
                       <p className="font-display font-bold text-3xl text-foreground tracking-tight">$ 8,145.20</p>
                    </div>
                    <div className="text-orange-600 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-80">
                       View on chart mode <ArrowUpRight className="h-3 w-3" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Col 3: Mixed Cluster */}
           <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[340px]">
              <div className="bg-white rounded-[32px] p-4 shadow-soft flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full border-[3px] border-white" />
                 </div>
                 <p className="font-bold text-sm">System Lock</p>
              </div>
              
              <div className="bg-white rounded-[32px] p-5 shadow-soft flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <Clock className="h-5 w-5 text-foreground" />
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                 </div>
                 <div>
                    <p className="font-bold text-2xl font-display">13 Days</p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-tight mt-1">109 hours, 23 minutes</p>
                 </div>
              </div>
              
              <div className="bg-black rounded-[32px] p-4 shadow-soft flex flex-col items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 flex items-center justify-center">
                    {/* Simplified Radial Chart */}
                    <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                      <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                      <path className="text-orange-500" strokeDasharray="36, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                 </div>
                 <div className="relative z-10 text-center">
                    <p className="text-white text-lg font-bold">36%</p>
                    <p className="text-gray-400 text-[9px] uppercase tracking-wider font-medium">Growth rate</p>
                 </div>
              </div>
              
              <div className="bg-white rounded-[32px] p-0 shadow-soft relative overflow-hidden flex flex-col">
                 <div className="p-4 pb-0 flex justify-between items-start">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                       <span className="h-3 w-[2px] bg-foreground mx-[1px]" />
                       <span className="h-2 w-[2px] bg-foreground/50 mx-[1px]" />
                       <span className="h-4 w-[2px] bg-foreground/30 mx-[1px]" />
                    </div>
                    <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-bold">2023</span>
                 </div>
                 <div className="flex-1 mt-2 opacity-80">
                    <RevenueChart />
                 </div>
              </div>
           </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Annual Profits */}
           <div className="lg:col-span-1 bg-white rounded-4xl p-6 shadow-soft flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-md">Annual profits</h3>
                 <div className="px-2 py-1 rounded-full bg-gray-50 text-[10px] font-bold border border-gray-100">2023 ▼</div>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                 {/* Concentric Circles Implementation */}
                 <div className="absolute w-[180px] h-[180px] rounded-full bg-orange-50/50 flex items-end justify-center overflow-hidden border border-orange-100/30">
                     <span className="mb-6 text-orange-300 font-bold">$14k</span>
                 </div>
                 <div className="absolute w-[120px] h-[120px] rounded-full bg-orange-100 flex items-end justify-center overflow-hidden border border-orange-200/50 shadow-sm z-10 top-[60px]"> {/* Offset for visual stacking */}
                     <span className="mb-4 text-orange-400 font-bold">$9.3k</span>
                 </div>
                 <div className="absolute w-[70px] h-[70px] rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 z-20 top-[95px]">
                     <span className="text-white font-bold text-sm">$4k</span>
                 </div>
              </div>
           </div>

           {/* Activity Manager */}
           <div className="lg:col-span-2 bg-white rounded-4xl p-6 shadow-soft flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-md">Activity manager</h3>
                 <button className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100">
                    <span className="mb-2">...</span>
                 </button>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="relative flex-1">
                    <input type="text" placeholder="Search in activities..." className="w-full pl-9 pr-4 py-2.5 rounded-full bg-gray-50 text-xs font-medium border-0 focus:ring-1 focus:ring-orange-500 placeholder:text-muted-foreground" />
                    <div className="absolute left-3.5 top-3 h-2 w-2 rounded-full border-2 border-muted-foreground/40" />
                 </div>
                 <div className="flex gap-2">
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-foreground text-[10px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-200 transition">
                       Team <span className="h-1.5 w-1.5 rounded-full bg-orange-500"/>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white border border-gray-100 text-muted-foreground text-[10px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 transition">
                       Insights ✕
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 flex-1">
                 <div className="col-span-1 bg-white border border-gray-100 rounded-3xl p-4 flex flex-col justify-between hover:border-gray-200 transition">
                    <p className="font-display font-bold text-2xl text-orange-600">$43.20 <span className="text-gray-400 text-[10px] font-bold ml-1">USD</span></p>
                    <div className="h-10 w-full opacity-60">
                       <RevenueChart /> 
                    </div>
                 </div>
                 <div className="col-span-1 flex flex-col justify-center gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-1 px-1">
                       <span>Business plans</span> <span>⋮</span>
                    </div>
                    {['Bank loans', 'Accounting', 'HR management'].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm ${['bg-[#f97316]', 'bg-[#ea580c]', 'bg-[#c2410c]'][i]} group-hover:scale-110 transition`}>
                             {item[0]}
                          </div>
                          <span className="text-[11px] font-bold text-foreground/80">{item}</span>
                       </div>
                    ))}
                 </div>
                  <div className="col-span-1 bg-gray-50 rounded-3xl p-4 flex flex-col text-center items-center justify-center gap-2 border border-dashed border-gray-200">
                     <div className="h-9 w-9 text-orange-500 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <p className="text-[11px] font-bold">Wallet Verification</p>
                     <p className="text-[9px] text-muted-foreground leading-tight px-1">Enable 2-step verification.</p>
                     <button className="mt-2 w-full bg-orange-500 text-white text-[10px] py-1.5 rounded-full font-bold shadow-md hover:bg-orange-600 transition">Enable</button>
                  </div>
              </div>
           </div>

           {/* Right Col */}
           <div className="lg:col-span-1 flex flex-col gap-6 h-[320px]">
              <div className="bg-white rounded-4xl p-6 shadow-soft flex-1 flex flex-col relative overflow-hidden">
                 <div className="mb-2 z-10 relative">
                    <p className="font-bold text-md">Main Stocks</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Extended & Limited</p>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 h-24 opacity-80 z-0">
                    <RevenueChart />
                 </div>
                 <div className="flex justify-end mt-auto z-10 relative">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> 9.3%
                    </span>
                 </div>
              </div>
              <div className="bg-[#f3f4f6] rounded-4xl p-6 shadow-none flex flex-col justify-center gap-3 relative overflow-hidden">
                 <button className="absolute top-4 right-4 h-5 w-5 rounded-full bg-gray-200/50 flex items-center justify-center text-[10px] hover:bg-gray-300 text-gray-500">✕</button>
                 <div className="flex gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"/>
                    <span className="h-1.5 w-4 rounded-full bg-black"/>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"/>
                 </div>
                 <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Review rating</p>
                    <p className="font-bold text-xs leading-tight mt-1 pr-4">How is your business management going?</p>
                 </div>
                 <div className="flex justify-between text-2xl mt-1 px-1">
                    <span className="cursor-pointer hover:scale-125 transition grayscale hover:grayscale-0">😞</span>
                    <span className="cursor-pointer hover:scale-125 transition grayscale hover:grayscale-0">😐</span>
                    <span className="cursor-pointer hover:scale-125 transition grayscale-0">🙂</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Shell>
  );
}
