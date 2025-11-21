"use client";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Phone, MoreVertical, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "lead" | "inactive";
  avatar?: string;
  role?: string;
  lastContact?: string;
  className?: string;
}

export function ContactCard({
  id,
  name,
  email,
  phone,
  company,
  status,
  avatar,
  role,
  lastContact,
  className,
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-5 shadow-premium hover:shadow-premium-md transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} alt={name} fallback={name.charAt(0)} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight mb-0.5">
              {name}
            </h3>
            {role && <p className="text-xs text-muted-foreground">{role}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={status} size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 dark:hover:bg-black/50 rounded">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Send Email</DropdownMenuItem>
              <DropdownMenuItem>Schedule Call</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Company */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Building2 className="h-4 w-4" />
        <span>{company}</span>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-2 mb-3">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
        >
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="truncate group-hover/link:underline">{email}</span>
        </a>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
        >
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span className="group-hover/link:underline">{phone}</span>
        </a>
      </div>

      {/* Footer */}
      {lastContact && (
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs text-muted-foreground">
            Last contact: {lastContact}
          </p>
        </div>
      )}
    </div>
  );
}
