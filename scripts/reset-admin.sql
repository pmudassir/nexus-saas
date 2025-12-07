-- Upsert Admin User
INSERT INTO "User" (id, email, name, password, role, "isSuperAdmin", "createdAt", "updatedAt")
VALUES (
  'cm3uvcxlc0000md08kkd3lx6x', -- Reuse the ID we saw in logs if possible, or a new one. 
  -- Actually, let's use a new ID if it doesn't exist, but we want to match email.
  -- Better to let it generate or use a fixed one.
  -- Let's use the one we saw in logs to be safe: 'cm3uvcxlc0000md08kkd3lx6x'
  -- Wait, if that ID doesn't exist, we can insert it.
  'admin@nexus.com',
  'Admin User',
  '$2b$10$fRQ9gov75ue2TxtkXNiqGu2RvSdaRuOcIyyIfHyS0rs/VnbKUFl7a', -- 'password'
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$10$fRQ9gov75ue2TxtkXNiqGu2RvSdaRuOcIyyIfHyS0rs/VnbKUFl7a',
  role = 'ADMIN',
  "isSuperAdmin" = true;

-- Upsert Default Tenant
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

-- Upsert Membership
-- First, get the User ID for admin@nexus.com (in case it wasn't the one we hardcoded)
DO $$
DECLARE
  v_user_id TEXT;
  v_tenant_id TEXT := 'default-tenant-id';
BEGIN
  SELECT id INTO v_user_id FROM "User" WHERE email = 'admin@nexus.com';
  
  INSERT INTO "TenantUser" (id, "tenantId", "userId", role, "createdAt", "updatedAt")
  VALUES (
    'membership-' || gen_random_uuid(),
    v_tenant_id,
    v_user_id,
    'TENANT_ADMIN',
    NOW(),
    NOW()
  )
  ON CONFLICT ("tenantId", "userId") DO UPDATE SET role = 'TENANT_ADMIN';
END $$;
