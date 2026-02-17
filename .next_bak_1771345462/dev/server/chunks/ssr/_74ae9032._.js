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
"[project]/src/lib/features.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DEFAULT_FEATURE_CONFIG",
    ()=>DEFAULT_FEATURE_CONFIG,
    "FEATURES",
    ()=>FEATURES,
    "getFeatureConfig",
    ()=>getFeatureConfig,
    "getUserPermissions",
    ()=>getUserPermissions,
    "hasPermission",
    ()=>hasPermission,
    "initializeTenantFeatures",
    ()=>initializeTenantFeatures,
    "isFeatureEnabled",
    ()=>isFeatureEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const FEATURES = {
    WEBSITE_BUILDER: 'website_builder',
    FINANCE: 'finance',
    HR: 'hr',
    INVENTORY: 'inventory',
    CRM: 'crm',
    ANALYTICS: 'analytics',
    PROJECTS: 'projects',
    AUTOMATION: 'automation'
};
const DEFAULT_FEATURE_CONFIG = {
    [FEATURES.WEBSITE_BUILDER]: {
        maxPages: 50,
        maxBlocksPerPage: 100,
        customDomain: false
    },
    [FEATURES.FINANCE]: {
        maxInvoices: 1000,
        multiCurrency: false
    },
    [FEATURES.HR]: {
        maxEmployees: 100
    },
    [FEATURES.INVENTORY]: {
        maxProducts: 1000
    },
    [FEATURES.CRM]: {
        maxContacts: 5000
    },
    [FEATURES.ANALYTICS]: {
        advancedReports: false
    },
    [FEATURES.PROJECTS]: {
        maxProjects: 50
    },
    [FEATURES.AUTOMATION]: {
        maxAutomations: 20
    }
};
async function getFeatureConfig(tenantId, featureKey) {
    const feature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantFeature.findUnique({
        where: {
            tenantId_key: {
                tenantId,
                key: featureKey
            }
        }
    });
    if (!feature) {
        return null;
    }
    return {
        enabled: feature.enabled,
        config: feature.config || DEFAULT_FEATURE_CONFIG[featureKey] || {},
        metadata: feature.metadata || {}
    };
}
async function isFeatureEnabled(tenantId, featureKey) {
    const feature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantFeature.findUnique({
        where: {
            tenantId_key: {
                tenantId,
                key: featureKey
            }
        }
    });
    return feature?.enabled ?? false;
}
async function hasPermission(userId, tenantId, permissionKey) {
    // Get the tenant user record
    const tenantUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
        where: {
            tenantId_userId: {
                tenantId,
                userId
            }
        },
        include: {
            customRole: true,
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });
    if (!tenantUser) {
        return false;
    }
    // Tenant admins have all permissions
    if (tenantUser.role === 'TENANT_ADMIN') {
        return true;
    }
    if (tenantUser.role === 'CUSTOM' && tenantUser.customRole && tenantUser.customRole.permissions.includes(permissionKey)) {
        return true;
    }
    // Check if user has the specific permission
    const hasPermissionGrant = tenantUser.permissions.some((rp)=>rp.permission.key === permissionKey && rp.granted);
    return hasPermissionGrant;
}
async function getUserPermissions(userId, tenantId) {
    const tenantUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantUser.findUnique({
        where: {
            tenantId_userId: {
                tenantId,
                userId
            }
        },
        include: {
            customRole: true,
            permissions: {
                where: {
                    granted: true
                },
                include: {
                    permission: true
                }
            }
        }
    });
    if (!tenantUser) {
        return [];
    }
    // Tenant admins get all permissions
    if (tenantUser.role === 'TENANT_ADMIN') {
        const allPermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].permission.findMany();
        return allPermissions.map((p)=>p.key);
    }
    const directPermissions = tenantUser.permissions.map((rp)=>rp.permission.key);
    const rolePermissions = tenantUser.role === 'CUSTOM' && tenantUser.customRole ? tenantUser.customRole.permissions : [];
    return Array.from(new Set([
        ...directPermissions,
        ...rolePermissions
    ]));
}
async function initializeTenantFeatures(tenantId, enabledFeatures = Object.values(FEATURES)) {
    const features = Object.values(FEATURES).map((key)=>({
            tenantId,
            key,
            enabled: enabledFeatures.includes(key),
            config: DEFAULT_FEATURE_CONFIG[key] || {}
        }));
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenantFeature.createMany({
        data: features,
        skipDuplicates: true
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/tenant-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/actions/leads.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"40080f897cc0cb0e22ff6253f9e07e2f94d2550472":"deleteLead","406c98ca37f035c04a71b03718e85fdf5f28c34c68":"createLead","408b983df6aae5ac1743b97cf240d979b3b0ba329a":"updateLeadScore","409bc520a0b83c3e0591fd25c669ffdb184afc9460":"completeActivity","409ebc2daefe51e3ebc773f0afc90d9b8483c4cfb5":"scheduleFollowUp","40be1da8d056492dd198caa15baf997f67db8a80d7":"addLeadActivity","40d2e4db2a8d2a39b18d2bf57b8060ef99110ac2f7":"updateLeadStage"},"",""] */ __turbopack_context__.s([
    "addLeadActivity",
    ()=>addLeadActivity,
    "completeActivity",
    ()=>completeActivity,
    "createLead",
    ()=>createLead,
    "deleteLead",
    ()=>deleteLead,
    "scheduleFollowUp",
    ()=>scheduleFollowUp,
    "updateLeadScore",
    ()=>updateLeadScore,
    "updateLeadStage",
    ()=>updateLeadStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tenant-auth.ts [app-rsc] (ecmascript)");
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
async function createLead(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantMembership"])();
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lead.create({
        data: {
            name: formData.get('name'),
            email: formData.get('email') || null,
            phone: formData.get('phone') || null,
            company: formData.get('company') || null,
            source: formData.get('source') || null,
            value: formData.get('value') ? parseFloat(formData.get('value')) : null,
            tenantId: tenant.id
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
}
async function updateLeadStage(formData) {
    const leadId = formData.get('leadId');
    const stage = formData.get('stage');
    const updateData = {
        stage
    };
    if (stage === 'WON') {
        updateData.wonDate = new Date();
    } else if (stage === 'LOST') {
        updateData.lostReason = formData.get('lostReason');
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lead.update({
        where: {
            id: leadId
        },
        data: updateData
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/crm/leads/${leadId}`);
}
async function updateLeadScore(formData) {
    const leadId = formData.get('leadId');
    const score = parseInt(formData.get('score'));
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lead.update({
        where: {
            id: leadId
        },
        data: {
            score: Math.min(100, Math.max(0, score))
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/crm/leads/${leadId}`);
}
async function addLeadActivity(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantMembership"])();
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].leadActivity.create({
        data: {
            leadId: formData.get('leadId'),
            type: formData.get('type'),
            subject: formData.get('subject'),
            description: formData.get('description') || null,
            tenantId: tenant.id
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/crm/leads/${formData.get('leadId')}`);
}
async function scheduleFollowUp(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantMembership"])();
    const leadId = formData.get('leadId');
    const type = formData.get('type');
    const subject = formData.get('subject');
    const description = formData.get('description') || null;
    const dueDateStr = formData.get('dueDate');
    if (!leadId || !type || !subject || !dueDateStr) {
        throw new Error('Lead, type, subject, and due date are required');
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].leadActivity.create({
        data: {
            leadId,
            type,
            subject,
            description,
            dueDate: new Date(dueDateStr),
            completed: false,
            tenantId: tenant.id
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
        data: {
            tenantId: tenant.id,
            action: 'FOLLOW_UP_SCHEDULED',
            entity: 'LeadActivity',
            metadata: {
                leadId,
                type,
                subject,
                dueDate: dueDateStr
            }
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/crm/leads/${leadId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/today');
}
async function completeActivity(formData) {
    const activityId = formData.get('activityId');
    if (!activityId) {
        throw new Error('Activity ID is required');
    }
    const activity = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].leadActivity.update({
        where: {
            id: activityId
        },
        data: {
            completed: true
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/crm/leads/${activity.leadId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/today');
}
async function deleteLead(formData) {
    const { tenant } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tenant$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireTenantMembership"])();
    const leadId = formData.get('leadId');
    if (!leadId) {
        throw new Error('Lead ID is required');
    }
    // Delete activities first (cascade)
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].leadActivity.deleteMany({
        where: {
            leadId
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lead.delete({
        where: {
            id: leadId
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
        data: {
            tenantId: tenant.id,
            action: 'LEAD_DELETED',
            entity: 'Lead',
            entityId: leadId
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/crm/leads');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createLead,
    updateLeadStage,
    updateLeadScore,
    addLeadActivity,
    scheduleFollowUp,
    completeActivity,
    deleteLead
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createLead, "406c98ca37f035c04a71b03718e85fdf5f28c34c68", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateLeadStage, "40d2e4db2a8d2a39b18d2bf57b8060ef99110ac2f7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateLeadScore, "408b983df6aae5ac1743b97cf240d979b3b0ba329a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addLeadActivity, "40be1da8d056492dd198caa15baf997f67db8a80d7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(scheduleFollowUp, "409ebc2daefe51e3ebc773f0afc90d9b8483c4cfb5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(completeActivity, "409bc520a0b83c3e0591fd25c669ffdb184afc9460", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteLead, "40080f897cc0cb0e22ff6253f9e07e2f94d2550472", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/crm/today/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/leads.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/leads.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
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
"[project]/.next-internal/server/app/crm/today/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/leads.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "009c4e90b78e5e1c98ea315d6b435711342956bc82",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "40080f897cc0cb0e22ff6253f9e07e2f94d2550472",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteLead"],
    "406c98ca37f035c04a71b03718e85fdf5f28c34c68",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLead"],
    "408b983df6aae5ac1743b97cf240d979b3b0ba329a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLeadScore"],
    "409bc520a0b83c3e0591fd25c669ffdb184afc9460",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["completeActivity"],
    "409ebc2daefe51e3ebc773f0afc90d9b8483c4cfb5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scheduleFollowUp"],
    "40be1da8d056492dd198caa15baf997f67db8a80d7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addLeadActivity"],
    "40d2e4db2a8d2a39b18d2bf57b8060ef99110ac2f7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLeadStage"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$crm$2f$today$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/crm/today/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/leads.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/leads.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$crm$2f$today$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$crm$2f$today$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_74ae9032._.js.map