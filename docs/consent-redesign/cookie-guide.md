# Guide: Adding Cookies to CookieYes

Since your scan didn't automatically pick up all cookies, you can manually add them to ensure they are blocked correctly until the user gives consent.

## 1. How to Add a Cookie Manually
1.  Go to your **CookieYes Dashboard**.
2.  Navigate to **Cookie List**.
3.  Choose a category (e.g., **Analytics**).
4.  Click **+ Add Cookie**.
5.  Fill in the details for each cookie (see common ones below).
6.  Click **Submit**.

---

## 2. Common Cookies to Add

### 📊 Analytics Category
If you are using **Google Analytics**, add these:

| Cookie Name | Provider | Purpose | Expiry |
| :--- | :--- | :--- | :--- |
| `_ga` | Google | Used to distinguish users | 2 years |
| `_gid` | Google | Used to distinguish users | 24 hours |
| `_gat` | Google | Used to throttle request rate | 1 minute |

### 🛠️ Functional Category
If you are using **Tawk.to** for chat, add these:

| Cookie Name | Provider | Purpose | Expiry |
| :--- | :--- | :--- | :--- |
| `twk_*` | tawk.to | Stores and tracks site visits | Session |
| `TawkConnectionTime` | tawk.to | Used to identify the user session | Session |

### 💳 Necessary Category
These are usually essential and allowed by default:

| Cookie Name | Provider | Purpose | Expiry |
| :--- | :--- | :--- | :--- |
| `cky-consent` | CookieYes | Stores the user's consent preferences | 1 year |
| `sb-access-token` | Supabase | Authentication session | Session |
| `sb-refresh-token` | Supabase | Session renewal | Session |

---

## 3. Pro Tip: Re-Scan
If you recently added the scripts (like Google Analytics) to your code, try clicking **Re-scan** in the CookieYes dashboard. It might pick them up automatically now that they are live.
