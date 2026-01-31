Okay so I am trying to make a solo leveling like system in Real life.People can come on the platform and upload their resume and keep this on our end. We will parse their resume and give them one "quest" they can do to improve their profile/to improve in career, etc. The user can complete the quest and "level up"Also user can gain/level up skills like "debugging", "testing" and other non trivial skills (very much needed in this AI age when coding is cheap). These can be taken as much as you need to level up these particular skills and are different from the main quest.This is the general idea. Refine and streamline this idea.Don't use memories from previous chats focus just on streamlining the idea.

### Refined Concept: "Shadow Rank" – A Solo Leveling-Inspired Career Awakening Platform

Your idea captures the essence of **Solo Leveling** perfectly: starting weak, grinding through challenges, and emerging stronger through solo effort. The core strength is tying gamification to real career growth via resume parsing, with a clear split between a **main progression path** (story-like quests for overall leveling) and **skill grinding** (repeatable challenges for targeted improvement).

Here's a streamlined version that keeps the RPG feel, makes it feasible to build, and focuses on high-impact actions in the AI era (where routine coding is commoditized, but deep skills like debugging, architecture, and critical thinking remain premium).

![Solo Leveling System in Real Life | LiFE RPG Notion Template](https://framerusercontent.com/images/EuGb6jLPXsqY4shY0ZLPOyrb2E.png?width=1920&height=1080)

[liferpg.site](https://www.liferpg.site/solo-leveling-system)

![ScholarQuest: Student Dashboard Template by ISMAR | Notion Marketplace](https://www.notion.com/_next/image?url=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Ftemplate%2F01aecb66-ffcc-4168-9a61-0a9a143bd4bf%2F1746102170459%2Fdesktop.jpg&w=3840&q=75)

[notion.com](https://www.notion.com/templates/scholarquest-student-dashboard?srsltid=AfmBOoqZbgD-5u7DD1uYpGj1-zmkN2pC7NktDfRuAPp1U-2hx9CPHXC1)

#### Core Mechanics

1. **Hunter Profile & Awakening (Onboarding)**
	- User signs up and uploads resume (PDF/LinkedIn import).
	- AI parses it to assess current "Rank" (E → S, like Solo Leveling hunters) and baseline stats (Experience Level, Skill Proficiencies, Gaps).
	- User sets a career goal (e.g., "Senior Backend Engineer" or "Switch to AI Engineering") to personalize the path.
2. **Main Questline – The "Awakening" Path**
	- One active main quest at a time → focused progression, no overwhelm.
	- AI-generated, personalized, and sequential based on resume gaps + goal.
	- Examples:
		- Weak portfolio → "Deploy a full-stack side project and share the live link/GitHub."
		- No leadership experience → "Lead an open-source contribution or organize a small tech meetup."
		- Outdated skills → "Complete a certification in cloud architecture."
	- Completion → Major rank-up, XP boost, updated resume suggestions, and unlock next quest.
	- Feels like the protagonist's gradual power-ups.
3. **Skill Grinding – Independent Skill Trees**
	- Separate from main quests → repeatable "dungeons" for targeted leveling.
	- Focus on non-automatable skills that stay valuable as AI advances.
	| Skill Category | Example Skills | Grind Activities (Repeatable) | Level Benefits |
	| --- | --- | --- | --- |
	| Technical Depth | Debugging, Testing, System Design | Fix provided buggy code, write test suites for scenarios, design scalable systems from prompts | Badges, higher quest efficiency, profile highlights |
	| Problem Solving | Algorithmic Thinking, Refactoring | Solve curated coding challenges (integrated or linked to platforms) | Faster main quest suggestions |
	| Professional Edge | Code Review, Technical Communication | Review sample PRs, explain solutions in writing/video | Mock interview unlocks, better job match visibility |
	| Soft Power | Leadership, Networking | Contribute to open source, write a tech blog post | Bonus XP multipliers |
	- Skills level independently (1–50). Higher levels unlock harder/better challenges and passive bonuses.

![A User Research Skill Tree🌲: Career Progression Paths + Quiz | by ...](https://miro.medium.com/v2/resize:fit:1400/1*F3EmluISUvKOEY2xiDAp-Q.png)

[medium.com](https://medium.com/uxr-microsoft/user-research-skill-tree-f7f44e88bd9d)

![How I Conquered 700 Problems and Transformed My Coding Journey ...](https://miro.medium.com/v2/resize:fit:1358/format:webp/1*nY1TZVoI3bCtHeqqZVUsAQ.png)

[medium.com](https://medium.com/@sriragavip/how-i-conquered-700-problems-and-transformed-my-coding-journey-d6125a12634c)

#### User Flow (Simple & Addictive)

1. **Dashboard** → Shows Rank, current Main Quest, available Skill Challenges, XP progress, streak.
2. **Accept Quest/Challenge** → Clear instructions + resources (templates, links).
3. **Submit Proof** → Upload link/screenshot/code, or complete in-platform task (e.g., code editor for debugging).
4. **Verification** → Mix of auto (link validation, code execution) + AI review + optional community vote for subjective tasks.
5. **Reward** → Instant level-up animation, updated profile, AI-generated resume improvements, motivational notifications.

#### Key Streamlining Choices

- **One main quest** → Prevents choice paralysis; feels like a focused story.
- **Skills are grindable** → Satisfies the "daily dungeon clear" dopamine loop.
- **Verification is practical** → No pure self-reporting to maintain integrity.
- **Solo focus** → No mandatory social features; optional leaderboards for ranks if users want competition.
- **AI-era relevance** → Quests emphasize building evidence of human-edge skills (projects, explanations, leadership) over rote coding.

#### Additional Polish for Retention

- Daily login → small XP + random "low-rank dungeon" (quick skill challenge).
- "Re-awakening" → Periodic resume re-upload triggers new assessment and adjusted quests.
- Profile as "Hunter Card" → Public shareable version with rank, badges, completed quests (great for job applications).

This version keeps the magical feeling of Solo Leveling — starting as an E-rank "weakling," grinding alone, and slowly becoming an unstoppable S-rank professional — while being tightly focused, actionable, and differentiated from existing coding platforms (LeetCode/Codewars for pure challenges) or habit apps. It's buildable with current AI (resume parsing, quest generation, code evaluation). Let me know if you want deeper dives on tech stack, monetization, or specific quest examples!

98 sources

now lets pick features and trim this down further for a hackathon (use pareto principle, most impact least effort, get us to the 80% with the most widely used 20%)

### Hackathon MVP: "Shadow Rank" – Core Solo Leveling Career Grinder

For a hackathon, we apply the Pareto principle ruthlessly: **80% of the value comes from the addictive progression loop (resume → personalized quest → completion → visible level-up)**. That's the "awakening" moment that hooks users and demos perfectly.

Everything else (full skill trees, complex verification, daily streaks, public profiles, re-awakenings) gets cut or simplified to mocks. Goal: Build a working end-to-end demo in 48 hours with 2–4 people (frontend, backend, AI prompts).

#### MVP Core Features (The Vital 20%)

1. **Quick Onboarding & Awakening**
	- User uploads resume (PDF) or imports LinkedIn (use a simple LinkedIn OAuth or just PDF upload).
	- AI parses resume → assigns starting **Rank** (E → A, skip S for now) and generates **ONE active Main Quest**.
	- Effort: Use an off-the-shelf resume parsing API (Affinda, Parsio, or even ChatGPT vision on screenshot for ultra-low effort).
	- Bonus: Let user pick a simple goal dropdown ("Junior → Mid-level Dev", "Switch to AI/ML", "Freelance Upskill") to flavor the quest.
2. **Single Main Quest Progression (The Dopamine Core)**
	- Only **one quest at a time** — keeps it focused and story-like.
	- AI-generated personalized quest based on parsed gaps.
		- Examples (pre-tuned prompts for reliability):
			- No projects → "Build and deploy a simple full-stack app (e.g., todo list with auth) and share the GitHub/live link."
			- Weak fundamentals → "Solve 3 LeetCode medium problems in your language and share screenshots."
			- No writing → "Write a 500-word blog post explaining a concept you know and publish on Hashnode/Medium."
	- User submits proof: Text box + link/upload (GitHub, screenshot, etc.).
	- **Verification = Self-report + lightweight AI check** (e.g., prompt AI to scan link/text for keywords — good enough for demo).
	- Completion → **Instant rank-up animation**, XP bar fill, new quest unlocked, motivational message ("You have awakened further...").
3. **Basic Dashboard (The Glue)**
	- Shows:
		- Current Rank (big bold E/D/C/B/A with Solo Leveling-style shadow aesthetic).
		- Progress bar to next rank.
		- Active Main Quest card (description, submit button).
		- Short history of completed quests (2–3 max).
	- Use simple charts (Chart.js) for visual pop.

#### Ruthlessly Trimmed/Cut Features

- **No full skill grinding** → Too much scope. Instead, bake 1–2 simple repeatable challenges into the main quest flow (e.g., "Daily debug: Fix this buggy snippet" as an optional XP booster).
- **No complex skill trees/badges** → Mock one static "Debugging Skill: Level 3" that increases slightly on quest completion.
- **No verification rigor** → Accept self-submission; optionally run a quick AI plausibility check on links.
- **No daily logins/streaks** → Skip for now.
- **No public profiles/leaderboards** → Private only.
- **No re-awakening/resume re-parse** → One-time parse on signup.

#### Why This Hits 80% Impact

- **Core loop is addictive**: Upload → personalized quest → complete → rank up → repeat. Feels exactly like Sung Jin-Woo leveling up alone.
- **Demo gold**: In 5 minutes, a judge can upload a resume, get a tailored quest, "complete" it (paste a link), and see the rank-up animation.
- **Career value**: Real actionable advice tied to their actual resume — stands out from generic platforms.
- **AI-era relevance preserved**: Quests push evidence-building (projects, writing, contributions) over rote tasks.

#### Suggested Tech Stack (Low Effort, High Polish)

- **Frontend**: Next.js or React + Tailwind (dark theme, shadow effects for Solo Leveling vibe).
- **Backend**: Firebase/Supabase (auth, storage, DB) — no server management.
- **AI**: Groq or OpenAI for parsing + quest generation (few-shot prompts = reliable).
- **Resume parse**: Ready API or fallback to user filling a quick form.
- **Deployment**: Vercel in minutes.

This MVP is demo-ready, differentiated, and expandable later. You can ship a polished prototype that feels magical without scope creep. If you win, add skills later. Good luck at the hackathon!

keep it simpler, its a 12 hour hackathon, just 1 person we need to trim this down further, think making a simple MVP with core features that showcase the value propositions

\### Current Feedback

1. Only PDF uploads (no OAuth, maybe not even Auth)
2. We need the full skill tree, but for the demo only one skill is available (unlocking and progression) like debugging, testing, etc
3. Verification can not be pure self-submission, also trim this further to be just one type, somethin like cert verificaiton or GitHub PR/Commit or Behance Design submmision. Pick one, keep it simple!
4. keep the main quest (for this demo) for which skill can be verified only by GitHub links directly. ref #2, #3

\*\*IMPORTANT:\*\* now write this as a feature explainer you're giving as a prompt to a Coding Agent

You are a skilled full-stack developer building a solo 12-hour hackathon project: an MVP web app called **Shadow Rank**, inspired by Solo Leveling. The core value proposition is: users upload a resume PDF → AI parses it → get a starting "Rank" (E to A) and one personalized Main Quest → complete it by submitting a GitHub link → get verified simply → level up rank with a cool animation. Additionally, show a skill tree UI with multiple skills listed, but only **one skill (Debugging)** is unlockable and grindable in this demo.

Keep everything **extremely simple** for a 12-hour solo build: no user auth (session-only or none), minimal backend, heavy use of client-side where possible, and fake/mocked data where needed for polish. Prioritize a smooth end-to-end demo flow that feels magical in under 5 minutes of use.

### Tech Stack (Must Use for Speed)

- Frontend: Next.js (App Router) + Tailwind CSS (dark theme with purple/shadow Solo Leveling vibes).
- AI: OpenAI/Groq API for resume parsing and quest generation (few-shot prompts only).
- Resume Parsing: Client-side with pdf-parse library (or fallback to simple text extraction).
- Storage: None needed (all in-memory or localStorage for demo).
- Deployment: Vercel (one-click).
- No database, no complex auth.

### Core Pages/Flow

1. **Landing Page**
	- Hero section: "Awaken Your Career – Level Up Like Sung Jin-Woo"
	- Big "Upload Resume to Awaken" button → goes to Dashboard (no login).
2. **Dashboard (Main Page)**
	- If no resume uploaded yet: Show upload zone.
	- After upload:
		- Big centered **Rank Display**: E/D/C/B/A with shadow glow effect (use Tailwind + simple CSS animation).
		- Progress bar to next rank.
		- **Main Quest Card**: One active quest generated from resume.
			- Title: e.g., "Double Awakening: Build Your First Gate"
			- Description: Personalized, e.g., "Your resume lacks projects. Create a simple repo demonstrating clean code and debugging skills. Submit the GitHub link."
			- Submit form: Text input for GitHub repo URL + optional short description.
			- Submit button → triggers verification.
		- **Skill Tree Section**: Visual tree/grid (simple CSS grid or library like react-arborist if quick).
			- Show 5–6 skills: Debugging (active), Testing (locked), System Design (locked), etc.
			- Only **Debugging** is clickable/unlockable.
			- Debugging skill: Level 1–10 bar, starts at 1.
			- Button: "Enter Debugging Dungeon" → opens a modal with one simple repeatable challenge (see below).
3. **Verification Logic (Simple, Not Pure Self-Submit)**
	- All verification is **GitHub link only**.
	- On submit (Main Quest or Debugging challenge):
		- Client-side fetch the GitHub URL (use GitHub API no-auth for public repos: fetch https://api.github.com/repos/username/repo).
		- Basic checks:
			- If API returns 200 and repo exists → "Verified!" + grant XP/rank up.
			- If recent commit (check pushed\_at date roughly) → bonus XP.
			- Fallback: If API fails, just accept and mock success (for demo leniency).
		- No deep analysis – just confirm the repo is real and public.
	- On success:
		- Cool rank-up animation (confetti + rank change).
		- For Main Quest: Generate next quest (or mock "Quest Complete – Rank Up!").
		- For Debugging skill: +1 level (max 5 for demo), +small XP to main rank.
4. **Debugging Skill Grind (The One Active Skill)**
	- Modal: "Debugging Dungeon"
		- Simple prompt: "Submit a GitHub repo/link where you fixed a bug or wrote clean debuggable code."
		- Same GitHub verification as above.
		- On verify: Level up Debugging skill visibly, small rank XP.
		- Repeatable (user can submit multiple times for demo).

### AI Integration (Keep Prompts Simple)

- On PDF upload:
	- Extract text client-side.
	- Send to OpenAI: Prompt like → "Parse this resume text. Output JSON: {rank: 'E'|'D'|'C'|'B'|'A', gaps: \['no projects', 'weak fundamentals'\], suggestedQuest: 'short personalized quest requiring a GitHub repo'}"
- Use the output to populate dashboard.

### Polish for Demo Impact

- Solo Leveling aesthetics: Dark background, purple accents, shadow effects, level-up sound (optional Howler.js).
- Fake data fallback: If no PDF, button to "Mock Awakening" with sample rank/quest.
- Mobile-responsive but prioritize desktop demo.

Build in this order:

1. Basic Next.js + Tailwind setup + landing/dashboard skeleton.
2. PDF upload + text extraction + AI call.
3. Rank/Quest display.
4. GitHub verification + success animation.
5. Skill tree UI + Debugging modal.
6. Polish visuals.

Make it feel addictive and unique – the GitHub verification gives real credibility without self-reporting. Good luck, code fast!

Lets use Supabase, for storage and auth (simplest GitHub OAuth impl from them) We'll be using Reducto for parsing the Resume, and Firecrawl to web crawl for wherever it makes sense now give the complete yet minimal project description, without delving much into the implementation details, just high level idea nd description

## Shadow Rank

**A Solo Leveling-Inspired Career Awakening Platform**

Shadow Rank is a gamified web app that turns career growth into an RPG-style solo progression system, modeled after Sung Jin-Woo's journey in *Solo Leveling*. Users start as low-rank "hunters" and level up by completing personalized, actionable quests that address real gaps in their professional profile — transforming resume weaknesses into visible strength.

### Core Idea

You upload your resume → the system "awakens" you with a starting Rank (E to A) → you receive one focused Main Quest designed to close your biggest career gap → you complete it by submitting a GitHub repository link → the system verifies the submission → you rank up with a satisfying animation and unlock the next quest.

A skill tree shows multiple professional skills, but only **Debugging** is active in this version: users can repeatedly "grind" it by submitting additional GitHub repos demonstrating bug-fixing or clean code, earning incremental skill levels and bonus rank progress.

### Key Features

- **GitHub OAuth Login** – Quick, secure sign-in with your GitHub account.
- **Resume Upload & Awakening** – Upload a PDF resume; the system parses it and instantly assigns your starting Rank and a personalized Main Quest.
- **Main Quest Progression** – One active quest at a time (e.g., "Build and deploy a small project showcasing clean, debuggable code"). Complete it by linking a public GitHub repo.
- **Simple GitHub Verification** – Submissions are checked by confirming the repo exists and has recent activity — no pure self-reporting.
- **Debugging Skill Grind** – The only active skill in the tree. Submit additional repos to level it up repeatedly (dungeon-clear style).
- **Rank-Up Feedback Loop** – Successful submissions trigger rank increases, progress bars, and motivational visuals with a dark, shadowy Solo Leveling aesthetic.

### Value Proposition

In an AI era where routine tasks are automated, Shadow Rank pushes users to build and prove high-value human skills (problem-solving, debugging, project execution) through real evidence on GitHub. It's addictive solo progression with genuine career impact — turning "leveling up" from metaphor into measurable reality.

Built as a 12-hour solo hackathon project, this MVP captures the magical feeling of awakening from E-rank weakness to steady growth, one verified quest at a time.

Debugging is not verified with GitHub or AI. For debugging we'll have simple coding challenge that the user can solve within the browser (using JS, executing right then and there), keeping this completely on client side for now. Keep the rest of the idea doc as it is, just make an update with the debugging skill part

## Shadow Rank

**A Solo Leveling-Inspired Career Awakening Platform**

Shadow Rank is a gamified web app that turns career growth into an RPG-style solo progression system, modeled after Sung Jin-Woo's journey in *Solo Leveling*. Users start as low-rank "hunters" and level up by completing personalized, actionable quests that address real gaps in their professional profile — transforming resume weaknesses into visible strength.

### Core Idea

You upload your resume → the system "awakens" you with a starting Rank (E to A) → you receive one focused Main Quest designed to close your biggest career gap → you complete it by submitting a GitHub repository link → the system verifies the submission → you rank up with a satisfying animation and unlock the next quest.

A skill tree shows multiple professional skills, but only **Debugging** is active in this version: users can repeatedly "grind" it by solving simple in-browser JavaScript coding challenges (executed instantly client-side), earning incremental skill levels and bonus rank progress.

### Key Features

- **GitHub OAuth Login** – Quick, secure sign-in with your GitHub account.
- **Resume Upload & Awakening** – Upload a PDF resume; the system parses it and instantly assigns your starting Rank and a personalized Main Quest.
- **Main Quest Progression** – One active quest at a time (e.g., "Build and deploy a small project showcasing clean, debuggable code"). Complete it by linking a public GitHub repo.
- **Simple GitHub Verification** – Main quest submissions are checked by confirming the repo exists and has recent activity — no pure self-reporting.
- **Debugging Skill Grind** – The only active skill in the tree. Users solve quick, client-side JavaScript debugging challenges directly in the browser (instant execution and feedback) to level it up repeatedly (dungeon-clear style).
- **Rank-Up Feedback Loop** – Successful completions (quests or challenges) trigger rank increases, progress bars, and motivational visuals with a dark, shadowy Solo Leveling aesthetic.

### Value Proposition

In an AI era where routine tasks are automated, Shadow Rank pushes users to build and prove high-value human skills (problem-solving, debugging, project execution) through real evidence on GitHub and interactive challenges. It's addictive solo progression with genuine career impact — turning "leveling up" from metaphor into measurable reality.

Built as a 12-hour solo hackathon project, this MVP captures the magical feeling of awakening from E-rank weakness to steady growth, one verified quest or cleared challenge at a time.