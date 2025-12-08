import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/layout/Shell";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-muted p-4 mb-6">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Sorry, we couldn&apos;t find the page you&rsquo;re looking for. It might have been moved or doesn&rsquo;t exist.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </Shell>
  );
}
