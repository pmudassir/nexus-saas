export const PERMISSION_KEYS = {
  SETTINGS_USERS_MANAGE: "settings.users.manage",
  SETTINGS_TENANT_READ: "settings.tenant.read",
  SETTINGS_TENANT_UPDATE: "settings.tenant.update",

  FINANCE_INVOICE_CREATE: "finance.invoice.create",
  FINANCE_INVOICE_READ: "finance.invoice.read",
  FINANCE_INVOICE_UPDATE: "finance.invoice.update",
  FINANCE_INVOICE_DELETE: "finance.invoice.delete",

  FINANCE_EXPENSE_CREATE: "finance.expense.create",
  FINANCE_EXPENSE_READ: "finance.expense.read",
  FINANCE_EXPENSE_UPDATE: "finance.expense.update",
  FINANCE_EXPENSE_DELETE: "finance.expense.delete",

  PROJECTS_PROJECT_CREATE: "projects.project.create",
  PROJECTS_PROJECT_READ: "projects.project.read",
  PROJECTS_PROJECT_UPDATE: "projects.project.update",
  PROJECTS_PROJECT_DELETE: "projects.project.delete",

  PROJECTS_TASK_CREATE: "projects.task.create",
  PROJECTS_TASK_READ: "projects.task.read",
  PROJECTS_TASK_UPDATE: "projects.task.update",
  PROJECTS_TASK_DELETE: "projects.task.delete",
} as const;

export type PermissionKey =
  (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS];
