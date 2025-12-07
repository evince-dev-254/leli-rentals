# Supabase Email Templates for Passwordless Auth

Since you are using Supabase Magic Links and OTP, you need to configure the email templates in your Supabase Dashboard.

Go to: **Authentication -> Configuration -> Email Templates**

## 1. Magic Link Template

Use this template for the "Magic Link" login flow.

**Subject:** Log in to Leli Rentals

**Body:**
```html
<h2>Log in to Leli Rentals</h2>

<p>Hello,</p>

<p>Follow this link to log in to your account:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    <strong>Log In Now</strong>
  </a>
</p>

<p>If you didn't request this, you can ignore this email.</p>

<p>Thanks,<br/>The Leli Rentals Team</p>
```

## 2. Verification Code (OTP) Template

Since Supabase uses the *same* template for OTP logic by default (unless you use the specific "Confirm Your Email" template for signup, but `signInWithOtp` often uses Magic Link template), you might need to adjust it to show the Token *OR* the Link.

However, Supabase allows you to switch to "Send OTP" mode which uses a code. If you are using the OTP flow, ensure your template includes `{{ .Token }}`.

**Recommended Universal Template (Supports both Link and Code):**

**Subject:** Your Login Code for Leli Rentals

**Body:**
```html
<h2>Welcome back to Leli Rentals</h2>

<p>Your login code is:</p>
<h1>{{ .Token }}</h1>

<p>Or click this link to log in directly:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    Log In Automatically
  </a>
</p>

<p>This code expires in 1 hour.</p>
```

***Note:** Ensure your "Site URL" in Supabase -> Authentication -> URL Configuration is set to your production URL (or `http://localhost:3000` for dev).*
