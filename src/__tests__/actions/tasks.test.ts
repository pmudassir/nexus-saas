import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTask, updateTask, deleteTask } from "@/actions/tasks";
import { prisma } from "@/lib/prisma";
import { requireTenantPermission } from "@/lib/tenant-auth";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/tenant-auth", () => ({
  requireTenantPermission: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Task Actions", () => {
  const mockTenant = { id: "tenant-123", name: "Test Tenant" };
  const mockSession = { user: { id: "user-123", email: "test@example.com" } };

  beforeEach(() => {
    vi.clearAllMocks();
    (requireTenantPermission as ReturnType<typeof vi.fn>).mockResolvedValue({
      tenant: mockTenant,
      session: mockSession,
    });
  });

  describe("createTask", () => {
    it("should create a task with valid data", async () => {
      const formData = new FormData();
      formData.append("title", "Test Task");
      formData.append("projectId", "project-123");
      formData.append("priority", "HIGH");

      await createTask(formData);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "Test Task",
          projectId: "project-123",
          priority: "HIGH",
          tenantId: mockTenant.id,
          creatorId: mockSession.user.id,
        }),
      });
    });

    it("should use default priority if not provided", async () => {
      const formData = new FormData();
      formData.append("title", "Test Task");
      formData.append("projectId", "project-123");

      await createTask(formData);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          priority: "MEDIUM",
        }),
      });
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const formData = new FormData();
      formData.append("taskId", "task-123");
      formData.append("title", "Updated Task");
      formData.append("priority", "LOW");

      await updateTask(formData);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: "task-123",
          tenantId: mockTenant.id,
        },
        data: expect.objectContaining({
          title: "Updated Task",
          priority: "LOW",
        }),
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task by ID", async () => {
      const formData = new FormData();
      formData.append("taskId", "task-123");

      await deleteTask(formData);

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: "task-123",
          tenantId: mockTenant.id,
        },
      });
    });
  });
});
