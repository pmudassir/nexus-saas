"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-[#E9E9E8] bg-white text-[#37352f] shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
