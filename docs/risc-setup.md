# Google Cross-Account Protection (RISC) Setup Guide

To complete the configuration for Cross-Account Protection, you must register the webhook endpoint in your Google Cloud Console.

## Prerequisites
- You must be an owner or editor of the Google Cloud Project used for Google OAuth.
- The project must have the **RISC Configuration Admin** role enabled (or be an Owner).

## Step-by-Step Instructions

1.  **Obtain your Webhook URL**:
    - Your production URL will be: `https://www.leli.rentals/api/webhooks/google-risc`

2.  **Enable the RISC API**:
    - Go to the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library).
    - Search for "RISC" or "Security Event" (Note: This is often enabled by default when using Cross-Account Protection features).

3.  **Register the Endpoint**:
    - Google currently requires using their API or a configuration page if available in your project's "Security" tab.
    - Go to **APIs & Services** > **Credentials**.
    - Look for your **OAuth 2.0 Client IDs**.
    - Click on your Web Client ID.
    - Under **Cross-Account Protection** (if visible), enter the Webhook URL:
      `https://www.leli.rentals/api/webhooks/google-risc`

4.  **Verification**:
    - Once registered, Google will send a test event to this endpoint.
    - My code is configured to return the required `202 Accepted` response immediately.

## Why this is required
Google's "Trust and Safety" team requires Cross-Account Protection for apps with many users to ensure that if a user's Google account is flagged for security (e.g., they lose their phone), your app is notified so you can protect their local data.
