import { Shell } from "@/components/layout/Shell";
import { Clock } from "lucide-react";

export default function AttendancePage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Clock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Attendance Tracking
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Monitor employee check-ins, overtime, and work hours. This module is currently being built.
        </p>
      </div>
    </Shell>
  );
}
