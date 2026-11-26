# Gozo Guide by PELIK — native iOS and Android app

This is the separate native mobile app project. The existing public website remains in place.

## App features currently implemented
- Home screen with Gozo Guide branding, accessible category navigation, app icon and native splash configuration
- Gozo destination feed with search, beach/history/nature filters, photo credits, Google Maps links and safe image fallbacks
- Live business directory from Supabase, showing approved and published records only, with search, category filters, refresh and safe contact links
- Business search and category filters
- Google Maps links for business locations
- Free business application form with category and village selection
- Required privacy acknowledgement and basic email, website and photo-link validation
- Every new application is submitted as pending, unpublished and unfeatured
- No accommodation category, subscriptions, paywalls, paid listings or advertising logic

## Technical setup
- Expo SDK 58.1 / React Native 0.88
- Expo Router file-based navigation
- Supabase public client key only; never place a service-role key in this app
- GitHub Actions validates destination records and runs TypeScript and Expo Doctor checks on mobile changes

## Run locally
From this folder:

```bash
npm install
npm run validate:content
npm run typecheck
npm run doctor
npx expo start
```

Use an Expo development build for real-device testing and production work. Store builds require the owner's Expo/EAS setup and Apple/Google developer accounts.

## Before public release
1. Run successful iOS and Android development/release builds and test on physical devices.
2. Verify the Supabase production policies and test that anonymous applicants cannot approve, publish, feature or edit submissions.
3. Enable Supabase leaked-password protection for administrator sign-in.
4. Confirm that the app's submission form fields match the live Supabase table and policy configuration.
5. Verify photo permissions/licences for every destination and business image.
6. Complete the privacy notice with the operator's legal identity, contact details, retention periods and provider/data-transfer details.
7. Confirm the final app icon and splash assets, store screenshots and store listing text.
8. Complete accessibility, device-size, offline/error-state and security testing.

The code is not yet a store-ready release. No store submission or paid developer registration has been made.
