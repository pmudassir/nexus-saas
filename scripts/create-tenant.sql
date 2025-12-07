-- Insert default tenant
INSERT INTO "Tenant" (id, name, slug, status, "createdAt", "updatedAt")
VALUES (
  'default-tenant-id',
  'Default Tenant',
  'default',
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Get the admin user ID (assuming it exists from previous seed)
-- Then insert tenant membership
INSERT INTO "TenantUser" (id, "tenantId", "userId", role, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'default-tenant-id',
  id,
  'TENANT_ADMIN',
  NOW(),
  NOW()
FROM "User"
WHERE email = 'admin@nexus.com'
ON CONFLICT ("tenantId", "userId") DO NOTHING;
