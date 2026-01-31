# Tasks: Shadow Rank – Solo Leveling Career Awakening Platform

## Relevant Files

- `src/app/layout.tsx` - Root layout with dark theme, fonts, and providers
- `src/app/page.tsx` - Landing page with hero section and upload CTA
- `src/app/dashboard/page.tsx` - Main dashboard after awakening
- `src/app/api/auth/callback/route.ts` - GitHub OAuth callback handler
- `src/app/api/parse-resume/route.ts` - Resume upload and Reducto parsing
- `src/app/api/awaken/route.ts` - AI rank + quest generation endpoint
- `src/app/api/verify-github/route.ts` - GitHub repo verification endpoint
- `src/app/api/generate-quest/route.ts` - Next quest generation endpoint
- `src/components/ui/RankBadge.tsx` - Rank display component with glow effects
- `src/components/ui/XPProgressBar.tsx` - XP progress bar component
- `src/components/ui/QuestCard.tsx` - Main quest display and submission form
- `src/components/ui/SkillTree.tsx` - Skill tree grid with locked/unlocked states
- `src/components/ui/DebuggingDungeon.tsx` - Modal with JS challenge and code editor
- `src/components/ui/ResumeUpload.tsx` - PDF upload dropzone component
- `src/components/ui/RankUpAnimation.tsx` - Confetti and celebration animation
- `src/lib/supabase/client.ts` - Supabase browser client
- `src/lib/supabase/server.ts` - Supabase server client
- `src/lib/supabase/middleware.ts` - Auth middleware for protected routes
- `src/lib/ai/prompts.ts` - AI prompts for awakening and quest generation
- `src/lib/challenges/debugging.ts` - 5-10 pre-written JS debugging challenges
- `src/lib/utils/github.ts` - GitHub API helper functions
- `src/lib/utils/xp.ts` - XP calculations and rank thresholds
- `src/types/index.ts` - TypeScript types (User, Quest, Skill, Challenge)
- `supabase/migrations/001_initial_schema.sql` - Database schema migration
- `tailwind.config.ts` - Tailwind config with custom colors and animations
- `.env.local` - Environment variables (API keys)

### Notes

- This is a 12-hour hackathon MVP – prioritize working features over perfection
- Use Supabase CLI or dashboard for migrations if time is short
- Debugging challenges execute client-side only – no server needed
- Test the full flow frequently: upload → awaken → quest → verify → level up

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (`git checkout -b feature/shadow-rank-mvp`)

- [ ] 1.0 Project Setup & Configuration
  - [ ] 1.1 Initialize Next.js 14+ project with App Router (`npx create-next-app@latest shadow-rank --typescript --tailwind --eslint --app --src-dir`)
  - [ ] 1.2 Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `canvas-confetti`, `lucide-react`
  - [ ] 1.3 Create `.env.local` with placeholders for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `REDUCTO_API_KEY`, `OPENAI_API_KEY` (or `GROQ_API_KEY`)
  - [ ] 1.4 Configure `tailwind.config.ts` with custom dark theme colors (#0a0a0f background, #8b5cf6 purple accent) and glow animations
  - [ ] 1.5 Set up basic folder structure: `src/components/ui`, `src/lib`, `src/types`
  - [ ] 1.6 Create `src/types/index.ts` with TypeScript interfaces for `User`, `Quest`, `Skill`, `Challenge`, `AwakeningResult`

- [ ] 2.0 Supabase Setup (Auth + Database)
  - [ ] 2.1 Create Supabase project and obtain URL + anon key
  - [ ] 2.2 Enable GitHub OAuth provider in Supabase Auth settings (add GitHub OAuth app credentials)
  - [ ] 2.3 Create database schema with tables: `profiles` (id, github_id, username, avatar_url, rank, xp, current_quest, resume_data, created_at, updated_at)
  - [ ] 2.4 Create `skills` table (id, user_id FK, skill_name, level, xp)
  - [ ] 2.5 Create `quest_history` table (id, user_id FK, quest_title, quest_description, completed_at)
  - [ ] 2.6 Enable Row Level Security (RLS) on all tables with policies for authenticated users
  - [ ] 2.7 Create `src/lib/supabase/client.ts` – browser client initialization
  - [ ] 2.8 Create `src/lib/supabase/server.ts` – server client for API routes
  - [ ] 2.9 Create `src/lib/supabase/middleware.ts` and update `middleware.ts` for auth session refresh
  - [ ] 2.10 Create auth callback route `src/app/api/auth/callback/route.ts` to handle GitHub OAuth redirect

- [ ] 3.0 Landing Page & Layout
  - [ ] 3.1 Update `src/app/layout.tsx` with dark theme body styles, custom font (Inter or similar), and metadata
  - [ ] 3.2 Create landing page `src/app/page.tsx` with hero section: title "Awaken Your Career", tagline, Solo Leveling-inspired background
  - [ ] 3.3 Add "Sign in with GitHub" button that triggers Supabase OAuth flow
  - [ ] 3.4 Add conditional redirect: if user is already authenticated, redirect to `/dashboard`
  - [ ] 3.5 Style with purple accents, shadow effects, and dark aesthetic

- [ ] 4.0 Resume Upload & Parsing
  - [ ] 4.1 Create `src/components/ui/ResumeUpload.tsx` – drag-and-drop PDF upload zone with file validation
  - [ ] 4.2 Create `src/app/api/parse-resume/route.ts` – accepts PDF, calls Reducto API, returns parsed text/structured data
  - [ ] 4.3 Handle Reducto API errors gracefully – return error response with retry suggestion
  - [ ] 4.4 Create GitHub profile fallback: if parsing fails, show option to use GitHub profile data
  - [ ] 4.5 Create `src/lib/utils/github.ts` with function to fetch user's GitHub profile, repos, and languages via GitHub API
  - [ ] 4.6 Store parsed resume data (or GitHub fallback data) in component state for awakening step

- [ ] 5.0 AI Awakening System (Rank + Quest Generation)
  - [ ] 5.1 Create `src/lib/ai/prompts.ts` with few-shot prompt templates for rank assignment and quest generation
  - [ ] 5.2 Define rank criteria in prompt: E (beginner, no projects), D (some experience), C (mid-level), B (senior), A (expert)
  - [ ] 5.3 Create `src/app/api/awaken/route.ts` – receives parsed data, calls OpenAI/Groq, returns `{ rank, gaps, quest }`
  - [ ] 5.4 Quest generation must require GitHub repo submission (hardcoded in prompt instructions)
  - [ ] 5.5 On successful awakening, save user profile to Supabase `profiles` table with rank, xp=0, current_quest
  - [ ] 5.6 Initialize user's Debugging skill in `skills` table (level=1, xp=0)
  - [ ] 5.7 Handle AI API errors – return fallback mock data for demo resilience

- [ ] 6.0 Dashboard Core UI
  - [ ] 6.1 Create `src/app/dashboard/page.tsx` – protected route (redirect to landing if not authenticated)
  - [ ] 6.2 Fetch user profile and skills from Supabase on page load
  - [ ] 6.3 Create `src/components/ui/RankBadge.tsx` – large rank letter (E/D/C/B/A) with purple glow effect and shadow
  - [ ] 6.4 Create `src/components/ui/XPProgressBar.tsx` – animated progress bar showing XP toward next rank
  - [ ] 6.5 Create `src/lib/utils/xp.ts` with rank thresholds (E→D: 100 XP, D→C: 250 XP, C→B: 500 XP, B→A: 1000 XP)
  - [ ] 6.6 Create `src/components/ui/QuestCard.tsx` – displays quest title, description, GitHub URL input, and submit button
  - [ ] 6.7 Create `src/components/ui/SkillTree.tsx` – CSS grid showing 5 skills (Debugging unlocked, others locked/grayed)
  - [ ] 6.8 Assemble dashboard layout: Rank badge (top), Quest card (center), Skill tree (bottom)
  - [ ] 6.9 Add "Enter Debugging Dungeon" button on Debugging skill that opens modal

- [ ] 7.0 Main Quest System & GitHub Verification
  - [ ] 7.1 Create `src/app/api/verify-github/route.ts` – validates GitHub repo URL format, calls GitHub API to check repo exists
  - [ ] 7.2 Implement verification logic: check if repo is public (200 response), check `pushed_at` for recency bonus
  - [ ] 7.3 Block duplicate repo submissions (check against `quest_history` for same user)
  - [ ] 7.4 On successful verification: calculate XP gain (base + recency bonus), update user's XP in Supabase
  - [ ] 7.5 Check if XP crosses rank threshold – if yes, increment rank
  - [ ] 7.6 Create `src/app/api/generate-quest/route.ts` – generates next quest based on updated profile/gaps
  - [ ] 7.7 Save completed quest to `quest_history` table, update `current_quest` in profiles
  - [ ] 7.8 Create `src/components/ui/RankUpAnimation.tsx` – confetti burst + rank change animation (use canvas-confetti)
  - [ ] 7.9 Trigger rank-up animation on frontend when rank increases
  - [ ] 7.10 Handle Rank A (max): show "Max Rank Achieved – You are S-Rank material!" celebration

- [ ] 8.0 Debugging Skill Tree & Dungeon
  - [ ] 8.1 Create `src/lib/challenges/debugging.ts` with array of 5-10 JS debugging challenges
  - [ ] 8.2 Each challenge: `{ id, title, description, buggyCode, expectedOutput, hint }`
  - [ ] 8.3 Include classic bugs: off-by-one errors, async/await issues, scope problems, array mutation, type coercion
  - [ ] 8.4 Create `src/components/ui/DebuggingDungeon.tsx` – modal component with challenge display
  - [ ] 8.5 Add code editor (textarea with monospace font, or simple CodeMirror if time permits)
  - [ ] 8.6 Implement "Run & Verify" button: execute user code client-side using `new Function()` in try-catch
  - [ ] 8.7 Compare execution output to `expectedOutput` – show success or failure message
  - [ ] 8.8 On success: increment Debugging skill level (+1, max 10), grant small XP to main rank (10 XP)
  - [ ] 8.9 Update skill level in Supabase `skills` table
  - [ ] 8.10 Random challenge selection with no immediate repeats (track last completed challenge ID)
  - [ ] 8.11 Show skill level progress bar in modal and in skill tree

- [ ] 9.0 Animations, Polish & Final Integration
  - [ ] 9.1 Add CSS glow/pulse animations to rank badge on rank-up
  - [ ] 9.2 Add smooth transitions for XP bar fill
  - [ ] 9.3 Add success/failure feedback animations in debugging dungeon
  - [ ] 9.4 (Optional) Add sound effects using Howler.js or HTML5 Audio for rank-up and quest complete
  - [ ] 9.5 Test full end-to-end flow: landing → login → upload/awaken → dashboard → quest → verify → rank up → dungeon
  - [ ] 9.6 Fix any responsive issues for desktop demo (mobile is lower priority)
  - [ ] 9.7 Add loading states and error handling UI throughout
  - [ ] 9.8 Deploy to Vercel: connect repo, add environment variables, verify production build
  - [ ] 9.9 Final demo run-through: complete flow in under 5 minutes
