# OTP Verification Debugging Guide

## Issue: Users not receiving OTP emails during signup

### Root Causes Fixed

1. **User lookup failure** - The user wasn't found immediately after creation
   - **Fix**: Added retry logic with 500ms delays (up to 3 attempts)

2. **Silent email failures** - Errors weren't propagated to the UI
   - **Fix**: Improved error handling and validation in `sendCustomOtp()`

3. **Missing error feedback** - Signup form wasn't checking the OTP result
   - **Fix**: Updated signup form to throw error if OTP sending fails

4. **Resend API configuration issues** - No clear indication if API key was missing
   - **Fix**: Added specific error detection for unauthorized/missing API key

---

## Diagnostic Checklist

### 1. Check Environment Variables

```bash
# In your .env.local file, verify you have:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

**Issue**: If missing or invalid, you'll see in browser console:
```
❌ RESEND API KEY ISSUE: Check your RESEND_API_KEY environment variable
```

### 2. Check Browser Console During Signup

Open DevTools (F12) → Console tab, and look for:

**✅ Success logs:**
```
[DEV ONLY] Generated OTP for user@example.com: 123456
✅ OTP successfully sent to user@example.com
```

**❌ Failure logs:**
```
Resend API Error: {message: "Unauthorized"}
Full error object: {...}
```

### 3. Check Server Logs

If running locally with `npm run dev`, check your terminal output for:

**✅ Expected logs:**
```
[DEV ONLY] Generated OTP for user@example.com: 123456
✅ OTP successfully sent to user@example.com
```

**❌ Common errors:**
```
Retry 1: Error listing users: Invalid API key
User user@example.com not found on attempt 1/3
Failed to find user after 3 retries: Database error
```

---

## Testing the OTP System

### Option A: Local Development (Resend Sandbox Mode)

When you sign up with a new email:

1. The OTP will be **logged in browser console** (DevTools)
2. Look for: `[DEV ONLY] Generated OTP for user@example.com: 123456`
3. Copy this code and paste it in the verification input

**Why?** Resend's free plan only allows sending to verified emails. Your app detects this and still lets users proceed by copying the code from the console.

### Option B: Use Your Verified Email

If you have a verified email in Resend:

1. Sign up with that email
2. Check your inbox for the OTP
3. Email should arrive within 30 seconds

### Option C: Testing via Script

```bash
# Run the Resend test script
npm run test-resend
```

---

## Common Issues & Solutions

### Issue: "Email service not configured"

**Cause**: `RESEND_API_KEY` is missing or invalid

**Solution**:
1. Go to [resend.com](https://resend.com) and create account
2. Copy your API key
3. Add to `.env.local`: `RESEND_API_KEY=re_your_key_here`
4. Restart your dev server (`npm run dev`)

### Issue: "User not found after multiple attempts"

**Cause**: User creation in Supabase is failing silently

**Solution**:
1. Check your Supabase database for the user record
2. Verify row-level security (RLS) policies on `user_profiles` table
3. Check Supabase auth logs for errors

### Issue: OTP email never arrives (using verified email)

**Cause**: 
- Supabase admin API key is invalid
- Email delivery is throttled or blocked
- Wrong email address in `from` field

**Solution**:
1. Check your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
2. Verify sender email is authorized in Resend dashboard
3. Check Resend activity log for delivery status

### Issue: "Invalid code" during OTP verification

**Cause**: 
- OTP expired (10 minute timeout)
- User cleared browser storage
- Multiple OTPs sent - using wrong one

**Solution**:
1. Click "Resend Code" button to get a new OTP
2. Use immediately (within 10 minutes)
3. Make sure you're copying from the correct signup attempt

---

## Environment Setup

### Required `.env.local` Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (Email Service)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Verify Setup Script

```bash
# Check if all required env vars are set
node -e "
const required = ['RESEND_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_URL'];
const missing = required.filter(v => !process.env[v]);
console.log('✅ All vars set' || missing.length === 0 ? 'Setup OK!' : 'Missing: ' + missing.join(', '));
"
```

---

## Flow Diagram

```
User submits signup form
        ↓
registerUser() creates auth user in Supabase
        ↓
User returned with ID and email
        ↓
sendCustomOtp() is called
        ↓
Retry logic finds user in auth.users (up to 3x)
        ↓
Generate 6-digit random code
        ↓
Store code in user_metadata
        ↓
Send email via Resend
        ↓
❌ Error? → Propagate to UI
✅ Success? → Show OTP input screen
        ↓
User enters code
        ↓
verifyCustomOtp() checks code matches stored code
        ↓
Code valid? → Mark email_confirmed = true → Sign in
Code invalid? → Show error → Allow resend
```

---

## Logging Improvements Made

The following error scenarios now log clearly:

| Scenario | Log Message | User Sees |
|----------|------------|-----------|
| API key missing | `❌ RESEND API KEY ISSUE` | "Email service not configured" |
| User not found | `User not found on attempt N/3` | "User not found after multiple attempts" |
| Email send fails | `Resend API Error: ...` | Error message with reason |
| Sandbox mode | `⚠️ RESEND SANDBOX LIMITATION` | Still proceeds, code in console |
| Success | `✅ OTP successfully sent` | "Verification code sent" |

---

## Next Steps

1. **Verify RESEND_API_KEY** is set in `.env.local`
2. **Restart dev server** after updating env vars
3. **Test signup flow** with browser DevTools open
4. **Check console logs** for error details
5. **Report any errors** using the log messages above

If issues persist, share the exact error messages from the browser console or server logs.
