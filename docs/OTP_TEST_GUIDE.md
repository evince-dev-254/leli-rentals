# OTP Email Verification Test Guide

## Overview
This guide explains how to test the OTP email verification functionality in your Leli Rentals application.

## How Custom OTP Works

The application uses a custom OTP system that:
- Creates 6-digit verification codes
- Stores codes in user metadata via Supabase Admin API
- Sends emails through Resend email service
- Works with existing users (created during signup)
- Logs OTP codes to console for development testing

## Test Page Access
Navigate to: `http://localhost:3000/test-otp`

## Testing Steps

### 1. Prepare Test User
- First, create a user through the normal signup process at `/signup`
- Complete the signup with email verification
- This ensures the user exists in the system

### 2. Send OTP
- Go to `/test-otp`
- Enter the email address of an existing user
- Click "Send OTP"
- The system will:
  - Find the existing user
  - Generate a 6-digit verification code
  - Store code in user metadata
  - Send the code to the email address
  - Log the code to console (development mode)

### 3. Check Email & Console
- Check your email inbox for the verification code
- The email will come from your configured email service
- Look for subject: "Your Verification Code"
- In development, also check browser console for the OTP code

### 4. Verify OTP
- Enter the 6-digit code from your email
- Click "Verify OTP"
- If successful, you'll see a success message

## Configuration Required

### Email Settings (Resend)
1. Get API key from https://resend.com/api-keys
2. Add to your `.env.local`:
   ```
   RESEND_API_KEY=re_your_resend_api_key
   ```
3. Verify your sending domain in Resend dashboard

### Supabase Settings
1. Ensure you have the correct Supabase keys in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Environment Variables
Ensure these are set in your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Common Issues & Solutions

### Issue: "User not found" error
**Solution**: The test page requires users to exist first. Create a user through the normal signup process.

### Issue: Email not received
**Solutions**:
- Check spam/junk folder
- Verify Resend API key is correct
- Check if using sandbox mode (limited to verified emails)
- Use a real email address you control
- Check browser console for the OTP code (development mode)

### Issue: "Invalid OTP" error
**Solutions**:
- Ensure you're entering the correct 6-digit code
- Check browser console for the code
- Try sending a new OTP
- Verify the code hasn't expired

### Issue: "Error sending confirmation email"
**Solutions**:
- Verify Resend API key is set correctly
- Check if your email domain is verified in Resend
- Ensure you're using a valid email address
- Check Resend dashboard for any account issues

## Testing with Different Email Providers

### Gmail
- Check Promotions tab
- Add sender to contacts to avoid spam filtering

### Outlook/Hotmail
- Check Other/Focused tabs
- Mark as "Not junk" if filtered

### Custom Domain
- Ensure SPF/DKIM records are set up
- Check mail server logs

## Development vs Production

### Development
- OTP codes are logged to console for testing
- Can use test email addresses
- Email sending may be limited by Resend sandbox

### Production
- Full email delivery through Resend
- Requires verified domain in Resend
- Follow email best practices

## Next Steps

1. Test the OTP functionality with existing users
2. Customize email templates in your email service
3. Monitor email delivery rates
4. Ensure proper email authentication for production

## Support

If you encounter issues:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Test with different email providers
4. Check Resend dashboard for delivery status
5. Ensure the user exists before testing OTP

## Important Note
The test page works with existing users. To test OTP functionality:
1. First create a user through the signup process
2. Then use that user's email in the test page
3. The OTP will be sent to their registered email address