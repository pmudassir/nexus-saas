import { Shell } from "@/components/layout/Shell";
import { Calendar } from "lucide-react";

export default function LeaveManagementPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Leave Management
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Track employee leave requests, balances, and approvals. This feature is coming in the next update.
        </p>
      </div>
    </Shell>
  );
}
