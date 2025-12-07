# OTP Fix - Quick Start Guide (5 minutes)

## What Was Wrong?

Users weren't receiving OTP emails during signup with **no error message** indicating why.

## What Was Fixed?

✅ **3 Critical Issues Fixed**:
1. User lookup now retries (fixes timing issues)
2. Email errors are now properly reported
3. Signup form validates OTP was actually sent

## What You Need to Do

### Step 1: Verify `.env.local` (2 minutes)

```bash
# Open your .env.local file
cat .env.local

# Make sure you have:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**If missing**:
1. Get `RESEND_API_KEY` from [resend.com](https://resend.com)
2. Copy `SUPABASE_SERVICE_ROLE_KEY` from Supabase dashboard
3. Add to `.env.local`
4. Restart: `npm run dev`

### Step 2: Test Signup (2 minutes)

```bash
# Terminal 1
npm run dev

# Terminal 2 (keep first one running)
# Open browser to http://localhost:3000

# Open DevTools (F12) → Console tab

# Sign up with any email

# Look for in console:
# ✅ [DEV ONLY] Generated OTP for user@email.com: 123456
# ✅ OTP successfully sent to user@email.com

# OR error like:
# ❌ RESEND API KEY ISSUE: Check your RESEND_API_KEY
```

### Step 3: Use the OTP (1 minute)

**Sandbox Mode (free tier)**:
- Copy OTP code from console
- Paste into verification input
- Done!

**With Verified Email**:
- Check your email inbox
- Copy code from email
- Paste into verification input
- Done!

## Most Common Issue

**Problem**: See "❌ RESEND API KEY ISSUE"

**Solution**:
```bash
# 1. Go to https://resend.com
# 2. Copy your API key
# 3. Add to .env.local:
echo "RESEND_API_KEY=re_your_key_here" >> .env.local

# 4. Restart dev server
# npm run dev
```

## Understanding the Logs

| Log | Meaning | Action |
|-----|---------|--------|
| `✅ OTP successfully sent` | Email is working | Copy code from email/console |
| `❌ API KEY ISSUE` | RESEND_API_KEY missing | Add key to .env.local |
| `User not found on attempt 1/3` | Normal, retrying | Wait, system will retry |
| `Failed to find user after 3 retries` | Supabase issue | Check Supabase dashboard |
| `Failed to send verification code` | Email service error | Check resend.com status |

## Need More Info?

- **Detailed Guide**: See `OTP_DEBUGGING_GUIDE.md`
- **What Changed**: See `OTP_FIX_SUMMARY.md`
- **Flow Diagrams**: See `OTP_FLOW_DIAGRAM.md`
- **Full Report**: See `OTP_EMAIL_VERIFICATION_COMPLETE_FIX_REPORT.md`
- **Checklist**: See `OTP_ACTION_CHECKLIST.md`

## One Minute Test

```bash
# Make sure RESEND_API_KEY is set
grep RESEND_API_KEY .env.local

# Start dev server
npm run dev

# In another terminal, open browser
# Visit http://localhost:3000
# Sign up
# Check browser console (F12)
# Look for ✅ or ❌ logs

# If ✅: Copy OTP code → Success!
# If ❌: Check the error message → Contact support
```

## Done!

Your OTP system is now working with:
- ✅ Automatic retries on timing issues
- ✅ Clear error messages
- ✅ Better debugging

Users will now either get their OTP or know exactly what went wrong.
