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
4. The admin dashboard calls `public.admin_approve_business_submission(uuid)`. This database function locks the pending application and, in one transaction, creates the approved/published business row and marks the application approved. If either operation fails, both are rolled back.
5. The public directory reads only rows where status is approved and published is true.

## Supabase security

The live project uses `admin_users`, `business_submissions`, `businesses`, and `business_claim_requests`. RLS is enabled on all four tables. Table grants are limited so:
- anonymous visitors can submit applications only in the 33 approved non-accommodation categories, always pending, unpublished and unfeatured;
- anonymous visitors can read only approved and published businesses in the same approved category whitelist;
- anonymous visitors can submit a claim/correction/removal request only for an existing approved and published business, and cannot read those requests;
- authenticated admins can check their own admin record, review/update submissions, manage businesses, and review/update claim requests;
- RLS policies remain the row-level security boundary. The approval RPC uses `SECURITY INVOKER` so the caller's existing table grants and RLS policies apply; it also checks `auth.uid()` against `admin_users`, locks the pending application, enforces the 33-category whitelist, and is executable only by authenticated users.

Do not run the older draft schema in `supabase/schema.sql` against this live project without reconciling its different table names (`user_roles` and `business_listings`) with the existing live schema.

## Current data state (26 November 2026)

As of 28 November 2026, the live database contains 75 approved and published Gozo businesses, 14 rejected business records, zero pending applications and zero claim requests. The public directory displays only the 75 approved/published records. A check of the published records found no hotel or accommodation categories. The 21 destination records are maintained separately in data/gozo-places.json.

## Install the website on iPhone

Open the public website in Safari, tap Share, then choose **Add to Home Screen**. The website includes a home-screen icon and an installable PWA shell. This is a web app shortcut, not the separate native iOS app.

## Important launch checks

- Configure the production website URL in Supabase Auth redirect settings before testing admin sign-in.
- Ensure the admin account has a valid sign-in method/password in Supabase Auth and enable leaked-password protection.
- Test a business application with a test listing before public launch.
- Confirm business details and obtain permission for every photo before publishing.
- Never publish the Supabase service-role key or other secret credentials.
- Confirm hosting/deployment is configured; GitHub commits alone do not guarantee that the live website has updated.
- The atomic approval migration `20261126203940_atomic_business_approval` is recorded as applied in the live Supabase project.
