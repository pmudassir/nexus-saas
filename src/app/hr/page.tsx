import { Shell } from "@/components/layout/Shell";
import { Widget } from "@/components/dashboard/Widget";
import { Users, DollarSign, Briefcase, Calendar } from "lucide-react";

export default function HRPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-muted-foreground">
            Manage your team, payroll, and company culture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Widget
            title="Total Employees"
            description="+4 new hires this month"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">124</div>
          </Widget>
          <Widget
            title="Open Positions"
            description="Across 3 departments"
            icon={<Briefcase className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">8</div>
          </Widget>
          <Widget
            title="Next Payroll"
            description="Due in 5 days"
            icon={<Calendar className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">Oct 31</div>
          </Widget>
          <Widget
            title="Payroll Cost"
            description="Estimated for this month"
            icon={<DollarSign className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">$845,000</div>
          </Widget>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-4">Department Distribution</h3>
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Chart Placeholder
            </div>
          </div>
          <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-4">
              Upcoming Birthdays & Anniversaries
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        John Doe&apos;s Birthday
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Oct {20 + i}, 2023
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
