module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript)"));
}),
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
    return tenantUser.permissions.map((rp)=>rp.permission.key);
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
"[project]/src/app/admin/features/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>FeaturesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Shell.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/features.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const FEATURE_LABELS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].WEBSITE_BUILDER]: 'Website Builder',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].FINANCE]: 'Finance',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].HR]: 'HR & Employee',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].INVENTORY]: 'Inventory',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].CRM]: 'CRM & Sales',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].ANALYTICS]: 'Analytics',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].PROJECTS]: 'Projects',
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"].AUTOMATION]: 'Automation'
};
async function FeaturesPage() {
    const tenantsRaw = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenant.findMany({
        include: {
            features: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const tenants = tenantsRaw;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Shell"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold tracking-tight text-foreground",
                            children: "Feature Management"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/features/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Control which features are enabled for each tenant."
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/features/page.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/features/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-md border border-border bg-white shadow-sm overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-muted text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 sticky left-0 bg-muted border-r border-border",
                                                children: "Tenant"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                lineNumber: 49,
                                                columnNumber: 19
                                            }, this),
                                            Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"]).map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-center",
                                                    children: FEATURE_LABELS[feature]
                                                }, feature, false, {
                                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                                    lineNumber: 53,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                        lineNumber: 48,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-border bg-white text-foreground",
                                    children: [
                                        tenants.map((tenant)=>{
                                            const featureMap = new Map(tenant.features.map((f)=>[
                                                    f.key,
                                                    f
                                                ]));
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-muted/50 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 font-medium sticky left-0 bg-white border-r border-border group-hover:bg-muted/50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-foreground",
                                                                    children: tenant.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                                                    lineNumber: 72,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-muted-foreground font-mono",
                                                                    children: tenant.slug
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                                                    lineNumber: 73,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/features/page.tsx",
                                                            lineNumber: 71,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 23
                                                    }, this),
                                                    Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"]).map((featureKey)=>{
                                                        const feature = featureMap.get(featureKey);
                                                        const isEnabled = feature?.enabled ?? false;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4 text-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                                action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleFeature"],
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "hidden",
                                                                        name: "tenantId",
                                                                        value: tenant.id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                                                        lineNumber: 85,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "hidden",
                                                                        name: "featureKey",
                                                                        value: featureKey
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                                                        lineNumber: 90,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "hidden",
                                                                        name: "enabled",
                                                                        value: String(isEnabled)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                                                        lineNumber: 95,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "submit",
                                                                        className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${isEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`,
                                                                        role: "switch",
                                                                        "aria-checked": isEnabled,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "sr-only",
                                                                                children: "Toggle feature"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                                                lineNumber: 108,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                                                lineNumber: 109,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/admin/features/page.tsx",
                                                                        lineNumber: 100,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                                lineNumber: 84,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, featureKey, false, {
                                                            fileName: "[project]/src/app/admin/features/page.tsx",
                                                            lineNumber: 83,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                ]
                                            }, tenant.id, true, {
                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                lineNumber: 66,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        tenants.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FEATURES"]).length + 1,
                                                className: "px-6 py-10 text-center text-muted-foreground text-sm",
                                                children: "No tenants found."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/features/page.tsx",
                                                lineNumber: 125,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/features/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/features/page.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/features/page.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/features/page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-md border border-border bg-white p-6 shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-foreground mb-2",
                            children: "Feature Definitions"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/features/page.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 md:grid-cols-2 lg:grid-cols-4",
                            children: Object.entries(FEATURE_LABELS).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-muted border border-border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-medium text-foreground",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/features/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-muted-foreground font-mono mt-1",
                                            children: key
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/features/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, key, true, {
                                    fileName: "[project]/src/app/admin/features/page.tsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/features/page.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/features/page.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/features/page.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/features/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/admin/features/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/features/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bbfc2f23._.js.map