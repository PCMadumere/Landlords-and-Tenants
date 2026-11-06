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
