# Work Done and Pending README

Last updated: 2026-02-17

## Completed work
1. Admin auth consistency
- Replaced mixed admin checks with super-admin guards via `src/lib/admin-auth.ts`.
- Updated admin-sensitive actions/pages to use the same guard model.

2. Authorization gap fix
- Added super-admin protection to cross-tenant usage fetch in `src/actions/usage.ts`.

3. Logic consolidation
- Feature initialization now uses one implementation path.
- Sidebar permission/feature visibility now reuses RBAC context logic.

4. Tenant lifecycle hardening
- Expanded tenant deletion cleanup flow in `src/actions/tenants.ts` to remove dependent records in a transaction.

5. Routing consistency
- Added `/settings` index route in `src/app/settings/page.tsx` to avoid dead navigation.

6. Code health cleanup
- Removed type/lint blockers including Stripe webhook `any` usage.
- Updated config/test/component files to keep lint/type checks clean.

7. Feature admin authorization
- Added super-admin guards to feature actions in `src/actions/features.ts`.

8. Permission-gate rollout (initial)
- Added `requireTenantPermission(permissionKey)` in `src/lib/tenant-auth.ts`.
- Applied permissions to high-risk settings mutations:
  - `src/actions/team.ts`
  - `src/actions/roles.ts`
  - `src/actions/permissions.ts`

9. Stripe webhook idempotency
- Added `WebhookEvent` model and migration for deduplicating Stripe retries.
- Added claim/release processing guard in `src/app/api/webhooks/stripe/route.ts`.

10. Runtime server-component event handler fixes
- Removed invalid server-side event handlers in:
  - `src/app/settings/team/page.tsx`
  - `src/app/settings/permissions/page.tsx`
  - `src/app/settings/audit/page.tsx`
  - `src/app/settings/branding/page.tsx`
- Replaced with server-safe form submission behavior.

## What is still pending

### P0 (high priority before production release)
1. Enforce per-action permission checks beyond membership
- Many module actions use `requireTenantMembership()` but do not check granular permissions.
- Apply permission keys consistently for create/update/delete operations in remaining modules (finance, invoices, projects, inventory, HR, automation, builder).

2. Harden permission model with clear read/write semantics
- Review permission seeds and action mappings to ensure every mutation maps to a stable permission key.
- Ensure UI visibility is aligned with backend authorization checks.

### P1 (strongly recommended for production)
1. Replace silent returns with explicit validation errors
- Example: `src/actions/tenants.ts` returns early without user-facing errors for invalid/duplicate input.
- Use `zod` schemas and structured error responses.

2. Tighten security headers/CSP
- Current CSP in `src/proxy.ts` allows `'unsafe-inline'` and `'unsafe-eval'`.
- Move to nonce/hash-based CSP where possible.

3. Implement real test pipeline
- `npm run test` is still a placeholder.
- Wire Vitest execution, add CI gate for test failures.

4. Apply and verify DB migration in all environments
- Ensure `WebhookEvent` migration is deployed before webhook traffic in staging/production.

5. Add rate limiting on sensitive write paths
- Login, tenant creation, billing webhooks, and mutation-heavy endpoints/actions.

### P2 (cleanup and maintainability)
1. Replace file-level `no-img-element` suppressions with `next/image` where practical.
2. Consider DB-level cascading strategy to simplify manual delete ordering.
3. Split oversized pages/components to improve maintainability and testability.

## Immediate next recommended sequence
1. Continue permission-guard rollout across remaining write actions (finance/invoices/projects/inventory/hr).
2. Replace placeholder `test` script with real Vitest execution and add auth/tenant boundary regression tests.
3. Add rate limits and tighten CSP/security headers for production.
4. Convert major server-action inputs to schema validation with explicit user-facing errors.
