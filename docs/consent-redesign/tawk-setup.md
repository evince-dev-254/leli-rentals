# Tawk.to Chat Widget Setup

I've added the Tawk.to chat widget script to your layout, but you need to replace the placeholder IDs with your actual Tawk.to credentials.

## How to Get Your Tawk.to IDs

1. **Log in** to your [Tawk.to Dashboard](https://dashboard.tawk.to/)
2. Go to **Administration** > **Channels** > **Chat Widget**
3. Click on your property
4. Look for the **Direct Chat Link** or **Widget Code**
5. You'll see a URL like: `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`

## Update the Code

Open `app/layout.tsx` and replace:
- `YOUR_TAWK_PROPERTY_ID` with your actual Property ID
- `YOUR_WIDGET_ID` with your actual Widget ID

Example:
```javascript
s1.src='https://embed.tawk.to/5f8a1b2c3d4e5f6g7h8i9j0k/1abc2def3ghi';
```

## Testing

After updating the IDs, the chat widget should appear in the bottom-right corner of your website.
