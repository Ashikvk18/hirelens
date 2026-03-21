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
- [ ] Phase 3: Build analyzer page UI (resume input, JD input, results panel)
- [ ] Phase 4: Implement analysis logic (keyword matching, scoring)
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
