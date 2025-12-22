# Google Cross-Account Protection (RISC) Setup Guide

To complete the configuration for Cross-Account Protection, you must register the webhook endpoint. Since there is no direct UI for this in the Google Cloud Console, I have created a script to automate it for you.

## Setup Steps

### 1. Enable RISC API
- Go to the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library).
- Search for **"RISC"** or **"Security Event"**.
- Click **Enable**.

### 2. Create a Service Account
- Go to **IAM & Admin** > **Service Accounts**.
- Click **Create Service Account**.
- Name it `risc-manager`.
- For the role, select **Project** > **Owner** (or **RISC Configuration Admin** if you prefer more restricted access).
- Click **Done**.

### 3. Generate a JSON Key
- Find your new `risc-manager` service account in the list.
- Click the three dots (Actions) > **Manage keys**.
- Click **Add Key** > **Create new key**.
- Select **JSON** and click **Create**.
- Save the file on your computer (e.g., as `google-key.json`).

### 4. Run the Registration Script
Open your terminal in the project folder and run:

```bash
node scripts/register-risc.js C:\path\to\your\google-key.json
```

*(Replace the path with the actual location of the JSON file you just downloaded.)*

## Success
Once the script says `✅ SUCCESS`, your project is fully configured. Google will now notify your app of any critical security events.

---
**Privacy Note**: You can delete the `google-key.json` and the service account once the registration is complete.
