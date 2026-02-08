import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTenantUsage, getAllTenantsUsage } from "@/actions/usage";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn(),
    },
    tenantUser: {
      count: vi.fn(),
    },
    project: {
      count: vi.fn(),
    },
    contact: {
      count: vi.fn(),
    },
    invoice: {
      count: vi.fn(),
    },
    tenant: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/tenant-auth", () => ({
  requireTenantMembership: vi.fn(),
}));

describe("Usage Actions", () => {
  const mockTenant = { id: "tenant-123", name: "Test Tenant" };

  beforeEach(() => {
    vi.clearAllMocks();
    (requireTenantMembership as ReturnType<typeof vi.fn>).mockResolvedValue({
      tenant: mockTenant,
    });
  });

  describe("getTenantUsage", () => {
    it("should return usage statistics for the tenant", async () => {
      (prisma.subscription.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
        plan: { maxUsers: 10, maxStorageMb: 10240 },
      });
      (prisma.tenantUser.count as ReturnType<typeof vi.fn>).mockResolvedValue(5);
      (prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(10);
      (prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(100);
      (prisma.invoice.count as ReturnType<typeof vi.fn>).mockResolvedValue(50);

      const usage = await getTenantUsage();

      expect(usage).toEqual({
        storage: expect.objectContaining({ unit: "GB" }),
        users: { count: 5, limit: 10 },
        projects: { count: 10 },
        contacts: { count: 100 },
        invoices: { count: 50 },
      });
    });

    it("should use defaults when no subscription exists", async () => {
      (prisma.subscription.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (prisma.tenantUser.count as ReturnType<typeof vi.fn>).mockResolvedValue(1);
      (prisma.project.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);
      (prisma.contact.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);
      (prisma.invoice.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      const usage = await getTenantUsage();

      expect(usage.users.limit).toBe(5); // Default limit
    });
  });

  describe("getAllTenantsUsage", () => {
    it("should return usage for all tenants", async () => {
      (prisma.tenant.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          id: "tenant-1",
          name: "Tenant 1",
          status: "ACTIVE",
          _count: { memberships: 5, projects: 10, contacts: 100, invoices: 50 },
          subscriptions: [{ plan: { name: "Professional" } }],
        },
        {
          id: "tenant-2",
          name: "Tenant 2",
          status: "ACTIVE",
          _count: { memberships: 2, projects: 3, contacts: 20, invoices: 5 },
          subscriptions: [],
        },
      ]);

      const tenantsUsage = await getAllTenantsUsage();

      expect(tenantsUsage).toHaveLength(2);
      expect(tenantsUsage[0].plan).toBe("Professional");
      expect(tenantsUsage[1].plan).toBe("Free");
    });
  });
});
