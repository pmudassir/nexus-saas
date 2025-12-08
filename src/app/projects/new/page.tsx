import { Shell } from "@/components/layout/Shell";
import { CheckSquare } from "lucide-react";

export default function NewTaskPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <CheckSquare className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Create New Task
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The task creation wizard is under construction. Soon you will be able to assign tasks, set priorities, and attach files here.
        </p>
      </div>
    </Shell>
  );
}
