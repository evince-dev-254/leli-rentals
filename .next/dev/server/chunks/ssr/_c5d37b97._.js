module.exports = [
"[project]/lib/supabase-admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-rsc] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://tdtjevpnqrwqcjnuywrn.supabase.co");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
}),
"[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00ffb2132d27b65ae9cb4c4d7869d5d76be031738f":"getAllAffiliates","60c59f7d5c7b1862236c427066c155477e51ed8e39":"joinAffiliateProgram"},"",""] */ __turbopack_context__.s([
    "getAllAffiliates",
    ()=>getAllAffiliates,
    "joinAffiliateProgram",
    ()=>joinAffiliateProgram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase-admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getAllAffiliates() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('affiliates').select(`
            *,
            user_profiles:user_id (
                full_name,
                email,
                avatar_url,
                account_status
            )
        `).order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching all affiliates:', error);
        return [];
    }
    return data;
}
async function joinAffiliateProgram(userId, email) {
    // 1. Check if affiliate already exists for this user or email
    const { data: existingAffiliate, error: findError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('affiliates').select('*').or(`user_id.eq.${userId},email.eq.${email}`).single();
    if (existingAffiliate) {
        // Already exists, just ensure role is updated and return success
        // Update user role to affiliate if not already
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('user_profiles').update({
            role: 'affiliate'
        }).eq('id', userId);
        return {
            success: true,
            data: existingAffiliate
        };
    }
    // Generate codes
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const referralCode = `REF-${inviteCode}`;
    // Create affiliate record using Admin client to bypass RLS
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('affiliates').insert({
        user_id: userId,
        email: email,
        invite_code: inviteCode,
        referral_code: referralCode,
        status: 'active',
        commission_rate: 10.00
    }).select().single();
    if (error) {
        console.error('Error joining affiliate program:', error);
        return {
            success: false,
            error: error.message
        };
    }
    // Ensure user role is affiliate
    const { error: roleError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('user_profiles').update({
        role: 'affiliate'
    }).eq('id', userId);
    if (roleError) {
        console.error('Error updating role:', roleError);
    }
    return {
        success: true,
        data
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAllAffiliates,
    joinAffiliateProgram
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllAffiliates, "00ffb2132d27b65ae9cb4c4d7869d5d76be031738f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(joinAffiliateProgram, "60c59f7d5c7b1862236c427066c155477e51ed8e39", null);
}),
"[project]/.next-internal/server/app/admin/affiliates/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$affiliate$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/admin/affiliates/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00ffb2132d27b65ae9cb4c4d7869d5d76be031738f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$affiliate$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllAffiliates"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$affiliates$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$affiliate$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/affiliates/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$affiliate$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/affiliate-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_c5d37b97._.js.map