import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const initials = fallback || alt?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold overflow-hidden ring-2 ring-background",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

interface AvatarStackProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarStack({
  avatars,
  max = 4,
  size = "md",
  className,
}: AvatarStackProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="hover:z-10 hover:scale-110 transition-transform duration-200"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "relative inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          <span>+{remaining}</span>
        </div>
      )}
    </div>
  );
}
