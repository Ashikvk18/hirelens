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
- [x] File upload + AI resume rewriter
- [ ] Polish UI + final touches
- [ ] Vercel deployment

---

## Bugfix: White Screen on Next.js 16
**Date:** 2026-03-21

### Root cause
- `middleware.ts` is deprecated in Next.js 16 — was blocking client-side hydration
- Cross-origin HMR was blocked by default in Next.js 16

### Fixes applied
- Deleted `src/middleware.ts`
- Added `allowedDevOrigins` to `next.config.ts`
- Fixed `AuthProvider` with `useMemo` for stable Supabase client + error handling
- Temporarily removed `AuthProvider` from root layout (can re-add with error boundary later)

---

## Feature: File Upload + AI Resume Rewriter ✅
**Date:** 2026-03-21

### What was built
- **File Upload component** — drag-and-drop or browse for PDF, DOCX, TXT files (max 5MB)
- **Parse Resume API** (`/api/parse-resume`) — server-side file parsing using `pdf-parse` + `mammoth`
- **AI Resume Rewriter API** (`/api/ai/rewrite`) — generates 3 different rewrite versions via Groq Llama 3.3
- **Resume Rewriter UI** — tabbed selector with 3 versions, copy-to-clipboard, regenerate button

### Rewrite versions
1. **Keyword-Optimized** — maximizes keyword matches while keeping content authentic
2. **Achievement-Focused** — rewrites bullets to emphasize measurable impact and results
3. **Skills-Forward** — reorganizes to lead with a skills summary mirroring job requirements

### New dependencies
- `pdf-parse` — PDF text extraction
- `mammoth` — DOCX text extraction

### New files
```
src/
├── app/api/
│   ├── parse-resume/route.ts        # PDF/DOCX/TXT → text extraction
│   └── ai/rewrite/route.ts          # AI resume rewriter (3 versions)
├── components/analyzer/
│   ├── file-upload.tsx               # Drag-and-drop file upload
│   └── resume-rewriter.tsx           # 3-tab rewrite selector with copy
```

### User flow
1. Upload resume (PDF/DOCX/TXT) OR paste text
2. Paste job description
3. Click "Analyze Match" → see results
4. Click "Generate Rewritten Resumes" → get 3 AI-rewritten versions
5. Select preferred version → copy to clipboard

### What is pending
- [ ] Polish UI + final touches
- [ ] Vercel deployment

---

## Bugfix: PDF Parsing Failure
**Date:** 2026-03-21

### Root cause
- `pdf-parse` v2 has a completely different API (class-based `PDFParse`) — not the simple function from v1
- `pdfjs-dist` also failed because `GlobalWorkerOptions.workerSrc` cannot be set to empty string in server-side Node.js

### Fix applied
- Replaced both with **`unpdf`** — a lightweight, server-friendly PDF text extractor that works out of the box
- `POST /api/parse-resume` now uses `extractText()` from `unpdf`

### Dependencies changed
- Removed: `pdf-parse`, `pdfjs-dist`
- Added: `unpdf`

### Status
- PDF upload ✅ working
- DOCX upload ✅ working (mammoth)
- TXT upload ✅ working

---

## Feature: Personalized Job Board + User Profiles ✅
**Date:** 2026-03-21

### What was built

#### User Authentication (re-enabled)
- `AuthProvider` restored in root layout
- Sign In / Sign Up modal in navbar with GitHub OAuth + email/password
- Auth state available across all pages

#### User Profile System
- **Profile page** (`/profile`) — full setup form with:
  - Personal info (name, email)
  - Education (university, major, degree level, graduation year)
  - Skills (tag input + popular skill suggestions)
  - Job preferences (experience level, job type, preferred roles, preferred locations)
- **Profile API** (`/api/profile`) — GET/POST with Supabase upsert
- **Supabase table** `user_profiles` with RLS policies

#### Personalized Job Board
- **Jobs page** (`/jobs`) — personalized job listings powered by JSearch (RapidAPI)
- Real job postings from LinkedIn, Indeed, Glassdoor, etc.
- Each job card shows:
  - Job title, company name, company logo
  - Location + remote badge
  - Posted date (e.g. "2 days ago")
  - Estimated applicant count
  - Salary range (when available)
  - Job type tag + publisher source + required skills
- **Click any job → opens the apply page** on the original platform
- Search bar with keyword + location inputs
- Date filter (Today, 3 days, This week, This month, All time)
- Refresh button to fetch latest jobs
- Pre-fills search from user's profile (preferred roles + locations)

#### Navigation Updates
- Navbar shows **Jobs** and **Profile** links when signed in
- Shows **Sign In** button when signed out
- Sign Out button for logged-in users
- Mobile menu updated with all new links

### New files
```
src/
├── app/
│   ├── profile/page.tsx              # User profile setup page
│   ├── jobs/page.tsx                 # Personalized job board
│   └── api/
│       ├── profile/route.ts          # Profile GET/POST API
│       └── jobs/route.ts             # JSearch job listings API
```

### New dependencies
- JSearch API via RapidAPI (`RAPIDAPI_KEY` env var)

### User flow
1. Land on homepage → click **Sign In** → create account
2. Redirected to **Profile** → fill in major, skills, preferred roles & locations
3. Click **View Jobs** → see personalized job listings
4. Click any job → opens apply page on LinkedIn/Indeed/Glassdoor
5. Use search bar + filters to refine results
6. Hit refresh to get latest postings

### What is pending
- [ ] Polish UI + final touches
- [ ] Vercel deployment

---

## Feature: Application Tracking + Forced Profile Setup ✅
**Date:** 2026-03-21

### What was built

#### Forced Profile Setup
- After sign-up, users must complete their profile before accessing Jobs or Applications
- `/jobs` page redirects to `/profile` if no profile exists
- Sign-up email redirect goes to `/profile` page

#### Application Tracking System
- **Apply & Track modal** on job board — when clicking Apply:
  1. Modal opens asking for resume text (optional)
  2. Saves application to Supabase with job details + resume used
  3. Opens the job posting in a new tab
  4. Job card shows green "Applied" badge
  5. "Skip Tracking" option to just open the link without saving
- **Applications dashboard** (`/applications`) with:
  - Stats bar: Total, Applied, Interviewing, Offered, Rejected
  - Filter tabs by status
  - Expandable cards showing:
    - Status updater (Applied → Interviewing → Offered → Rejected → Withdrawn)
    - Resume text used for that specific application
    - Notes field (auto-saves on blur)
    - Link to original job posting
    - Delete option

#### Navigation
- Navbar (desktop + mobile) now shows: Jobs, Applications, Profile, Sign Out
- Jobs page header shows Applications link with count badge

### New files
```
src/
├── app/
│   ├── applications/page.tsx             # Application tracker dashboard
│   └── api/
│       ├── applications/route.ts         # GET/POST applications
│       └── applications/[id]/route.ts    # PATCH/DELETE individual application
```

### Database
- New `job_applications` table with RLS policies
- Columns: job_id, job_title, company, logo, location, type, apply_link, publisher, salary, resume_text, status, notes, applied_at

### User flow
1. Sign up → forced to set up profile first
2. Browse jobs → click Apply → paste resume (optional) → Apply & Track
3. Job opens in new tab, application saved to tracker
4. Go to Applications → see all tracked jobs with statuses
5. Update status as you progress (Applied → Interviewing → Offered)
6. Add notes per application, view which resume was used

---

## Feature: Hiring Contact Finder ✅
**Date:** 2026-03-21

### What was built

#### Contact Finder (Hunter.io Integration)
- **Find Contacts** button on every job card (person-search icon)
- Clicking it opens a modal that queries Hunter.io for emails at that company
- Prioritizes HR/recruiting department contacts
- Falls back to all departments if no HR contacts found
- Each contact card shows:
  - Name, position, department, seniority
  - Confidence score (color-coded: green ≥80%, yellow ≥50%, red <50%)
  - Clickable email link (opens mailto:)
  - LinkedIn profile link (if available)
  - Phone number (if available)

### New files
```
src/app/api/contacts/route.ts   # Hunter.io domain-search API integration
```

### Modified files
```
src/app/jobs/page.tsx            # Added contact finder button + modal
.env.example                     # Added HUNTER_API_KEY
```

### Setup required
- Get a free Hunter.io API key at https://hunter.io/api-keys
- Add `HUNTER_API_KEY=your_key_here` to `.env.local`
- Free tier: 25 searches/month

---

## Feature: Interview Prep + Skills Roadmap ✅
**Date:** 2026-03-21

### What was built

#### Interview Preparation (`/interview-prep`)
- AI-powered interview question generator using Groq LLM
- Categorized Q&A: Behavioral, Technical, Situational, Role-Specific
- Each question has a **tip** and **sample answer**
- "Questions to Ask" section with smart interviewer questions
- General interview tips
- Custom search: enter any job title + company to generate fresh questions
- Accessible from every job card via "Interview Prep" button

#### Skills Gap & Roadmap (`/skills-roadmap`)
- AI analyzes gap between user's profile skills and job requirements
- **Gap Analysis**: missing skills (prioritized: critical/important/nice-to-have) + existing strengths
- **Learning Roadmap**: 3-4 phased learning plan with tasks, real resources, and durations
- **Portfolio Projects**: 3 project ideas with difficulty ratings and skill tags
- **Certifications**: recommended certs with provider, cost, and links
- **Timeline**: estimated weeks and hours/week
- Pulls user skills from saved profile automatically
- Accessible from every job card via "Skills Roadmap" button

### New files
```
src/
├── app/
│   ├── interview-prep/page.tsx           # Interview prep UI (tabbed Q&A)
│   ├── skills-roadmap/page.tsx           # Skills gap + roadmap UI
│   └── api/
│       ├── interview-prep/route.ts       # Groq AI interview question generation
│       └── skills-roadmap/route.ts       # Groq AI skills analysis + roadmap
```

### Modified files
```
src/app/jobs/page.tsx                     # Added Interview Prep + Skills Roadmap buttons per job card
```

---

## UI Overhaul ✅
**Date:** 2026-03-21

### Changes
- **Color palette**: Darker background (#050507), richer purples (#7c3aed primary)
- **Navbar**: Gradient logo, compact nav pills, avatar dropdown with email display
- **Hero**: Dot grid texture, 3 gradient orbs, stat chips (Match Scoring, AI Analysis, Jobs)
- **Features**: Individual colored icon glows, gradient hover cards
- **How It Works**: Floating step number badges, card-based layout
- **CTA**: Dual gradient orbs, grid overlay, "No sign-up required" badge
- **Footer**: Matching gradient logo, navigation links
- **Internal pages**: Consistent glassmorphism headers (`bg-background/70 backdrop-blur-2xl`)
- **Globals**: `.bg-grid` dot texture, `.glow-sm/.glow-md` utilities, custom selection color
