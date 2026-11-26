# PELIK GUIDE — live Supabase setup notes

## Existing live database

The connected Supabase project currently uses these public tables:

- `admin_users`: administrator user IDs linked to `auth.users`.
- `business_submissions`: business applications.
- `businesses`: directory records, including private drafts.
- `business_claim_requests`: public claim, correction and removal requests.

RLS is enabled on all four tables. The live website uses these tables and their existing columns.

## Public and administrator permissions

The intended access model is:

- Visitors may INSERT a business application using only the approved public category list; every application must be pending, unpublished and unfeatured. They cannot SELECT private applications.
- Visitors may INSERT a claim/correction/removal request only for a business that is already approved and published; they cannot read or update those requests.
- Visitors may SELECT businesses only when `status = 'approved'` and `published = true`.
- Signed-in users may read their own administrator row, as constrained by RLS.
- Only users whose auth UUID exists in `admin_users` may review/update submissions, manage businesses, and read/update claim requests.

The connected project has been granted the table privileges required for these RLS policies to work. The policies remain the row-level security boundary.

The public application policy now whitelists the exact 33 categories used by the website and mobile app, so accommodation categories are rejected even if a client bypasses the forms. The public claim-request policy also checks that the submitted business ID and name match an existing approved, published listing. Anonymous users have INSERT-only access to claim requests; authenticated administrators have SELECT and UPDATE access, still restricted by the admin RLS policies.

## Website files

- `supabase-config.js`: public project URL and publishable key only.
- `submit-business.html`: application form inserts pending/unpublished/not-featured rows.
- `admin.html`: password sign-in, verifies the admin row, then offers approve/reject actions.
- `businesses.html`: displays only approved and published businesses from Supabase.
- `claim-business.html`: creates requests for existing approved and published listings; requests stay pending until an administrator reviews them.

## Do not do this

- Do not add a service-role key to browser code.
- Do not expose private submission records publicly.
- Do not allow a business applicant to set approved, published, or featured values.
- Do not run the older draft `supabase/schema.sql` on the live project without a deliberate migration: it describes a different schema (`user_roles` and `business_listings`) and is not the live table structure.

## Before launch

1. Confirm the site is deployed and note its exact URL.
2. Add that URL to Supabase Authentication URL Configuration and redirect allow-list.
3. Confirm the administrator has a working email/password sign-in method.
4. Submit a test business application.
5. Sign in at `admin.html`, approve the test record, and confirm it appears on `businesses.html`.
6. Remove the test listing after verification.
7. Confirm image ownership/licensing and business details before publishing real listings.
8. Enable Supabase leaked-password protection for administrator sign-in.
9. Keep the public category list in `mobile/data/categories.ts`, `submit-business.html` and the `business_submissions` RLS policy in sync.
