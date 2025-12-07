# SQL Script Fixed - Affiliate RLS Policies

## ✅ Issue Resolved

**Error:**
```
ERROR: 42601: syntax error at or near "NOT"
LINE 7: CREATE POLICY IF NOT EXISTS "Users can view their own affiliate data"
```

**Problem:**
PostgreSQL doesn't support `IF NOT EXISTS` clause in `CREATE POLICY` statements.

**Solution:**
Changed the script to:
1. First `DROP POLICY IF EXISTS` for each policy
2. Then `CREATE POLICY` without the `IF NOT EXISTS` clause

---

## Updated SQL Script

**File:** `database/fix_affiliate_rls.sql`

The script now:
1. ✅ Drops existing policies if they exist (safe to run multiple times)
2. ✅ Creates new policies with correct syntax
3. ✅ Enables RLS on both `affiliates` and `affiliate_referrals` tables

---

## How to Run

**In Supabase SQL Editor:**

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `database/fix_affiliate_rls.sql`
4. Click "Run"

**Expected Result:**
```
Success. No rows returned
```

---

## What This Script Does

### Policies Created:

1. **"Users can view their own affiliate data"**
   - Allows users to SELECT their own affiliate records
   - `USING (auth.uid() = user_id)`

2. **"Users can create their own affiliate record"**
   - Allows users to INSERT their own affiliate record
   - `WITH CHECK (auth.uid() = user_id)`

3. **"Users can update their own affiliate data"**
   - Allows users to UPDATE their own affiliate record
   - `USING (auth.uid() = user_id)`

4. **"Affiliates can view their own referrals"**
   - Allows affiliates to SELECT their referrals
   - Checks if the affiliate_id belongs to the current user

---

## Testing After Running

1. **Join Affiliate Program:**
   - Go to `/dashboard/affiliate`
   - Click "Join Affiliate Program"
   - Dashboard should show immediately

2. **Log Out and Back In:**
   - Log out
   - Log back in
   - Go to `/dashboard/affiliate`
   - **Dashboard should show (NO join button)** ✅

3. **Verify Data:**
   - Referral code is visible
   - Stats are displayed
   - No console errors

---

## Safe to Run Multiple Times

The script is **idempotent** - you can run it multiple times safely:
- `DROP POLICY IF EXISTS` won't error if policy doesn't exist
- `CREATE POLICY` will create the policy fresh each time

---

**Status:** ✅ READY TO RUN  
**Updated:** December 7, 2025
