# GenAI: From Zero to Hero: CLAUDE.md

## Project Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties (mocha/cream palette)
- **Content:** MDX files in `content/<track>/` with gray-matter frontmatter
- **DB:** Neon Postgres via `@neondatabase/serverless`
- **Scoring:** Azure OpenAI gpt-4o (lazy client init, never at module level)
- **Secrets:** Doppler project `genai-zero-to-hero` config `prd`
- **Hosting:** Vercel (auto-deploy on git push)

## Directory Structure
```
content/<track>/<module>.mdx   ← course content (WHAT/RESOURCES/TOOLS/DELIVERABLE/SCORING)
src/app/track/<track>/         ← learner-facing pages
src/app/admin/                 ← admin dashboard (force-dynamic)
src/app/api/submit/            ← submission + async scoring
src/lib/db.ts                  ← Neon queries (lazy init)
src/lib/scorer.ts              ← Azure OpenAI scoring (lazy init)
src/lib/modules.ts             ← MDX file reader
src/components/ui/MdxTable.*   ← custom MDX table components
src/components/ui/ScoringTable.* ← admin score breakdown
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

## Critical Patterns
- **Lazy init:** `neon()` and `AzureOpenAI()` must be inside functions, never at module level (breaks Vercel build)
- **MDX tables:** require `remarkGfm` plugin in `MDXRemote options.mdxOptions.remarkPlugins`
- **RTL:** `dir="rtl" lang="he"` on `<html>`, `unicode-bidi: plaintext` on text elements, code/pre stay `dir="ltr"`
- **Admin page:** must have `export const dynamic = "force-dynamic"`
- **Scoring:** async fire-and-forget: learner gets badge immediately, score arrives in background

## Content Convention (MDX frontmatter)
```yaml
id: "module-N"
track: "managers" | "devops"
title: "כותרת בעברית"
order: N
badge: "badge-slug"
estimatedTime: "X-Y דקות"
rubric:
  - criterion: "שם"
    description: "תיאור"
    weight: 40
```

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
