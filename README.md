# AgeGate Proxy

Privacy-preserving age verification MVP mockup built with Next.js App Router, TypeScript, Tailwind CSS, Route Handlers, and a JSON-backed mock service layer designed for Cloudflare Workers deployment through OpenNext.

## Overview

AgeGate Proxy sits between a client platform and a trusted identity provider.

Instead of sending full identity data directly to the client platform, the user:

1. Signs in to an internal AgeGate account.
2. Chooses a client platform that needs an age decision.
3. Chooses a trusted provider source.
4. Grants consent for age-band-only disclosure.
5. Receives a privacy-safe proof token.

The client platform only gets a minimal result such as:

```json
{
  "verified": true,
  "age_band": "18+",
  "proof_token": "agtok_demo_123",
  "provider": "gov",
  "expires_at": "2026-12-31T23:59:59Z"
}
```

## Current provider scope

This demo intentionally keeps the provider catalog narrow for now:

- `Gov Identity (.gov)`
- `Gmail Account`

The provider catalog is still JSON-driven and easy to extend later.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Next.js Route Handlers under `app/api/...`
- Mock service layer under `lib/services`
- JSON seed data under `lib/mock-db/json`
- Cloudflare/OpenNext-compatible project setup

## Product surfaces

### Admin

- Admin login
- Dashboard
- Platforms
- Providers
- Users
- Logs / audit trail

### End user

- User login / registration
- Choose platform
- Choose provider
- Consent
- Verification in progress
- Verification result
- My connections

### External client

- NightWave demo page
- API response side drawer
- Restricted content unlock after proof exchange

## Design direction

- Light, modern B2B SaaS layout
- Blue, teal, and indigo accents
- shadcn-style component patterns
- Trust cues, cards, data tables, badges, alerts, modals, drawers
- Clean product-grade presentation rather than a toy mockup

## Project structure

```text
app/
  (admin-auth)/admin/login
  (admin-shell)/admin
  (user-auth)/user/login
  (user-shell)/user
  api/...
  client-demo
components/
  admin/
  app-shell/
  brand/
  client-demo/
  providers/
  ui/
  user/
lib/
  mock-db/
    json/
  services/
  types/
  utils/
public/
```

## Editable mock data

All demo records are designed to be edited in JSON without touching the UI code:

- [lib/mock-db/json/platforms.json](/home/brayo/code/ihc/lib/mock-db/json/platforms.json)
- [lib/mock-db/json/providers.json](/home/brayo/code/ihc/lib/mock-db/json/providers.json)
- [lib/mock-db/json/users.json](/home/brayo/code/ihc/lib/mock-db/json/users.json)
- [lib/mock-db/json/connections.json](/home/brayo/code/ihc/lib/mock-db/json/connections.json)
- [lib/mock-db/json/consents.json](/home/brayo/code/ihc/lib/mock-db/json/consents.json)
- [lib/mock-db/json/verifications.json](/home/brayo/code/ihc/lib/mock-db/json/verifications.json)
- [lib/mock-db/json/client-sessions.json](/home/brayo/code/ihc/lib/mock-db/json/client-sessions.json)
- [lib/mock-db/json/audit-logs.json](/home/brayo/code/ihc/lib/mock-db/json/audit-logs.json)

## Demo credentials

### Admin

- `admin@agegateproxy.com`
- `DemoAdmin!23`

### User

- `ava.patel@northmail.com`
- `DemoUser!23`

## Local development

```bash
pnpm install
pnpm dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/user/login`
- `http://localhost:3000/client-demo`

## Verification commands

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Notes:

- The production build uses `NEXT_DIST_DIR=.next-prod` to isolate production artifacts from any local dev `.next` state.
- The build runs in two verified phases:
  - `next build --experimental-build-mode compile`
  - `next build --experimental-build-mode generate`

## Architecture summary

### Frontend

- App Router route groups separate admin auth, admin shell, user auth, user shell, and client-demo pages.
- Reusable UI primitives live in `components/ui`.
- Shared navigation and section chrome live in `components/app-shell`.
- Admin, user, and client-demo each use dedicated feature components.

### Backend

- Route Handlers under `app/api/...` expose the full mock API contract.
- No separate backend exists for the MVP.
- Stateful mock logic lives in `lib/services`.
- Seed data and in-memory persistence live in `lib/mock-db`.
- Cookie-based fake sessions are used for admin and end-user auth.

### Mock data behavior

- JSON files are cloned into an in-memory singleton store on first use.
- UI actions mutate the in-memory store so the demo feels live.
- Audit logs update from runtime actions such as login, consent, verification, proof exchange, and revocation.

### Caveat

- In-memory state can reset between requests or deployments in serverless / Workers environments.
- For a future production path, move mutable state into Cloudflare KV, D1, or Durable Objects.

## External client flow

NightWave uses the demo API in this sequence:

1. `POST /api/client/request-age-check`
2. Redirect user into `/user/login` with platform and client session context
3. User completes platform, provider, consent, and verification flow
4. Verification page returns to `/client-demo?sessionId=...&proofToken=...`
5. NightWave calls `POST /api/client/exchange-proof`
6. Restricted content unlocks and the JSON result is shown in the side panel

## Route map

### App routes

- `/`
- `/admin/login`
- `/admin`
- `/admin/platforms`
- `/admin/providers`
- `/admin/users`
- `/admin/logs`
- `/user/login`
- `/user`
- `/user/platforms`
- `/user/providers`
- `/user/consent`
- `/user/verification/[id]`
- `/user/connections`
- `/client-demo`

## Mock API map

### Admin endpoints

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/dashboard`
- `GET /api/admin/platforms`
- `PATCH /api/admin/platforms/:id/status`
- `GET /api/admin/providers`
- `POST /api/admin/providers`
- `GET /api/admin/users`
- `GET /api/admin/logs`

### User endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/user/platforms`
- `GET /api/user/providers`
- `POST /api/user/consent`
- `POST /api/user/verify`
- `GET /api/user/connections`
- `POST /api/user/connections/:id/revoke`

### Verification flow endpoints

- `POST /api/verification/start`
- `GET /api/verification/:id/status`
- `POST /api/verification/:id/callback/provider`
- `POST /api/verification/:id/finalize`

### External client endpoints

- `POST /api/client/request-age-check`
- `POST /api/client/exchange-proof`
- `GET /api/client/session-status`

## Sample payloads

### Admin login

Request:

```json
{
  "email": "admin@agegateproxy.com",
  "password": "DemoAdmin!23"
}
```

Response:

```json
{
  "admin": {
    "id": "adm_primary",
    "name": "Avery Chen",
    "email": "admin@agegateproxy.com",
    "role": "super_admin"
  }
}
```

### User register

Request:

```json
{
  "fullName": "Riley Parker",
  "email": "riley@example.com",
  "password": "DemoUser!23",
  "age": 22
}
```

Response:

```json
{
  "user": {
    "id": "usr_xxxxxxxx",
    "internalRef": "AGP-5421",
    "email": "riley@example.com",
    "ageBand": "21+"
  }
}
```

### Consent

Request:

```json
{
  "platformId": "plt_nightwave",
  "providerId": "prv_gov",
  "clientSessionId": "cls_abc123",
  "approved": true
}
```

Response:

```json
{
  "consent": {
    "id": "consent_xxxxxxxx",
    "status": "approved",
    "scope": "age_band_only"
  }
}
```

### Start verification

Request:

```json
{
  "platformId": "plt_nightwave",
  "providerId": "prv_gov",
  "clientSessionId": "cls_abc123"
}
```

Response:

```json
{
  "verification": {
    "id": "ver_xxxxxxxx",
    "status": "provider_pending",
    "requestedMinAge": 18,
    "verified": false
  }
}
```

### Provider callback

Response:

```json
{
  "verification": {
    "id": "ver_xxxxxxxx",
    "status": "validating",
    "providerPayload": {
      "iss": "gov_identity",
      "provider": "gov",
      "age_over_18": true,
      "age_over_21": true
    }
  }
}
```

### Finalize verification

Success:

```json
{
  "verification": {
    "id": "ver_xxxxxxxx",
    "status": "completed",
    "verified": true,
    "ageBand": "21+",
    "proofToken": "agtok_demo_f3a92c11"
  }
}
```

Failure:

```json
{
  "verification": {
    "id": "ver_xxxxxxxx",
    "status": "failed",
    "verified": false,
    "reason": "minimum_age_not_met"
  }
}
```

### Client request-age-check

Request:

```json
{
  "platformId": "plt_nightwave"
}
```

Response:

```json
{
  "session": {
    "id": "cls_xxxxxxxx",
    "platformId": "plt_nightwave",
    "status": "pending",
    "requiredAge": 18
  },
  "startUrl": "/user/login?platformId=plt_nightwave&clientSessionId=cls_xxxxxxxx&next=%2Fuser%2Fplatforms%3FplatformId%3Dplt_nightwave%26clientSessionId%3Dcls_xxxxxxxx"
}
```

### Client exchange-proof

Request:

```json
{
  "sessionId": "cls_xxxxxxxx",
  "proofToken": "agtok_demo_f3a92c11"
}
```

Success response:

```json
{
  "verified": true,
  "age_band": "18+",
  "proof_token": "agtok_demo_f3a92c11",
  "provider": "gov",
  "expires_at": "2026-12-31T23:59:59Z"
}
```

Failure response:

```json
{
  "verified": false,
  "reason": "minimum_age_not_met"
}
```

## Reusable component list

### UI primitives

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/select.tsx`
- `components/ui/table.tsx`
- `components/ui/alert.tsx`
- `components/ui/modal.tsx`
- `components/ui/sheet.tsx`
- `components/ui/progress.tsx`

### Shared shells and branding

- `components/brand/agegate-logo.tsx`
- `components/app-shell/sidebar-nav.tsx`
- `components/app-shell/section-intro.tsx`
- `components/providers/provider-mark.tsx`

### Feature components

- `components/admin/admin-login-form.tsx`
- `components/admin/platforms-table.tsx`
- `components/admin/providers-console.tsx`
- `components/admin/metric-card.tsx`
- `components/admin/activity-timeline.tsx`
- `components/user/user-auth-panel.tsx`
- `components/user/platform-card.tsx`
- `components/user/consent-panel.tsx`
- `components/user/verification-runner.tsx`
- `components/user/connections-dashboard.tsx`
- `components/client-demo/client-demo-experience.tsx`
- `components/client-demo/response-panel.tsx`

## Sample types

Core types live in [lib/types/index.ts](/home/brayo/code/ihc/lib/types/index.ts) and include:

- `Platform`
- `Provider`
- `User`
- `ProviderProfile`
- `Connection`
- `ConsentRecord`
- `VerificationRecord`
- `ClientSession`
- `AuditLog`
- `DatabaseState`

## Cloudflare deployment notes

This project is prepared conceptually for Cloudflare Workers via OpenNext.

### Included setup

- `adapter` field in `package.json`
- `open-next.config.ts`
- `wrangler.jsonc`
- Worker-friendly code paths that avoid Node-only database and filesystem runtime behavior in app logic
- Production build isolation through `NEXT_DIST_DIR=.next-prod`

### Recommended commands

```bash
pnpm preview
pnpm deploy
```

### Important caveats

- In-memory mock state is not durable on Workers and can reset between requests, isolates, or deployments.
- For a production version, move mutable entities to:
  - Cloudflare KV for lightweight key/value state
  - Cloudflare D1 for relational records
  - Durable Objects for verification sessions and stronger consistency

### OpenNext / Workers notes

- The app logic itself uses web-standard patterns where possible.
- Cookie-based demo auth is intentionally lightweight and suitable only for mock/demo use.
- Route Handlers keep the MVP full-stack inside the Next app, which is a clean fit for an OpenNext deployment path.

## Notes on reference screens

The UI direction was derived from the reference assets found in:

- `userFlow/`
- `adminFlow/`

The final implementation keeps the same clean, trust-heavy flow language while adapting it into an English-language B2B SaaS product for AgeGate Proxy.
