# Gozo Guide by PELIK

A Gozo-first public directory for places, local businesses and services, designed to expand across Malta.

## Current website pages

- `index.html` — public Gozo guide homepage and destination discovery.
- `businesses.html` — public directory; it loads only approved and published rows from Supabase.
- `submit-business.html` — public business application form. New applications are inserted as pending, unpublished and not featured.
- `admin.html` — private administrator sign-in and application review dashboard.
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

## Important launch checks

- Configure the production website URL in Supabase Auth redirect settings before testing admin sign-in.
- Ensure the admin account has a valid sign-in method/password in Supabase Auth.
- Test a business application with a test listing before public launch.
- Confirm business details and obtain permission for every photo before publishing.
- Never publish the Supabase service-role key or other secret credentials.
- Confirm hosting/deployment is configured; GitHub commits alone do not guarantee that the live website has updated.
