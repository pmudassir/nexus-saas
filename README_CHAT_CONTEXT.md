# Chat Context README

Last updated: 2026-02-17

## Goal of this session
Stabilize and harden the multi-tenant authorization model so tenant admins can assign scoped roles (module visibility + action permissions) and enforcement happens on the server, not just in UI.

## What was addressed in this session
- Unified super-admin checks through `src/lib/admin-auth.ts`.
- Standardized admin protection across plans, usage, tenants, and admin pages.
- Closed admin authorization gap in tenant usage overview.
- Consolidated feature initialization logic to a single source.
- Reduced duplicated role/feature computation in sidebar logic.
- Hardened tenant deletion flow with broad relational cleanup in a transaction.
- Added a settings index route to resolve `/settings` navigation mismatch.
- Hardened Stripe webhook typing and removed lint/type blockers.
- Added Stripe webhook idempotency using `WebhookEvent` and unique event claims.
- Added permission guard helper `requireTenantPermission()` and applied it to team/roles/permissions mutation paths.
- Fixed Next.js server component runtime issue from passing event handlers in server-rendered settings pages.
- Fixed `"use server"` invalid exports causing runtime failures.
- Added role-management upgrade:
  - `CustomRole` now supports both `featureKeys` and `permissions`.
  - Roles UI now allows selecting features + permission keys.
  - Custom role permissions are enforced in `hasPermission()`.
- Added module-level server route gating using `requireFeatureAccess()` and per-module layouts.
- Cleaned lint/type issues so project is currently green on checks.
- Fixed settings back-navigation desync (URL changed but stale view remained) by removing fragile client route animation wrapper and adding a settings route template remount boundary.
- Reduced duplicate Prisma calls by adding request-level caching and permission consolidation:
  - cached tenant resolution by host/user in `src/lib/tenant.ts`
  - cached tenant membership context in `src/lib/tenant-auth.ts`
  - cached user context in `src/lib/rbac.ts`
  - cached tenant-user permission lookup in `src/lib/features.ts`
  - replaced repeated `hasPermission()` checks with one `getUserPermissions()` read in `src/app/settings/page.tsx`
- Updated ESLint ignores to exclude `.next_bak*` generated artifacts from lint runs.

## Current validation state
- `npm run type-check`: passing
- `npm run lint`: passing (added `.next_bak*/**` ignore to `eslint.config.mjs` so backup build artifacts do not pollute lint output)
- `npm run build`: passing

## Key files introduced in this session
- `src/lib/admin-auth.ts`
- `src/app/settings/page.tsx`
- `prisma/migrations/20260217221500_add_webhook_events/migration.sql`
- `prisma/migrations/20260217225500_add_custom_role_permissions/migration.sql`
- `src/lib/permission-keys.ts`
- `src/app/finance/layout.tsx`
- `src/app/crm/layout.tsx`
- `src/app/hr/layout.tsx`
- `src/app/inventory/layout.tsx`
- `src/app/projects/layout.tsx`
- `src/app/tasks/layout.tsx`
- `src/app/analytics/layout.tsx`
- `src/app/automation/layout.tsx`
- `src/app/builder/layout.tsx`
- `src/app/settings/template.tsx`
- `src/app/admin/TenantCreationForm.tsx` (currently untracked in git)

## Important runtime/deploy note
Before running in a new environment, apply migrations:
1. `npx prisma migrate dev` (local)
2. `npx prisma migrate deploy` (staging/prod)

Required migrations:
- webhook idempotency table (`WebhookEvent`)
- custom role permissions column (`CustomRole.permissions`)

## Resume checklist (next chat)
1. Re-verify browser back/forward gestures on `/settings/*` routes in your target browser(s) after deploying this patch.
2. Continue permission-gate rollout across remaining write-heavy actions (finance/invoices/projects/inventory/hr/automation/builder).
3. Replace placeholder `npm run test` with real Vitest execution and add regression tests for tenant boundaries + role enforcement.
4. Add explicit schema validation and user-facing action errors for critical server actions.
5. Tighten production security headers/CSP and add rate limiting for sensitive mutations.
