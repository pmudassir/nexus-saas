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
        "group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} alt={name} fallback={name.charAt(0)} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight mb-0.5 text-slate-900">
              {name}
            </h3>
            {role && <p className="text-xs text-slate-500">{role}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={status} size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Send Email</DropdownMenuItem>
              <DropdownMenuItem>Schedule Call</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Company */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <Building2 className="h-4 w-4" />
        <span>{company}</span>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-2 mb-3">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group/link"
        >
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="truncate group-hover/link:underline">{email}</span>
        </a>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group/link"
        >
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span className="group-hover/link:underline">{phone}</span>
        </a>
      </div>

      {/* Footer */}
      {lastContact && (
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Last contact: {lastContact}
          </p>
        </div>
      )}
    </div>
  );
}
