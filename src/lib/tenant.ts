import { headers } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Tenant } from "@prisma/client";

function normalizeHost(rawHost: string | null): string | null {
  if (!rawHost) return null;
  // Strip port if present (localhost:3000 -> localhost)
  return rawHost.split(":")[0].toLowerCase();
}

function getSubdomain(hostname: string): string | null {
  // For local dev, default everything to the "default" tenant
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "default";
  }

  const parts = hostname.split(".");
  if (parts.length < 3) return null;

  // e.g. client1.app.yourdomain.com -> client1
  const [subdomain] = parts;
  if (subdomain === "www" || subdomain === "app") return null;

  return subdomain;
}

export async function resolveTenantFromHost(
  rawHost: string | null,
  options?: { kind?: "app" | "site" }
): Promise<Tenant | null> {
  const kind = options?.kind ?? "app";
  const hostname = normalizeHost(rawHost);
  if (!hostname) return null;

  // 1) Try explicit Domain mapping (custom domains or app domains)
  const domainRecord = await prisma.domain.findUnique({
    where: {
      domain_type: {
        domain: hostname,
        type: kind === "app" ? "APP" : "SITE",
      },
    },
    include: { tenant: true },
  });

  if (domainRecord?.tenant) {
    return domainRecord.tenant;
  }

  // 2) Fallback to subdomain-based lookup (client1.yourapp.com -> slug "client1")
  const subdomain = getSubdomain(hostname);
  if (!subdomain) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
  });

  if (tenant) return tenant;

  // 3) As a final fallback in dev, return the default tenant if present
  if (process.env.NODE_ENV !== "production") {
    const defaultTenant = await prisma.tenant.findUnique({
      where: { slug: "default" },
    });
    return defaultTenant;
  }

  return null;
}

const getCurrentTenantCached = cache(async (
  kind: "app" | "site",
  host: string | null,
  userId: string | null,
) => {
  const tenant = await resolveTenantFromHost(host, { kind });

  // On localhost, if no tenant resolved and we have a userId,
  // fall back to the first tenant the user belongs to.
  if (!tenant && userId && process.env.NODE_ENV !== "production") {
    const hostname = host?.split(":")[0]?.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const membership = await prisma.tenantUser.findFirst({
        where: { userId },
        include: { tenant: true },
        orderBy: { createdAt: "desc" },
      });
      return membership?.tenant ?? null;
    }
  }

  return tenant;
});

export async function getCurrentTenant(kind: "app" | "site" = "app", userId?: string) {
  const headersList = await headers();
  const host = headersList.get("host");
  return getCurrentTenantCached(kind, host, userId ?? null);
}
