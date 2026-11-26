# Gozo Guide by PELIK — native mobile app

This is the native iOS and Android app project, separate from the existing public web directory.

## Current scope
- Expo / React Native native app foundation
- Gozo destination feed from the existing destination dataset
- Live public business directory from Supabase (approved + published only)
- Free business application form; submissions remain pending and unpublished
- No accommodation category or accommodation listings in the public app
- No paywall, subscription, paid listing or advertising logic

## Build preparation
1. Copy `.env.example` to `.env` and set the existing Supabase project URL and public publishable key.
2. Install the dependencies using the current Expo SDK-compatible versions.
3. Run `npx expo install --fix`, then `npx expo-doctor`.
4. Test on physical iOS and Android devices.
5. Configure the Expo account and app-store credentials before production builds.

Use a development build for production testing; Expo Go is only a development sandbox. Store submission requires the owner's Apple Developer and Google Play Console accounts.
