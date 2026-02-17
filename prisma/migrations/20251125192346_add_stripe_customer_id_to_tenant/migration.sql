-- Add Stripe customer linkage on tenant (idempotent for existing DBs)
ALTER TABLE "Tenant"
ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
