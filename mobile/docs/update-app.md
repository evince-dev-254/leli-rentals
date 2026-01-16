# How to Update Your App (Over-the-Air)

To push updates to your installed app without requiring a new store submission, you can use **EAS Update**.

## Prerequisites
- You must have the EAS CLI installed: `npm install -g eas-cli`
- You must be logged in to your Expo account: `eas login`

## Steps to Push an Update

1. **Make your changes** in the codebase.
2. **Commit your changes** (recommended).
3. **Run the update command**:
   ```bash
   npx eas update --branch preview --message "Branding and crash fixes"
   ```

*Note: The branch name (`preview`) should match the branch linked to your installed build.*

## How it Works
When you run `eas update`, EAS bundles your app's JavaScript and assets and uploads them to Expo's servers. 
The next time a user opens the app, it will check for updates and download the new version automatically in the background (or on the next restart depending on configuration).

## Troubleshooting
- **No update received**: Ensure the `runtimeVersion` in `app.json` has not changed unless you intended to. OTA updates only work within the same runtime version.
- **Cache**: Sometimes the app needs to be closed and reopened twice to apply the update if `checkOnLaunch` is set to `ALWAYS` but `fallbackToCacheTimeout` is `0`.
