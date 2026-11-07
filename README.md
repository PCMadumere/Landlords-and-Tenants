# Landlords-and-Tenants — Next.js migration

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Routes
- `/` — public marketplace
- `/account` — account / Google sign-in demo
- `/dashboard?role=tenant` — tenant preview
- `/dashboard?role=landlord` — landlord preview
- `/dashboard?role=caretaker` — caretaker preview
- `/dashboard?role=admin` — admin preview

## Migration status
This first-pass migration retains the supplied design, CSS, HTML markup and existing client-side demo behaviour. The old DOM-based JavaScript is loaded on the matching Next.js route as a temporary compatibility bridge. This is a Next.js project, but the legacy interactions have not yet been rewritten into idiomatic React components/hooks.

Google sign-in is simulated. No Supabase project, OAuth credentials, real database, cloud file uploads, email or push notifications are configured. Demo data remains in this browser's localStorage.

Before production, refactor the legacy script into React components and connect Supabase Auth, PostgreSQL, Storage and server-enforced permissions. Admin permissions must never be controlled by a public role selector.

The original `.git` history was not copied. This keeps the migration separate and protects the original repository.

## Authentication and role onboarding update

This project uses Supabase Google OAuth. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key. Never commit `.env.local`.

Before testing Google sign-in, run the SQL migration in `supabase/migrations/202611070001_role_onboarding.sql` in the Supabase SQL Editor. The OAuth callback exchanges the code, then calls `set_my_initial_role` to save the selected public role (tenant, landlord, or caretaker). Admin is never selectable during public onboarding and must be assigned through a trusted administrative process.

The Next.js 15 session refresh entry point is `src/middleware.ts`. The dashboard page also checks the authenticated user and profile on the server. Middleware is not the security boundary: database access must continue to be protected with Supabase Row Level Security policies.

The legacy dashboard is still a browser-side prototype and stores marketplace demo data locally. This update does not turn property, viewing, favourite, report, or moderation data into production database workflows. Those require their own tables, server-side operations, and RLS policies before launch.
