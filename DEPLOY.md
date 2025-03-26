# Deployment Guide for Basketball Stats App

This guide outlines the steps to deploy the Basketball Stats App to app stores (Google Play and Apple App Store).

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) (`npm install -g expo-cli`)
- [EAS CLI](https://docs.expo.dev/eas-update/getting-started/) (`npm install -g eas-cli`)
- Expo account (Sign up at [expo.dev](https://expo.dev/))
- Apple Developer account (for iOS deployment)
- Google Play Developer account (for Android deployment)

## Step 1: Verify Build

Before deploying, verify that the app builds correctly:

```bash
npm run verify-build
```

This script checks TypeScript compilation and Metro bundler to ensure there are no critical errors.

## Step 2: Configure EAS Build

If you haven't already, initialize EAS Build:

```bash
eas build:configure
```

This will create an `eas.json` file in your project. Make sure it includes configurations for both development and production builds.

## Step 3: Set Up Environment Variables

Create a `.env` file with all necessary environment variables (Firebase credentials, API keys, etc.):

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

For secure deployment, use EAS secrets:

```bash
eas secret:create --name FIREBASE_API_KEY --value your-api-key
```

## Step 4: Update App Version

Update the version numbers in `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

Increment these numbers for each new release.

## Step 5: Submit Builds to App Stores

### Android

1. Build for Android:
   ```bash
   eas build --platform android --profile production
   ```

2. Submit to Google Play:
   ```bash
   eas submit -p android
   ```

### iOS

1. Build for iOS:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit to App Store:
   ```bash
   eas submit -p ios
   ```

## Step 6: Testing Production Builds

Before submitting to app stores, you can create and test internal distribution builds:

```bash
eas build --profile preview
```

This creates a build that can be shared with testers.

## Troubleshooting

### Common Issues

1. **Firebase Configuration**: Ensure the Firebase config in `src/config/firebase.js` matches your environment variables.

2. **Build Failures**: Check the EAS build logs for specific errors. Most issues are related to:
   - Missing dependencies
   - TypeScript errors
   - Native module conflicts

3. **App Rejections**: Common reasons for app store rejections:
   - Privacy policy issues
   - Missing permissions justifications
   - Crashes during review

### Getting Help

If you encounter issues:
1. Check the [Expo documentation](https://docs.expo.dev/)
2. Consult the [EAS Build docs](https://docs.expo.dev/build/introduction/)
3. Post in the team's Slack channel: #basketball-app-deployment 