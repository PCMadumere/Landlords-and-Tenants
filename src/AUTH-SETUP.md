# Landlords-and-Tenants authentication setup

The Supabase SQL migration must be run first (the SQL you saved as Landlords-and-Tenants - User Profiles & Role Management).

## Included
- Global client auth provider restores sessions and listens for sign-in/sign-out changes.
- Google OAuth passes only tenant/landlord/caretaker as requested roles; the database trigger rejects admin from user metadata.
- Dashboard is a Server Component and calls Supabase `getUser()` plus the `profiles` table before rendering.
- A requested dashboard role is not trusted. A user can only enter their own role dashboard; admin can enter any role dashboard.
- Dashboard includes sign out.
- The old unverified/demo account submit and preview links are disabled so they cannot bypass authentication.

## Environment
Keep `.env.local` in the project root and ensure it contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never expose a service-role key in the browser.

## Run
`npm install` then `npm run dev`. Test Google sign-in, refresh the dashboard, open `/dashboard?role=admin` as a non-admin (it should redirect), and sign out.

## Admin
Promote the trusted administrator manually in Supabase SQL Editor using the user's Auth UUID:
`update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID';`
