## Inspiration

Every semester, thousands of college students submit hundreds of job applications with zero feedback. We watched friends spend hours tailoring resumes, only to hear nothing back. The reality is brutal — over 75% of resumes are filtered out by Applicant Tracking Systems before a human ever sees them. We asked ourselves: what if students could see their resume the way a recruiter's software does? That question became HireLens.

## What it does

HireLens is an AI-powered job intelligence platform that gives students instant, actionable resume feedback. Paste your resume and a job description, and within seconds you get:

- A **match score** with a visual breakdown
- **Keyword analysis** showing what's present and what's missing
- A **skills radar chart** mapping coverage across categories like languages, frameworks, cloud, and databases
- A **rejection risk gauge** estimating ATS filtering likelihood
- A **resume completeness checker** flagging missing sections
- **AI-powered resume rewriting** tailored to the specific job
- A **cover letter generator** with tone selection
- **Interview prep** with role-specific technical and behavioral questions
- A **skills roadmap** with personalized learning paths

## How we built it

We built HireLens on **Next.js 16** with **React 19** and **TypeScript**, using **Tailwind CSS** for styling and **Framer Motion** for animations — including custom mouse-reactive 3D parallax backgrounds. The AI features are powered by **Groq** running **LLaMA 3.3 70B**, which handles cover letter generation, interview prep, resume rewriting, and skills roadmaps. **Supabase** provides authentication (email + GitHub OAuth) and database storage. Data visualizations use **Recharts** for the radar chart and donut gauge. The app is deployed on **Render** with full CI/CD from GitHub.

We wrote **99 unit and integration tests** using **Jest** covering the resume analyzer, API routes, auth callback, motion variants, and utility functions.

## Challenges we ran into

- **ATS keyword matching** — Building a reliable keyword extraction system that handles acronyms, multi-word skills like "machine learning", and framework names like "Node.js" required careful categorization across 7 skill categories with 120+ terms.
- **Deployment redirects** — Render's reverse proxy serves the app on an internal `localhost:10000`, which broke our OAuth callback redirects. We had to implement origin resolution using `x-forwarded-host` headers with environment variable fallbacks.
- **Next.js 16 Suspense boundaries** — Pages using `useSearchParams` required wrapping in `<Suspense>` boundaries, which wasn't immediately obvious from the build errors.
- **AI response parsing** — LLM outputs are unpredictable. We built robust JSON extraction with regex matching and graceful fallbacks for when the model returns plain text instead of structured data.

## Accomplishments that we're proud of

- The **skills radar chart** — seeing your skill coverage mapped visually across categories makes the analysis feel like a real product, not a hackathon demo.
- **99 passing tests** — comprehensive test coverage across the entire backend, from the core analyzer to API routes to auth flows.
- A polished, **production-grade UI** with smooth animations, dark theme, and responsive design that works on every screen size.

## What we learned

- How to build and deploy a full-stack AI application end-to-end in a short timeframe
- Prompt engineering for structured JSON output from LLMs
- The importance of handling edge cases in authentication flows across deployment environments
- Data visualization design — choosing the right chart type to communicate complex analysis results at a glance

## What's next for HireLens

- **PDF resume upload** with automatic text extraction
- **Semantic similarity scoring** using embeddings instead of keyword matching
- **Historical analysis trends** so users can track resume improvement over time
- **Side-by-side resume diff view** showing original vs. AI-suggested rewrites
- **ATS keyword heatmap** highlighting matches directly on the resume text
