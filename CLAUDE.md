# GenAI: From Zero to Hero: CLAUDE.md

## Project Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties (mocha/cream palette)
- **Content:** MDX files in `content/<track>/` with gray-matter frontmatter
- **DB:** Neon Postgres via `@neondatabase/serverless`
- **Scoring:** Azure OpenAI gpt-4o (lazy client init, never at module level)
- **Secrets:** Doppler project `genai-zero-to-hero` config `prd`
- **Hosting:** Vercel (auto-deploy on git push)
- **Auth:** NextAuth v5 (Auth.js), Credentials provider, JWT session, bcryptjs password hashing

## Directory Structure
```
content/<track>/<module>.mdx   ← course content (## המסגרת / ## מקורות להעמקה / ## מה לעשות, quiz-based)
src/app/track/<track>/         ← learner-facing pages
src/app/admin/                 ← admin dashboard (force-dynamic)
src/app/api/submit/            ← submission + async scoring
src/lib/db.ts                  ← Neon queries (lazy init)
src/lib/scorer.ts              ← Azure OpenAI scoring (lazy init)
src/lib/modules.ts             ← MDX file reader
src/components/ui/MdxTable.*   ← custom MDX table components
src/components/ui/ScoringTable.* ← admin score breakdown
src/auth.ts                    ← NextAuth v5 config (Credentials provider, JWT callbacks)
src/proxy.ts                   ← Next.js 16 middleware (route guard, was middleware.ts pre-16)
src/app/login/                 ← login page
src/app/api/users/              ← admin-only user management API
```

## Token & Cache Rules
- **Never rewrite this file mid-session:** invalidates cache prefix
- **Never re-read unchanged files:** rely on cached context
- **Never echo, summarize, or repeat the user's prompt**
- **Terminal output:** pipe through `grep`/`head -n 20`, never >30 lines raw
- **Search scope:** target specific subdirectory, never recursive global grep
- **Ignore always:** `.git`, `node_modules`, `.next`, `bun.lock`

## Agent Behavior Rules
- No preamble/postamble: skip greetings and "sure, here is the code"
- Code changes: minimal diff, never full file rewrite unless necessary
- No unsolicited refactoring, comments, or logging
- Auto-fix loop cap: if a fix fails twice, halt and report
- Single task focus: address only what was asked
- Ambiguity: ask one short question before writing code
- Always verify current state before answering "what's the status": check `git status`/`git log` and Vercel deployment status directly, never rely only on memory or a prior conversation summary

## Critical Patterns
- **Lazy init:** `neon()` and `AzureOpenAI()` must be inside functions, never at module level (breaks Vercel build)
- **MDX tables:** require `remarkGfm` plugin in `MDXRemote options.mdxOptions.remarkPlugins`
- **RTL:** `dir="rtl" lang="he"` on `<html>`, `direction: rtl` on content blocks (p/li/h1-h3). NEVER `unicode-bidi: plaintext` on those: it overrides `direction` and flips blocks starting with a Latin character to LTR, breaking bullet position. `plaintext` is only correct on `input`/`textarea` paired with `dir="auto"`. code/pre stay `dir="ltr"`
- **Admin page:** must have `export const dynamic = "force-dynamic"`
- **Scoring:** async, wrapped in `next/server`'s `after()` in `/api/submit`: learner gets badge immediately, score arrives in background. Plain `.then()` after the response was returned was NOT reliable (serverless function can freeze right after responding, silently killing in-flight work with no error) — `after()` guarantees the callback runs to completion.
- **Auth/routing:** `src/proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`; always runs Node.js runtime, no `runtime` config field allowed) gates `/`, `/track/*`, `/admin/*`, `/api/submit`, `/api/users/*`, `/api/module-threshold`: unauthenticated → redirect to `/login`; non-admin on admin-only paths → redirect to `/`. Submitter identity comes from the session (`auth()` in the route handler), never from client-supplied `name`/`email` fields — `QuizForm`/`DeliverableForm` have no name input. If a new public/marketing route is ever added outside this matcher, remember it will NOT require login unless explicitly added to `config.matcher` in `src/proxy.ts`.
- **Passing score, not per-criterion thresholds:** the old rubric-era `thresholds` table/`ThresholdEditor`/`/api/threshold` (per-criterion sliders) are deleted: every module lost its `rubric` field when content moved to the quiz model, so that UI always rendered zero rows. Replaced with `module_thresholds` (one 0-100 passing score per module, default 70 via `DEFAULT_PASSING_SCORE` in `src/lib/track-progress.ts`), `ModuleThresholdEditor`, `/api/module-threshold`.
- **Pass/fail gates sequential unlocking:** `getTrackProgress()` computes a `ModuleStatus` per module ("passed" | "failed" | "pending" | "not-attempted") from `db.getModuleScores()` (latest score per module, `null` = submitted but not yet scored) compared against that module's threshold. `completedIds` (used everywhere for unlocking, badges, dashboard %) means **passed only** — a failed or still-pending module does NOT unlock the next one. `TrackLevelList` shows a red ✗ for failed, ⏳ for pending, ✓ green for passed. `AnsweredQuizView` receives this `status` and shows a matching header + "ערוך תשובות ונסה שוב" CTA on failure (resubmitting via `QuizForm`'s `initialAnswers` prop, pre-filled from the last attempt).
- **First admin account:** no self-registration; `ensureBootstrapAdmin()` in `src/lib/db.ts` creates one admin from `BOOTSTRAP_ADMIN_EMAIL`/`BOOTSTRAP_ADMIN_PASSWORD` env vars the first time any login is attempted while the `users` table is empty. Must be set in Doppler for the first login to work. `AUTH_SECRET` is also required (NextAuth v5).
- **Per-user track assignment (full block):** `users.track` (`"managers" | "devops" | null`) is set by an admin in `UserManagement` and required when creating a new user. It rides in the JWT/session (`session.user.track`, populated in `src/auth.ts` callbacks, typed in `src/types/next-auth.d.ts`). `src/proxy.ts` redirects a non-admin employee to `/` if they request `/track/<other-track>*`; the home dashboard (`src/app/page.tsx`) filters `TRACKS` to only the assigned one for non-admins. `role === "admin"` or `track === null` means unrestricted (sees/enters both tracks) — bootstrap admins get `track = null` by default.
- **15-minute idle logout:** `src/auth.ts` sets `session.maxAge = 900s`, `updateAge = 60s` (JWT hard-expires 15 min after last refresh). `src/components/auth/IdleLogout.tsx` (mounted in `SessionProviderWrapper`, so on every page) tracks real user activity (mousemove/keydown/click/scroll/touchstart): on activity it resets a 15-minute client timer and, throttled to once/60s, pings `/api/auth/session` so NextAuth silently reissues the cookie for active learners. True inactivity triggers an explicit client-side `signOut()`; the server-side JWT expiry is the fallback if the client timer never fires (tab frozen, etc).
- **Progress/locking is DB-only, never client-trusted:** `src/lib/track-progress.ts` (`getTrackProgress()`) computes per-user completion from `submissions.user_id`, never from localStorage or client state. `src/app/track/<track>/[slug]/page.tsx` redirects to the first incomplete module if `currentIndex > firstIncompleteIndex(...)`, enforced server-side on every request, so a learner cannot open a later module by URL. All `/track/*` pages are `force-dynamic` for this reason (SSG removed on purpose).
- **Admin browse-without-lock:** `role === "admin"` is exempt from the sequential-lock redirect on `[slug]` pages (`isLocked && !isAdmin` gates the redirect) and from the locked/greyed rendering in `TrackLevelList` (`isAdmin` prop forces `nextIndex = modules.length`). An admin can open any module by URL or from the track list, but a module still ahead of their own actual progress renders a view-only notice instead of `QuizForm`/`DeliverableForm`, so they can review content without being able to submit answers for it.
- **Level/track badges:** `src/components/badges/LevelBadge.tsx` (per-level, status locked/in-progress/earned) and `TrackCompletionBadge.tsx` (large badge at 100% track completion), driven entirely by `TrackProgress.byLevel`/`isComplete` from `track-progress.ts`, no separate "badge earned" DB rows.
- **Accessibility (IS 5568 / WCAG 2.0 AA):** `src/components/a11y/AccessibilityWidget.tsx` mounted once in `src/app/layout.tsx`, on every page. Floating button (bottom-left) opens a menu with text size, contrast, link-underline, reduced-motion, and readable-font toggles, each applying an `a11y-*` class on `<html>` (CSS in `globals.css`) and persisted to `localStorage`; a keyboard-only skip-link jumps to the page's `<main>`/`<h1>`. `/accessibility` (`src/app/accessibility/page.tsx`) is the legally required accessibility statement page, linked from the widget menu. Zero visual impact until a visitor opens the menu.

## Content Convention (MDX frontmatter, current quiz-based model)
```yaml
id: "l1-m1-slug"
track: "managers" | "devops"
level: 1
title: "כותרת בעברית"
order: N
badge: "badge-slug"
estimatedTime: "X שעות"
questions:
  - text: "שאלה שדורשת ביצוע המשימה בפועל כדי לענות"
  # exactly 10 questions, always
```
No `rubric`/deliverable field on new content: replaced by the 10-question quiz model, scored via `scoreQuiz()`. `Track` type is narrowed to `"managers" | "devops"` (cloud-pm track removed).

## Naming
- `camelCase` for TS variables/functions
- `PascalCase` for components
- `kebab-case` for file names and module slugs

## CSS Variables (palette)
```css
--cream: #faf7f2        /* page background */
--cream-dark: #f2ece0   /* card alt background */
--mocha: #7c5c3e        /* primary accent */
--mocha-dark: #4a3728   /* headings */
--mocha-light: #a07850  /* secondary accent */
--text-primary: #2c1f14
--text-secondary: #6b5240
--text-muted: #a08878
--border: #e0d4c4
--surface: #ffffff
```

## Tracks Status
| Track | Status | Modules |
|-------|--------|---------|
| managers | 🟢 Complete | 44 modules (L1: 8, L2: 10, L3: 12, L4: 14) |
| devops | 🟢 Complete | 44 modules (L1: 8, L2: 10, L3: 12, L4: 14) |
