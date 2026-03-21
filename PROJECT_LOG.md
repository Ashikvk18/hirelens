# HireLens — Project Log

## Overview
**HireLens** is an AI-powered job intelligence platform for Truman State University students. It analyzes resumes against job descriptions and provides match scores, missing keywords, weak sections, rejection risk, AI suggestions, and recruiter outreach help.

---

## Phase 1: Project Initialization ✅
**Date:** 2026-03-21

### What was built
- Next.js 16 project with App Router, TypeScript, Tailwind CSS v4
- ShadCN-style UI component system (Button component with variants)
- Framer Motion for animations
- Lucide React for icons
- Clean folder structure

### Tech used
- Next.js 16 (App Router)
- Tailwind CSS v4 (with `@tailwindcss/postcss`)
- TypeScript
- Framer Motion
- Lucide React
- class-variance-authority, clsx, tailwind-merge (for component utilities)

### Folder structure
```
HireLens/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + custom theme (dark mode)
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Landing page (home)
│   │   └── analyze/
│   │       └── page.tsx         # Analyzer page (placeholder)
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx       # Reusable Button component (CVA variants)
│   │   └── landing/
│   │       ├── navbar.tsx       # Fixed navbar with mobile menu
│   │       ├── hero.tsx         # Hero section with gradient effects
│   │       ├── features.tsx     # 6-card feature grid
│   │       ├── how-it-works.tsx # 3-step explainer
│   │       ├── cta.tsx          # Call-to-action section
│   │       └── footer.tsx       # Minimal footer
│   └── lib/
│       └── utils.ts             # cn() utility
├── .env.example
├── .gitignore
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── PROJECT_LOG.md
```

### Key decisions
- **Tailwind v4** with `@theme` directive for custom design tokens (dark UI)
- **No ShadCN CLI** — components built manually for full control and less bloat
- **Color system:** Deep purple primary (#6d28d9), dark zinc background (#09090b)
- **Mobile-first** responsive design throughout

### What is working
- Landing page with all sections (navbar, hero, features, how-it-works, CTA, footer)
- Dark modern UI with gradient effects and smooth animations
- Mobile responsive with hamburger menu
- Navigation to /analyze route
- Dev server running on localhost:3000

### What is pending
- [x] Phase 3: Build analyzer page UI (resume input, JD input, results panel)
- [x] Phase 4: Implement analysis logic (keyword matching, scoring)
- [ ] Phase 5: AI features (resume suggestions, outreach generation)
- [ ] Phase 6: Supabase integration (save sessions, optional auth)

---

## Phase 2: Landing Page ✅
**Date:** 2026-03-21

### What was built
- **Navbar:** Fixed top bar with logo, nav links, CTA button, animated mobile menu
- **Hero:** Full-height section with gradient background blurs, badge, headline with gradient text, dual CTA buttons, social proof line
- **Features:** 6-card grid with icons — Match Score, Missing Keywords, Weak Sections, Rejection Risk, AI Suggestions, Outreach Helper
- **How It Works:** 3-step visual flow with icons and connector lines
- **CTA:** Gradient card with glow effect and action button
- **Footer:** Minimal with logo and GitHub link

### Design
- Premium dark UI with purple accent palette
- Subtle background blur gradients
- Staggered Framer Motion animations on scroll
- Fully responsive (mobile hamburger menu, stacked layouts)

---

## Phase 3 & 4: Analyzer Page UI + Analysis Logic ✅
**Date:** 2026-03-21

### What was built
- **Analyzer Page** (`/analyze`) — full interactive resume analysis tool
- **AnalyzerForm** — two-panel layout: resume + JD inputs (left), results (right)
- **ResultsPanel** — displays all analysis results with animated sections
- **ScoreRing** — animated SVG circular progress indicator for match score
- **Analysis Engine** (`lib/analyzer.ts`) — keyword extraction, scoring, weak section detection, rejection risk calculation

### New UI components
- `Textarea` — styled textarea with focus ring and dark theme
- `Badge` — multi-variant badge (default, success, warning, destructive, outline)
- `Progress` — animated progress bar with custom indicator color

### Analysis engine features
- **Keyword extraction** across 7 categories: programming, frameworks, cloud, data, databases, soft skills, general
- **Match scoring** — ratio of matched keywords + structure bonus
- **Weak section detection** — checks for education, experience, skills, projects, quantified achievements, action verbs
- **Rejection risk** — composite score from missing keyword ratio + critical weak sections
- **Improvement suggestions** — auto-generated based on gaps found

### Updated folder structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   └── analyze/
│       └── page.tsx                # Analyzer page (full UI)
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   └── progress.tsx
│   ├── landing/
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   └── analyzer/
│       ├── analyzer-form.tsx       # Main form with inputs + state management
│       ├── results-panel.tsx       # Full results display (keywords, risk, suggestions)
│       └── score-ring.tsx          # Animated circular score indicator
└── lib/
    ├── utils.ts
    ├── types.ts                    # AnalysisResult, WeakSection, RejectionRisk types
    └── analyzer.ts                 # Core analysis engine (keyword matching, scoring)
```

### Key decisions
- **Client-side analysis** for Phase 4 — instant results, no API needed, zero latency
- **Animated score ring** with color coding (green/amber/red) for immediate visual feedback
- **Staggered card animations** in results for polished feel
- **Input validation** with error messages (min length checks)
- **Loading state** with 1.2s simulated delay for better UX perception

### What is working
- Full end-to-end flow: paste resume + JD → analyze → see results
- Match score with animated ring
- Keyword analysis (found vs missing)
- Rejection risk with progress bar and reasons
- Weak section detection with severity badges
- AI improvement suggestions
- Reset functionality
- Responsive layout (stacked on mobile, side-by-side on desktop)

### What is pending
- [x] Phase 5: AI features (LLM-powered resume rewriting, outreach messages)
- [ ] Phase 6: Supabase integration (save sessions, optional auth)

---

## Phase 5: AI Features (Groq + Llama 3) ✅
**Date:** 2026-03-21

### What was built
- **Groq API integration** using `groq-sdk` with Llama 3.3 70B Versatile model
- **AI Suggestions API** (`/api/ai/suggestions`) — generates 5 personalized resume improvement suggestions
- **Outreach Generator API** (`/api/ai/outreach`) — generates LinkedIn connection request + recruiter email
- **AISuggestions component** — expandable accordion with copy-to-clipboard, loading states, error handling, regenerate
- **OutreachGenerator component** — LinkedIn + Email message cards with copy buttons

### Tech used
- Groq SDK (Llama 3.3 70B Versatile)
- Next.js API Routes (App Router)
- Server-side API key handling (never exposed to client)

### API routes
- `POST /api/ai/suggestions` — accepts resume, JD, missing keywords, weak sections → returns 5 AI suggestions
- `POST /api/ai/outreach` — accepts resume, JD, match score → returns LinkedIn + email messages

### Key decisions
- **Groq over OpenAI** — free tier, sub-second inference, perfect for hackathon demos
- **Llama 3.3 70B** — best quality on Groq's free tier
- **Server-side only** — API key stays in `.env.local`, never sent to browser
- **Graceful degradation** — AI features are additive; core analysis works without API key
- **JSON extraction** — regex-based JSON parsing from LLM output for reliability
- **Copy to clipboard** — one-click copy on all AI-generated content

### New files
```
src/
├── app/api/ai/
│   ├── suggestions/route.ts     # AI resume suggestions endpoint
│   └── outreach/route.ts        # AI outreach message endpoint
├── components/analyzer/
│   ├── ai-suggestions.tsx       # Expandable AI suggestions panel
│   └── outreach-generator.tsx   # LinkedIn + Email message generator
```

### What is working
- Full analysis flow with local engine (no API key needed)
- AI suggestions button appears after analysis (requires GROQ_API_KEY)
- Outreach message generation (requires GROQ_API_KEY)
- Copy-to-clipboard on all AI content
- Error handling + retry for API failures
- Loading states for AI requests

### What is pending
- [x] Phase 6: Supabase integration (save sessions, optional auth)

### Setup required
To enable AI features, the user must:
1. Go to https://console.groq.com/keys
2. Create a free API key
3. Create `.env.local` in the project root with: `GROQ_API_KEY=gsk_your_key_here`
4. Restart the dev server

---

## Phase 6: Supabase Integration (Auth + Sessions) ✅
**Date:** 2026-03-21

### What was built
- **Supabase client setup** — browser client (`@supabase/ssr`) + server client for API routes
- **Auth system** — email/password + GitHub OAuth sign-in/sign-up
- **AuthProvider** — React context wrapping the entire app, provides `user`, `loading`, `signOut`
- **AuthModal** — polished modal with email form + GitHub OAuth button, sign-in/sign-up toggle
- **UserMenu** — shows sign-in button when logged out, user email + history link + sign-out when logged in
- **Middleware** — refreshes Supabase auth sessions on every request
- **Session saving** — "Save" button appears after analysis (only when signed in), saves full results to Supabase
- **History page** (`/history`) — lists saved sessions with match score, risk level, keyword counts, date, delete
- **Delete session** — per-session delete with confirmation

### Database schema
- `analysis_sessions` table with RLS (Row Level Security)
- Users can only read/write/delete their own sessions
- Indexed on `user_id` and `created_at`

### API routes
- `POST /api/sessions` — save a new analysis session
- `GET /api/sessions` — get user's analysis history (latest 20)
- `DELETE /api/sessions/[id]` — delete a specific session
- `GET /auth/callback` — OAuth callback handler

### New files
```
src/
├── middleware.ts                      # Supabase auth session refresh
├── lib/supabase/
│   ├── client.ts                     # Browser Supabase client
│   └── server.ts                     # Server-side Supabase client
├── components/auth/
│   ├── auth-provider.tsx             # Auth context + useAuth hook
│   ├── auth-modal.tsx                # Sign-in/sign-up modal
│   └── user-menu.tsx                 # User controls in header
├── app/
│   ├── auth/callback/route.ts        # OAuth callback
│   ├── api/sessions/route.ts         # Save + list sessions
│   ├── api/sessions/[id]/route.ts    # Delete session
│   └── history/page.tsx              # Session history page
supabase/
└── schema.sql                        # Database schema (run in SQL Editor)
```

### Key decisions
- **@supabase/ssr** over `@supabase/auth-helpers-nextjs` — official recommended approach for App Router
- **RLS policies** — security at the database level, not just API level
- **Save is optional** — analysis works without auth, save button only appears when signed in
- **Graceful degradation** — entire app works without Supabase if env vars are missing

### What is working
- Email/password authentication (sign up, sign in, sign out)
- GitHub OAuth (if configured in Supabase dashboard)
- Save analysis sessions after running analysis
- View session history at /history
- Delete individual sessions
- Auth state persists across page reloads
- All pages responsive and mobile-friendly

### What is pending
- [ ] Polish UI + final touches
- [ ] Vercel deployment
