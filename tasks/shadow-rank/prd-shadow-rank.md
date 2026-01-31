# PRD: Shadow Rank – Solo Leveling Career Awakening Platform

## 1. Introduction/Overview

**Shadow Rank** is a gamified web application that transforms career growth into an RPG-style solo progression system, inspired by *Solo Leveling*. Users "awaken" by uploading their resume, receive a starting Rank (E to A), and level up by completing personalized Main Quests verified through GitHub submissions. A Debugging skill tree allows repeatable in-browser JavaScript challenges for additional grinding.

**Problem Solved:** Career development lacks engaging feedback loops. Traditional advice is generic and progress feels invisible. Shadow Rank makes growth tangible, addictive, and evidence-based.

**Target:** 12-hour solo hackathon MVP demonstrating the core progression loop.

---

## 2. Goals

1. Deliver a working end-to-end demo flow: Resume upload → Rank assignment → Main Quest → GitHub verification → Level up
2. Implement a functional Debugging skill with 5-10 client-side JS challenges
3. Persist user progress across sessions via Supabase
4. Create an immersive Solo Leveling aesthetic (dark theme, purple accents, rank-up animations)
5. Demo completable in under 5 minutes by a new user

---

## 3. User Stories

### US-1: Awakening (Onboarding)
> As a new user, I want to sign in with GitHub and upload my resume so that I can receive my starting Rank and first quest.

### US-2: Main Quest Completion
> As an awakened user, I want to complete my Main Quest by submitting a GitHub repo link so that I can rank up and unlock my next quest.

### US-3: Debugging Skill Grind
> As a user, I want to solve JavaScript debugging challenges in my browser so that I can level up my Debugging skill and earn bonus XP.

### US-4: Progress Tracking
> As a returning user, I want my rank, quest progress, and skill levels to be saved so that I can continue where I left off.

### US-5: Fallback Onboarding
> As a user whose resume fails to parse, I want to use my GitHub profile data as a fallback so that I can still get awakened and start playing.

---

## 4. Functional Requirements

### Authentication
- **FR-1:** System must support GitHub OAuth login via Supabase Auth.
- **FR-2:** User session must persist across browser sessions.

### Resume Upload & Awakening
- **FR-3:** System must accept PDF resume uploads.
- **FR-4:** System must parse resume using Reducto API and extract relevant career data.
- **FR-5:** On parse failure, system must display an error and offer retry or GitHub profile fallback.
- **FR-6:** GitHub fallback must fetch user's public profile (repos, bio, languages) via GitHub API and use that for awakening.
- **FR-7:** System must send parsed data to AI (OpenAI/Groq) to generate:
  - Starting Rank (E, D, C, B, or A)
  - Identified gaps (e.g., "no projects", "weak fundamentals")
  - One personalized Main Quest requiring a GitHub repo submission
- **FR-8:** Awakening results must be stored in Supabase (user profile table).

### Main Quest System
- **FR-9:** Dashboard must display current Rank with visual glow effect.
- **FR-10:** Dashboard must show progress bar to next rank.
- **FR-11:** Dashboard must display one active Main Quest with title, description, and submission form.
- **FR-12:** User must submit a GitHub repository URL to complete a quest.
- **FR-13:** System must verify submission by calling GitHub API (`GET /repos/{owner}/{repo}`):
  - If 200 response and repo is public → Verified
  - Bonus XP if `pushed_at` is within last 7 days
  - If API fails → Show error, allow retry
- **FR-14:** On successful verification:
  - Increment user's rank (E→D→C→B→A)
  - Trigger rank-up animation (confetti, glow, sound optional)
  - Call AI to generate next Main Quest based on updated profile
  - Save new quest and rank to Supabase
- **FR-15:** If user reaches Rank A, show "Max Rank Achieved" celebration screen.

### Debugging Skill Tree
- **FR-16:** Dashboard must display a skill tree section showing 5-6 skills:
  - Debugging (active/unlocked)
  - Testing (locked)
  - System Design (locked)
  - Code Review (locked)
  - Technical Writing (locked)
- **FR-17:** Only Debugging skill is interactive in this MVP.
- **FR-18:** Debugging skill must show current level (1-10) with progress bar.
- **FR-19:** "Enter Debugging Dungeon" button opens a modal with a JS challenge.
- **FR-20:** System must include 5-10 pre-written JavaScript debugging challenges (same difficulty level), stored client-side.
- **FR-21:** Each challenge must present:
  - Buggy code snippet
  - Expected output description
  - Code editor (textarea or simple editor component)
  - "Run & Verify" button
- **FR-22:** On submit, system must execute user's code client-side (using `Function()` or sandboxed eval) and compare output to expected result.
- **FR-23:** On success:
  - Increment Debugging skill level (+1, max 10)
  - Grant small XP toward main rank
  - Show success animation
  - Save skill level to Supabase
- **FR-24:** On failure, show error feedback and allow retry.
- **FR-25:** Challenges should be randomly selected (no immediate repeats).

### Data Persistence (Supabase)
- **FR-26:** User table must store: `id`, `github_id`, `username`, `rank`, `xp`, `current_quest`, `resume_data`, `created_at`, `updated_at`.
- **FR-27:** Skills table must store: `user_id`, `skill_name`, `level`, `xp`.
- **FR-28:** Quest history table (optional): `user_id`, `quest_title`, `completed_at`.
- **FR-29:** All progress changes must sync to Supabase in real-time.

### UI/UX
- **FR-30:** Dark theme with purple/shadow accents (*Solo Leveling aesthetic*).
- **FR-31:** Rank display must use large typography with glow/shadow effects.
- **FR-32:** Rank-up must trigger a satisfying animation (confetti, flash, optional sound).
- **FR-33:** Mobile-responsive, but prioritize just desktop for demo.

---

## 5. Non-Goals (Out of Scope)

- Multiple active skills beyond Debugging
- Complex AI-powered code verification
- Leaderboards or social features
- Daily login streaks or notifications
- Public shareable profiles ("Hunter Cards")
- Resume re-upload / re-awakening flow
- Payment or premium features
- Admin dashboard

---

## 6. Design Considerations

### Visual Theme
- **Color Palette:** Dark backgrounds (#0a0a0f), purple accents (#8b5cf6), shadow glows
- **Typography:** Bold, clean sans-serif for ranks; monospace for code
- **Animations:** CSS transitions for level-ups, confetti library (e.g., canvas-confetti)

### Key UI Components
- Rank Badge (E/D/C/B/A with glow)
- XP Progress Bar
- Quest Card (collapsible)
- Skill Tree Grid (CSS Grid, locked items grayed out)
- Code Editor Modal (simple textarea or Monaco if time permits)

---

## 7. Technical Considerations

### Tech Stack
| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| Frontend       | Next.js 14+ (App Router), Tailwind CSS                       |
| Auth           | Supabase Auth (GitHub OAuth)                                 |
| Database       | Supabase PostgreSQL                                          |
| Resume Parsing | Reducto API                                                  |
| Web Crawling   | Firecrawl (for GitHub profile fallback enrichment if needed) |
| AI             | OpenAI or Groq API (few-shot prompts)                        |
| Deployment     | Vercel                                                       |

### API Endpoints (Serverless Functions)
- `POST /api/parse-resume` – Upload PDF, call Reducto, return parsed data
- `POST /api/awaken` – Send parsed data to AI, return rank + quest
- `POST /api/verify-github` – Validate GitHub repo URL
- `POST /api/generate-quest` – Generate next quest from AI
- `GET /api/user/profile` – Fetch user progress from Supabase

### Client-Side
- Debugging challenges executed locally (no server round-trip)
- localStorage as cache; Supabase as source of truth

### Security Notes
- GitHub API calls use public endpoints (no token needed for public repos)
- Code execution sandboxed client-side only
- Resume data stored securely in Supabase (RLS enabled)

---

## 8. Success Metrics

| Metric                     | Target                                          |
| -------------------------- | ----------------------------------------------- |
| End-to-end demo completion | Works in <5 minutes for new user                |
| Resume → Rank flow         | Successfully parses and assigns rank            |
| GitHub verification        | Correctly validates real public repos           |
| Debugging dungeon          | At least 5 challenges playable                  |
| Persistence                | User can close browser, return, and continue    |
| Aesthetic                  | Visually matches Solo Leveling dark/purple vibe |

---

## 9. Open Questions

1. **AI Prompt Tuning:** What few-shot examples should be used for consistent rank assignment and quest generation? Based on the holistic resume data, experience level, and identified gaps.
2. **Challenge Quality:** Should debugging challenges be sourced from existing datasets or written custom? Use some standard bugs, like (off-by-one, async issues, scope problems), etc and ensure they are solvable within the browser, also keep the difficulty matchable to user rank. Don't keep the overly simple, they should have some level of challenge and learning opportunity.
3. **Rank XP Thresholds:** What XP values trigger rank-ups? (e.g., E→D at 100 XP, D→C at 250 XP)
4. **Edge Cases:** What if user submits same repo twice? Block duplicate submissions per quest
