-- Insert tenant membership for the specific user ID found in logs
INSERT INTO "TenantUser" (id, "tenantId", "userId", role, "createdAt", "updatedAt")
VALUES (
  'membership-' || gen_random_uuid(),
  'default-tenant-id',
  'cm3uvcxlc0000md08kkd3lx6x',
  'TENANT_ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT ("tenantId", "userId") DO UPDATE SET role = 'TENANT_ADMIN';
