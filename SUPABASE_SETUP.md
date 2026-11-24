# PELIK GUIDE — secure admin setup

The public Gozo directory is currently a static website backed by JSON. The business cards are deliberately hidden unless a record is approved and published.

## Backend decision

The planned backend is Supabase:
- PostgreSQL database for business listings and applications
- Supabase Auth for private administrator sign-in
- Row Level Security (RLS) so visitors only see approved and published listings
- Admin-only permissions for approval, rejection, publication and Featured/Premium status

The admin area must not use a password hard-coded in HTML or JavaScript. Never put a Supabase service-role key in the website.

## Initial setup

1. Create a Supabase project at https://supabase.com.
2. Open the project's SQL Editor.
3. Run the SQL in `supabase/schema.sql`.
4. Create the owner account in Supabase Authentication.
5. Add that account's user UUID to `public.user_roles` with role `admin` using the SQL Editor.
6. Keep the project URL and anon/publishable key available for the frontend configuration. Do not share or publish the service-role key.

## Important publication rules

- New submissions start as `pending` and `is_published = false`.
- Only an admin can approve, reject, suspend or publish a listing.
- Only an admin can set Featured/Premium or sponsored status.
- Paid status never bypasses approval.
- A listing can only be public when its status is approved and it is published.
- Business photos require permission or a suitable licence before publication.

## Current status

This repository does not yet contain Supabase credentials, a connected database, a live application form, or a working admin dashboard. The SQL file prepares the secure database rules; the next implementation step is connecting the project and building the authenticated admin interface. Existing JSON records remain draft starter leads and are not automatically imported or published.
