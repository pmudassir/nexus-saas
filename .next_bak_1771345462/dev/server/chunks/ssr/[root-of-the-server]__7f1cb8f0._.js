module.exports = [
"[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"009c4e90b78e5e1c98ea315d6b435711342956bc82":"logout","603fa28e54bceeb622257bf9d3e32cf487079f2639":"authenticate"},"",""] */ __turbopack_context__.s([
    "authenticate",
    ()=>authenticate,
    "logout",
    ()=>logout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/node_modules/@auth/core/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function authenticate(prevState, formData) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"])("credentials", formData);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthError"]) {
            switch(error.type){
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
async function logout() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"])();
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    authenticate,
    logout
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(authenticate, "603fa28e54bceeb622257bf9d3e32cf487079f2639", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "009c4e90b78e5e1c98ea315d6b435711342956bc82", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/tenant-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "requireAnyTenantPermission",
    ()=>requireAnyTenantPermission,
    "requireFeatureAccess",
    ()=>requireFeatureAccess,
    "requireTenantMembership",
    ()=>requireTenantMembership,
    "requireTenantPermission",
    ()=>requireTenantPermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tenant.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function requireTenantMembership() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const user = session.user;
    if (!user.id) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const tenant = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentTenant"])("app", user.id);
    if (!tenant) {
        // Check if user has ANY tenant membership
        const anyMembership = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findFirst({
            where: {
                userId: user.id
            }
        });
        if (!anyMembership) {
            if (user.isSuperAdmin) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/onboarding");
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
    }
    const isSuperAdmin = Boolean(user.isSuperAdmin);
    if (!isSuperAdmin) {
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
            where: {
                tenantId_userId: {
                    tenantId: tenant.id,
                    userId: user.id
                }
            }
        });
        if (!membership) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
        }
    }
    return {
        session: session,
        tenant,
        isSuperAdmin
    };
}
async function requireTenantPermission(permissionKey) {
    const context = await requireTenantMembership();
    if (context.isSuperAdmin) {
        return context;
    }
    const user = context.session.user;
    if (!user.id) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const allowed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasPermission"])(user.id, context.tenant.id, permissionKey);
    if (!allowed) {
        throw new Error(`Forbidden: missing permission ${permissionKey}`);
    }
    return context;
}
async function requireFeatureAccess(featureKey) {
    const context = await requireTenantMembership();
    if (context.isSuperAdmin) {
        return context;
    }
    const user = context.session.user;
    if (!user.id) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const [membership, feature] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
            where: {
                tenantId_userId: {
                    tenantId: context.tenant.id,
                    userId: user.id
                }
            },
            include: {
                customRole: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantFeature.findUnique({
            where: {
                tenantId_key: {
                    tenantId: context.tenant.id,
                    key: featureKey
                }
            }
        })
    ]);
    if (!membership) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
    }
    if (!feature?.enabled) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
    }
    if (membership.role === "CUSTOM" && membership.customRole && !membership.customRole.featureKeys.includes(featureKey)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
    }
    return context;
}
async function requireAnyTenantPermission(permissionKeys) {
    const context = await requireTenantMembership();
    if (context.isSuperAdmin) {
        return context;
    }
    const user = context.session.user;
    if (!user.id) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
        where: {
            tenantId_userId: {
                tenantId: context.tenant.id,
                userId: user.id
            }
        }
    });
    if (membership?.role === "TENANT_ADMIN") {
        return context;
    }
    for (const key of permissionKeys){
        const allowed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasPermission"])(user.id, context.tenant.id, key);
        if (allowed) {
            return context;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/email.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMAIL_FROM",
    ()=>EMAIL_FROM,
    "resend",
    ()=>resend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)");
;
if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - email features will not work');
}
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY || 'dummy-key');
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yoursaas.com';
}),
"[project]/src/lib/permission-keys.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PERMISSION_KEYS",
    ()=>PERMISSION_KEYS
]);
const PERMISSION_KEYS = {
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
    PROJECTS_TASK_DELETE: "projects.task.delete"
};
}),
"[project]/src/actions/team.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"406b714b6811fb1c3918a7d670415de3a08f867885":"removeUser","40ea5f04aaf814257853709fa8cecfb6de1d3e216b":"inviteUser"},"",""] */ __turbopack_context__.s([
    "inviteUser",
    ()=>inviteUser,
    "removeUser",
    ()=>removeUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tenant-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permission-keys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
async function inviteUser(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const email = formData.get('email').toLowerCase().trim();
    const name = formData.get('name')?.trim() || '';
    const password = formData.get('password')?.trim() || '';
    const roleRaw = formData.get('role') || 'TENANT_USER';
    // Parse role — could be "TENANT_ADMIN", "TENANT_USER", or "CUSTOM:roleId"
    let role = 'TENANT_USER';
    let customRoleId = null;
    if (roleRaw === 'TENANT_ADMIN') {
        role = 'TENANT_ADMIN';
    } else if (roleRaw.startsWith('CUSTOM:')) {
        role = 'CUSTOM';
        customRoleId = roleRaw.replace('CUSTOM:', '');
        const customRole = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customRole.findFirst({
            where: {
                id: customRoleId,
                tenantId: tenant.id
            },
            select: {
                id: true
            }
        });
        if (!customRole) {
            throw new Error('Invalid custom role for this tenant');
        }
    }
    if (!email) {
        throw new Error('Email is required');
    }
    // Check if user already exists
    let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            email
        }
    });
    // If user doesn't exist create an account
    if (!user) {
        const userPassword = password || Math.random().toString(36).substring(7);
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].hash(userPassword, 10);
        user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role: 'MEMBER'
            }
        });
        // Send invitation email
        try {
            if (process.env.RESEND_API_KEY) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"].emails.send({
                    from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_FROM"],
                    to: email,
                    subject: `Invitation to join ${tenant.name} on Nexus SaaS`,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>You've been invited!</h2>
              <p>Hello ${name || 'there'},</p>
              <p>You have been invited to join the workspace <strong>${tenant.name}</strong> on Nexus SaaS.</p>
              ${!password ? `<p>Your temporary password is:</p>
              <div style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; display: inline-block;">
                ${userPassword}
              </div>
              <p>Please log in and change your password immediately.</p>` : '<p>You can log in with the password provided by your administrator.</p>'}
              <a href="${process.env.NEXTAUTH_URL}/auth/signin" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Log In to Nexus
              </a>
            </div>
          `
                });
            }
        } catch (error) {
            console.error('Failed to send invitation email:', error);
        }
        if (("TURBOPACK compile-time value", "development") === 'development' && !password) {
            console.log(`Temporary password for ${email}: ${userPassword}`);
        }
    }
    // Check if already a member
    const existingMembership = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
        where: {
            tenantId_userId: {
                tenantId: tenant.id,
                userId: user.id
            }
        }
    });
    if (existingMembership) {
        throw new Error('User is already a member of this tenant');
    }
    // Add user to tenant with role
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.create({
        data: {
            tenantId: tenant.id,
            userId: user.id,
            role,
            customRoleId
        }
    });
    // Log the action
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
        data: {
            tenantId: tenant.id,
            action: 'USER_INVITED',
            entity: 'TenantUser',
            entityId: user.id,
            metadata: {
                email,
                role
            }
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/team');
}
async function removeUser(formData) {
    const { tenant, session } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const tenantUserId = formData.get('tenantUserId');
    if (!tenantUserId) {
        throw new Error('Tenant user ID is required');
    }
    // Get the tenant user
    const tenantUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
        where: {
            id: tenantUserId
        },
        include: {
            user: true
        }
    });
    if (!tenantUser || tenantUser.tenantId !== tenant.id) {
        throw new Error('Unauthorized');
    }
    // Prevent self-removal
    const currentUserId = session.user.id;
    if (tenantUser.userId === currentUserId) {
        throw new Error('Cannot remove yourself from the tenant');
    }
    // Delete the tenant user
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.delete({
        where: {
            id: tenantUserId
        }
    });
    // Log the action
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
        data: {
            tenantId: tenant.id,
            action: 'USER_REMOVED',
            entity: 'TenantUser',
            entityId: tenantUser.userId,
            metadata: {
                email: tenantUser.user.email
            }
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/team');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    inviteUser,
    removeUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(inviteUser, "40ea5f04aaf814257853709fa8cecfb6de1d3e216b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeUser, "406b714b6811fb1c3918a7d670415de3a08f867885", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/actions/roles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"4023c8ca00d9c01fae8a909a39b43a88e98062a09d":"createRole","40415a877977fef04af472979460c514ca8dde1984":"updateRole","404f853658d2b4d42eabb5eabfd786c45bb39e20f6":"assignRole","408c85a6b49293a9ac5a4c0f3b61f0bb414f191be0":"deleteRole"},"",""] */ __turbopack_context__.s([
    "assignRole",
    ()=>assignRole,
    "createRole",
    ()=>createRole,
    "deleteRole",
    ()=>deleteRole,
    "updateRole",
    ()=>updateRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tenant-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permission-keys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function parseCsv(raw) {
    return raw ? Array.from(new Set(raw.split(',').map((k)=>k.trim()).filter(Boolean))) : [];
}
async function createRole(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const name = formData.get('name')?.trim();
    const featureKeys = parseCsv(formData.get('featureKeys') || null);
    const permissions = parseCsv(formData.get('permissions') || null);
    if (!name) return;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customRole.create({
        data: {
            tenantId: tenant.id,
            name,
            featureKeys,
            permissions
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/roles');
}
async function updateRole(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const roleId = formData.get('roleId');
    const name = formData.get('name')?.trim();
    const featureKeys = parseCsv(formData.get('featureKeys') || null);
    const permissions = parseCsv(formData.get('permissions') || null);
    if (!roleId || !name) return;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customRole.update({
        where: {
            id: roleId,
            tenantId: tenant.id
        },
        data: {
            name,
            featureKeys,
            permissions
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/roles');
}
async function deleteRole(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const roleId = formData.get('roleId');
    if (!roleId) return;
    // Unassign all members from this role first
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.updateMany({
        where: {
            customRoleId: roleId,
            tenantId: tenant.id
        },
        data: {
            customRoleId: null,
            role: 'TENANT_USER'
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customRole.delete({
        where: {
            id: roleId,
            tenantId: tenant.id
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/roles');
}
async function assignRole(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantPermission"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permission$2d$keys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PERMISSION_KEYS"].SETTINGS_USERS_MANAGE);
    const tenantUserId = formData.get('tenantUserId');
    const customRoleId = formData.get('customRoleId');
    if (!tenantUserId) return;
    if (customRoleId) {
        const customRole = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customRole.findFirst({
            where: {
                id: customRoleId,
                tenantId: tenant.id
            },
            select: {
                id: true
            }
        });
        if (!customRole) {
            throw new Error('Invalid custom role for this tenant');
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.update({
            where: {
                id: tenantUserId,
                tenantId: tenant.id
            },
            data: {
                customRoleId,
                role: 'CUSTOM'
            }
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.update({
            where: {
                id: tenantUserId,
                tenantId: tenant.id
            },
            data: {
                customRoleId: null,
                role: 'TENANT_USER'
            }
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/team');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/settings/roles');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createRole,
    updateRole,
    deleteRole,
    assignRole
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createRole, "4023c8ca00d9c01fae8a909a39b43a88e98062a09d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateRole, "40415a877977fef04af472979460c514ca8dde1984", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRole, "408c85a6b49293a9ac5a4c0f3b61f0bb414f191be0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(assignRole, "404f853658d2b4d42eabb5eabfd786c45bb39e20f6", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/settings/team/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/team.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/roles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/team.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/roles.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/settings/team/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/team.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/roles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "009c4e90b78e5e1c98ea315d6b435711342956bc82",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "4023c8ca00d9c01fae8a909a39b43a88e98062a09d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRole"],
    "40415a877977fef04af472979460c514ca8dde1984",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRole"],
    "404f853658d2b4d42eabb5eabfd786c45bb39e20f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assignRole"],
    "406b714b6811fb1c3918a7d670415de3a08f867885",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeUser"],
    "408c85a6b49293a9ac5a4c0f3b61f0bb414f191be0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRole"],
    "40ea5f04aaf814257853709fa8cecfb6de1d3e216b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inviteUser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$settings$2f$team$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/settings/team/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/team.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/actions/roles.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/team.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/roles.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$settings$2f$team$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$settings$2f$team$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$team$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f1cb8f0._.js.map