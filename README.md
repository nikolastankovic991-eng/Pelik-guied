# Gozo Guide by PELIK

A free Gozo-first public directory for visitors, residents, places, local businesses and services, designed to expand across Malta. Browsing and business listing applications are free; there are no subscriptions, paywalls or paid placements. Accommodation listings are retained privately for a future development phase and are not currently accepted or shown publicly.

## Current website pages

- `index.html` — public Gozo guide homepage and destination discovery.
- `businesses.html` — public directory; it loads only approved and published rows from Supabase.
- `submit-business.html` — public business application form. New applications are inserted as pending, unpublished and not featured.
- `admin.html` — private administrator sign-in and application review dashboard.
- `claim-business.html` — public claim, correction and removal request form for approved listings.
- `manifest.webmanifest` and `service-worker.js` — installable PWA shell with offline page/data caching.
- `mobile/` — separate Expo/React Native iOS and Android app project.
- `supabase-config.js` — browser-safe Supabase project URL and publishable key. Never put a service-role key here.

## Business approval workflow

1. A business submits the form.
2. The application is stored in `public.business_submissions` with `status = 'pending'`, `published = false`, and `featured = false`.
3. The administrator signs in at `admin.html`. The dashboard checks the signed-in user's ID against `public.admin_users`.
4. Approval creates a row in `public.businesses` with `status = 'approved'` and `published = true`, then marks the submission approved.
5. The public directory reads only rows where status is approved and published is true.

## Supabase security

The live project currently uses `admin_users`, `business_submissions`, and `businesses`. RLS is enabled on all three tables. Table grants are limited so:
- anonymous visitors can insert applications and read public businesses;
- anonymous visitors cannot read private submissions;
- authenticated admins can check their own admin record, review/update submissions, and manage business listings;
- RLS policies still determine which rows each role may access.

Do not run the older draft schema in `supabase/schema.sql` against this live project without reconciling its different table names (`user_roles` and `business_listings`) with the existing live schema.

## Current data state (26 November 2026)

The database contains 53 private draft candidates, zero approved/published public businesses, zero applications and zero claim requests. The public business directory is intentionally empty until the administrator approves and publishes listings. Legacy accommodation drafts remain private and are blocked from public visibility.

## Install the website on iPhone

Open the public website in Safari, tap Share, then choose **Add to Home Screen**. The website includes a home-screen icon and an installable PWA shell. This is a web app shortcut, not the separate native iOS app.

## Important launch checks

- Configure the production website URL in Supabase Auth redirect settings before testing admin sign-in.
- Ensure the admin account has a valid sign-in method/password in Supabase Auth and enable leaked-password protection.
- Test a business application with a test listing before public launch.
- Confirm business details and obtain permission for every photo before publishing.
- Never publish the Supabase service-role key or other secret credentials.
- Confirm hosting/deployment is configured; GitHub commits alone do not guarantee that the live website has updated.
