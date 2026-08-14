<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GoodBoy donation form — GoodRequest frontend assignment

Donation form for the fictional GoodBoy foundation supporting Slovak dog shelters. Full brief in [README.md](README.md) (SK + EN). Design: [Figma](https://www.figma.com/design/fOYdJW8UqfZjT8o2WYigty/Frontend-Assignment-2.0).

Visual quality, animations and project structure are all graded, not just correctness.

## Commands

```bash
pnpm dev     # dev server (Turbopack, default in Next 16)
pnpm build   # production build — also the typecheck gate
pnpm lint    # eslint
```

pnpm only. Never `npm`/`yarn` — the lockfile is `pnpm-lock.yaml`.

## Stack

Installed: Next.js 16 (App Router, `src/`, alias `@/*`), React 19, TypeScript, Tailwind v4, ESLint.

Required by the brief, add when first needed:

- **TanStack Query** — all server state. No `fetch` in components, no server state in a client store.
- **react-hook-form + Zod** — one Zod schema per form step is the single source of truth for validation; infer TS types from it (`z.infer`), never hand-write them alongside.
- **Zustand** — client-only state (selected donation form, current step, draft values across steps).

Optional extras the brief rewards: i18next for strings, accessibility, responsive layout, per-step SEO metadata, multiple donors.

## Code style

- **DRY.** Extract on the second occurrence, not the third. Shared field wrappers, one API client, one query-key factory.
- **Small functions that explain themselves.** A function does one thing and its name says what. If you need a comment to explain *what* it does, rename or split it instead.
- **Comments only when they earn it** — non-obvious *why*, workarounds, business rules that look arbitrary. No restating code, no section banners, no JSDoc on self-evident helpers.
- Named exports; `default` only where a framework demands it (pages, layouts).
- No `any`. Derive types from Zod schemas and API response types rather than duplicating shapes.
- Server Components by default; `'use client'` only on the leaves that need interactivity.
- Tailwind for styling; pull repeated class strings into components, not into string constants.

## Domain rules

The design is a **3-step wizard**, one route per step so each can carry its own metadata:

| Route | Step | Contents |
| --- | --- | --- |
| `/` | Výber útulku | target toggle, shelter select, amount + presets |
| `/osobne-udaje` | Osobné údaje | first name, last name, e-mail, phone |
| `/potvrdenie` | Potvrdenie | read-only summary, GDPR consent, submit |

Each step validates against its own Zod schema and writes the parsed values into the zustand draft store (`features/donation/store.ts`). The draft is memory-only, so `RequireDraft` bounces a direct hit on a later step back to `/`. Plus two static pages: `/kontakt` and `/o-projekte` (the latter shows the `results` totals).

Donation target: **general foundation contribution** or **a specific shelter**. Shelter is required when a specific shelter was chosen, optional otherwise — this conditional rule belongs in the Zod schema (`superRefine`), not in component logic.

Amount: preset options plus a custom value. Required, must be > 0.

Personal data:

| Field | Required | Rule |
| --- | --- | --- |
| First name | yes | 2–20 chars — the brief calls it optional, but the API 400s on an empty `firstName` |
| Last name | yes | 2–30 chars |
| E-mail | yes | valid e-mail |
| Phone | yes | SK/CZ number, `+421` / `+420` prefix with the country flag shown |
| GDPR consent | yes | must be checked |

Submit errors must be shown to the user in plain language, never swallowed.

**React Compiler is off** (`next.config.ts`). It memoizes `useForm()`'s returned functions, which silently drops `setValue`/`reset` writes to uncontrolled inputs. Do not re-enable it while react-hook-form drives the form.

## API

Base URL `https://frontend-assignment-api.goodrequest.dev`, no auth. Spec: [data.json](https://frontend-assignment-api.goodrequest.dev/apidoc/data.json).

```
GET  /api/v1/shelters/?search=          → { shelters: { id: number, name: string }[] }
GET  /api/v1/shelters/results?search=   → { contributors: number, contribution: number | null }
POST /api/v1/shelters/contribute        → { messages: { message: string, type: 'ERROR'|'WARNING'|'INFO'|'SUCCESS' }[] }
```

`contribute` body:

```ts
{
  contributors: { firstName: string; lastName: string; email: string; phone?: string | null }[]
  shelterID?: number | null   // omit/null for a general contribution
  value: number               // >= 0
}
```

`contributors` is an array — the "multiple donors" bonus needs no API change. `results` drives the total-raised / donor-count display and should be refetched (or invalidated after a successful POST) so the numbers stay live.

## Git

The repo owner writes and pushes his own commits. Make the file changes and leave the tree dirty — do not run `git commit` or `git push` unless explicitly asked.
