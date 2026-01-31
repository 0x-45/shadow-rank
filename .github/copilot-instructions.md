# Shadow Rank - AI Coding Instructions

## Project Overview
Shadow Rank is a gamified career development platform inspired by Solo Leveling. Users "awaken" by uploading a resume or using GitHub profile, receive a rank (E→D→C→B→A), and level up by completing AI-generated quests verified through GitHub repo submissions.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Backend**: Supabase (Auth + PostgreSQL + RLS policies)
- **AI**: OpenAI or Groq (with fallback to static responses)
- **Styling**: Tailwind CSS v4

### Key Data Flow
1. **Awakening**: Resume/GitHub → AI analysis → Rank + Quest assignment → Supabase profile
2. **Quest Completion**: GitHub URL submission → API verification → XP calculation → Rank up
3. **Debugging Dungeon**: Client-side JS challenges → sandboxed `Function()` eval → Skill XP

### File Structure Patterns
```
src/
  app/api/       # Route handlers (server-side, use createClient from lib/supabase/server)
  components/ui/ # Client components with 'use client' directive
  lib/
    ai/          # AI prompts and response parsing
    supabase/    # client.ts (browser), server.ts (API routes), middleware.ts
    utils/       # Pure functions (xp.ts, github.ts)
  types/         # Central type definitions
```

## Critical Conventions

### Supabase Client Usage
- **Browser components**: `import { createClient } from '@/lib/supabase/client'` (sync)
- **API routes**: `import { createClient } from '@/lib/supabase/server'` (async, `await createClient()`)
- Client checks for placeholder env vars and returns mock during build

### Type System
All types are centralized in `src/types/index.ts`:
- `Rank`: `'E' | 'D' | 'C' | 'B' | 'A'`
- `User`, `Quest`, `Skill`, `Challenge`, `AwakeningResult`
- API response wrappers: `ApiResponse<T>`, `ParseResumeResponse`, etc.

### XP & Rank System
XP thresholds defined in `src/lib/utils/xp.ts`:
- E→D: 100 XP | D→C: 250 XP | C→B: 500 XP | B→A: 1000 XP
- Quest completion: 50 XP base + 25 recency bonus (if pushed within 7 days)
- Debugging challenges: 10 XP each

### AI Integration Pattern
See `src/lib/ai/prompts.ts` for prompt templates. API routes check for keys in order:
```typescript
if (openaiKey && !openaiKey.includes('your_')) { /* use OpenAI */ }
else if (groqKey && !groqKey.includes('your_')) { /* use Groq */ }
else { /* use fallback static response */ }
```

### Component Patterns
- UI components use `'use client'` and live in `src/components/ui/`
- Rank colors/labels defined as `Record<Rank, {...}>` (see `RankBadge.tsx`)
- Animations: `glow-pulse` class, `canvas-confetti` for celebrations

## Development Commands
```bash
npm run dev          # Start dev server (requires .env.local)
npm run build        # Production build
npm run lint         # ESLint
npx tsx scripts/test-api.ts  # Test API endpoints
```

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=      # Optional, falls back to Groq or static
GROQ_API_KEY=        # Optional fallback
```

## Database Schema
See `supabase/migrations/001_initial_schema.sql`:
- `profiles`: User data with JSONB `current_quest` and `resume_data`
- `skills`: Per-user skill levels (1-10 scale)
- `quest_history`: Completed quests with XP earned
- All tables have RLS policies scoped to `auth.uid()`

## Dev Mode
Add `?dev=true` to dashboard URL to bypass auth for testing UI without Supabase.
