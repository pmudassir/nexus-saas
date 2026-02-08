import { z } from "zod";

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  projectId: z.string().uuid("Invalid project ID"),
  assigneeId: z.string().uuid("Invalid assignee ID").optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  taskId: z.string().uuid("Invalid task ID"),
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]).default("ACTIVE"),
  budget: z.number().min(0, "Budget must be positive").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Contact validation schemas
export const createContactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

// Invoice validation schemas
export const createInvoiceSchema = z.object({
  clientId: z.string().uuid("Invalid client ID"),
  dueDate: z.string().min(1, "Due date is required"),
  items: z.array(z.object({
    description: z.string().min(1, "Description required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
  notes: z.string().max(1000).optional(),
});

// Employee validation schemas
export const createEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required").max(100),
  department: z.string().max(100).optional(),
  salary: z.number().min(0, "Salary must be positive").optional(),
  startDate: z.string().optional(),
});

// Automation validation schemas
export const createAutomationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  trigger: z.string().min(1, "Trigger is required"),
  action: z.string().min(1, "Action is required"),
  conditions: z.record(z.string(), z.unknown()).optional(),
});

// Helper function to validate form data
export function validateFormData<T extends z.ZodSchema>(
  schema: T,
  formData: FormData
): z.infer<T> {
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    // Try to parse as JSON for nested objects/arrays
    if (typeof value === "string") {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    } else {
      data[key] = value;
    }
  });
  return schema.parse(data);
}
