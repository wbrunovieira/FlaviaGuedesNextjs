# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 (App Router) site for Flávia Guedes' hair salon: a multi-language marketing site with gift card purchasing. TypeScript, Tailwind CSS, Stripe and Square payments, dual persistence (PostgreSQL via Prisma + Firebase Firestore).

## Development Commands

The project uses **pnpm** (`pnpm-lock.yaml` is committed — do not use npm/yarn).

```bash
pnpm install              # Install dependencies
pnpm dev                  # Run development server
pnpm build                # Production build (runs `prisma generate` first)
pnpm lint                 # ESLint via next lint
npx prisma generate       # Regenerate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Inspect the database
ANALYZE=true pnpm build   # Bundle analysis (@next/bundle-analyzer)
```

There is no test suite configured.

## Architecture

### Routing and Internationalization

- next-intl with locales `en` and `pt` (`src/i18n/routing.ts`, messages in `messages/{en,pt}.json`), `localePrefix: 'always'`.
- Locale detection happens in `src/app/page.tsx`, which parses the `Accept-Language` header and redirects to `/{locale}`. `src/middleware.ts` exists but only guards admin routes — it plays no part in i18n.
- User-facing pages live under `src/app/[locale]/` (home, `success`, `cancel` for payment outcomes).
- The admin area `src/app/adm/` sits **outside** the `[locale]` segment and is not internationalized. Login posts to `api/adm-login`, which validates `ADMIN_EMAIL`/`ADMIN_PASSWORD` server-side and sets an HMAC-signed `httpOnly` cookie (helpers in `src/lib/admin-auth.ts`, 8h expiry). `src/middleware.ts` verifies that cookie for `/adm/dashboard` and the admin API routes (scoped matcher — it must not touch public/i18n routes).

### Payments (gift cards)

Two gateways coexist; Square is the one currently in use (see `docs/sqaure.md`):

- **Stripe**: `api/create-checkout-session` (Checkout redirect flow), client uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- **Square**: `api/create-square-payment`, `api/create-square-payment-direct`, `api/get-square-payment`, `api/test-square`. Sandbox vs production credentials are switched at runtime (sandbox vars are the `*_SANDBOX_*` ones). Square sandbox test cards are listed in `docs/sqaure.md`.
- Three purchase component variants in `src/components/`: `GiftCardPurchaseSimple`, `GiftCardPurchaseMultiPayment`, `GiftCardPurchaseSquare`.

### Dual Database

Gift card purchases are written to **both** stores; changes to gift card persistence must keep them in sync:

- PostgreSQL via Prisma — single `GiftCard` model in `prisma/schema.prisma` (keyed by `stripeSessionId`).
- Firebase Firestore — helpers exported from `firebase-config.ts` at the **repo root** (not in `src/`).

Other API routes: `api/get-giftcard`, `api/adm-get-giftcards` (admin dashboard), `api/save-payment`.

### Conventions

- Path alias `@/*` → `src/*`.
- Tailwind custom theme colors: background `#0A0A0A`, foreground `#EDEDED`, gold `#C8A04B`, graphite `#1E1E1E`, grayMedium `#B0B0B0`. Fonts: Work Sans and Merriweather.
- Animations use GSAP, Framer Motion, and tsparticles; UI primitives in `src/components/ui/` (Radix-based, cva/clsx/tailwind-merge).

### Environment Variables

- `POSTGRES_URL` — Prisma/PostgreSQL connection
- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `NEXT_PUBLIC_SQUARE_APPLICATION_ID`, `NEXT_PUBLIC_SQUARE_LOCATION_ID`; sandbox: `SQUARE_SANDBOX_ACCESS_TOKEN`, `NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` — admin login (server-side only)
- `BASE_URL` — used for payment redirect URLs

### Reference Docs

- `docs/stripe.md` and `docs/sqaure.md` (note the typo in the filename): payment gateway setup notes and Square sandbox test cards (in Portuguese)
- `servicos.md`: salon service list

## Git Commit Rules

### CRITICAL: Simple and Direct Commit Messages

**ALWAYS use short commits without extra metadata:**

✅ **CORRECT:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation issue"
git commit -m "refactor: simplify payment logic"
```

❌ **AVOID:**
- Unnecessary multi-line messages
- Tool metadata (Co-Authored-By, Generated with, etc)
- Emojis or special formatting
- AI tool references

### Conventional Commits Format

**Format:** `<type>(<optional scope>): <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring without functional change
- `perf`: Performance improvement
- `test`: Adding/fixing tests
- `chore`: Maintenance, dependencies
- `build`: Build system changes

### Commit Rules
1. **Always in English**
2. **Concise message (50-72 characters)**
3. **Use imperative mood** ("add" not "added" or "adding")
4. **Be specific** (not "fix bug" or "update files")
5. **NEVER add automatic attributions or metadata**
6. **NEVER use HEREDOC or complex formatting**

### IMPORTANT: GitHub Trigger
**When the user types "github"**: EXECUTE a git commit immediately with the recent changes, don't explain the rules. Just run:
1. `git status` to check changes
2. `git add .` or specific files
3. `git commit -m "type: description"` following the rules above
4. Report the commit was made
