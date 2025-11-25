import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Define all permissions for the platform
const PERMISSIONS = [
  // Finance permissions
  { key: 'finance.invoice.create', module: 'finance', action: 'create', description: 'Create invoices' },
  { key: 'finance.invoice.read', module: 'finance', action: 'read', description: 'View invoices' },
  { key: 'finance.invoice.update', module: 'finance', action: 'update', description: 'Edit invoices' },
  { key: 'finance.invoice.delete', module: 'finance', action: 'delete', description: 'Delete invoices' },
  { key: 'finance.expense.create', module: 'finance', action: 'create', description: 'Create expenses' },
  { key: 'finance.expense.read', module: 'finance', action: 'read', description: 'View expenses' },
  { key: 'finance.expense.update', module: 'finance', action: 'update', description: 'Edit expenses' },
  { key: 'finance.expense.delete', module: 'finance', action: 'delete', description: 'Delete expenses' },
  
  // HR permissions
  { key: 'hr.employee.create', module: 'hr', action: 'create', description: 'Create employee records' },
  { key: 'hr.employee.read', module: 'hr', action: 'read', description: 'View employee records' },
  { key: 'hr.employee.update', module: 'hr', action: 'update', description: 'Edit employee records' },
  { key: 'hr.employee.delete', module: 'hr', action: 'delete', description: 'Delete employee records' },
  { key: 'hr.payroll.create', module: 'hr', action: 'create', description: 'Create payroll entries' },
  { key: 'hr.payroll.read', module: 'hr', action: 'read', description: 'View payroll' },
  { key: 'hr.payroll.update', module: 'hr', action: 'update', description: 'Edit payroll' },
  { key: 'hr.payroll.delete', module: 'hr', action: 'delete', description: 'Delete payroll entries' },
  
  // Inventory permissions
  { key: 'inventory.product.create', module: 'inventory', action: 'create', description: 'Create products' },
  { key: 'inventory.product.read', module: 'inventory', action: 'read', description: 'View products' },
  { key: 'inventory.product.update', module: 'inventory', action: 'update', description: 'Edit products' },
  { key: 'inventory.product.delete', module: 'inventory', action: 'delete', description: 'Delete products' },
  
  // CRM permissions
  { key: 'crm.contact.create', module: 'crm', action: 'create', description: 'Create contacts' },
  { key: 'crm.contact.read', module: 'crm', action: 'read', description: 'View contacts' },
  { key: 'crm.contact.update', module: 'crm', action: 'update', description: 'Edit contacts' },
  { key: 'crm.contact.delete', module: 'crm', action: 'delete', description: 'Delete contacts' },
  
  // Projects permissions
  { key: 'projects.project.create', module: 'projects', action: 'create', description: 'Create projects' },
  { key: 'projects.project.read', module: 'projects', action: 'read', description: 'View projects' },
  { key: 'projects.project.update', module: 'projects', action: 'update', description: 'Edit projects' },
  { key: 'projects.project.delete', module: 'projects', action: 'delete', description: 'Delete projects' },
  { key: 'projects.task.create', module: 'projects', action: 'create', description: 'Create tasks' },
  { key: 'projects.task.read', module: 'projects', action: 'read', description: 'View tasks' },
  { key: 'projects.task.update', module: 'projects', action: 'update', description: 'Edit tasks' },
  { key: 'projects.task.delete', module: 'projects', action: 'delete', description: 'Delete tasks' },
  
  // Website Builder permissions
  { key: 'builder.page.create', module: 'builder', action: 'create', description: 'Create website pages' },
  { key: 'builder.page.read', module: 'builder', action: 'read', description: 'View website pages' },
  { key: 'builder.page.update', module: 'builder', action: 'update', description: 'Edit website pages' },
  { key: 'builder.page.delete', module: 'builder', action: 'delete', description: 'Delete website pages' },
  
  // Analytics permissions
  { key: 'analytics.read', module: 'analytics', action: 'read', description: 'View analytics' },
  
  // Settings permissions
  { key: 'settings.tenant.read', module: 'settings', action: 'read', description: 'View tenant settings' },
  { key: 'settings.tenant.update', module: 'settings', action: 'update', description: 'Edit tenant settings' },
  { key: 'settings.users.manage', module: 'settings', action: 'manage', description: 'Manage team members' },
];

async function main() {
  console.log('🌱 Seeding permissions...');

  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        module: permission.module,
        action: permission.action,
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log(`✅ Seeded ${PERMISSIONS.length} permissions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding permissions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
