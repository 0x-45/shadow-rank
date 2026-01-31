# Tasks: Shadow Rank Feature Updates v2

## Relevant Files

### Database & Configuration
- `supabase/migrations/002_feature_updates_v2.sql` - New migration for schema updates (goal, resume_url, earned_xp columns)
- `package.json` - Add new dependencies (CodeMirror, LangChain, recharts)

### Components - Slide Panel & Code Editor
- `src/components/ui/SlidePanel.tsx` - New reusable slide panel component (75% width, from right)
- `src/components/ui/CodeEditor.tsx` - New CodeMirror-based code editor component
- `src/components/ui/ConsoleOutput.tsx` - New console output display component
- `src/components/ui/DebuggingDungeon.tsx` - Refactor to use SlidePanel and CodeEditor

### Components - Skill Radar Chart
- `src/components/ui/SkillRadarChart.tsx` - New radar/spider chart component (replaces SkillTree)
- `src/components/ui/SkillTree.tsx` - To be replaced/removed

### Components - Resume & Profile
- `src/components/ui/ResumeUpload.tsx` - Update for Supabase storage integration
- `src/components/ui/ProfileSection.tsx` - New component showing resume, goal, and profile info

### Components - Goal Feature
- `src/components/ui/GoalInput.tsx` - New component for adding/editing/deleting goal

### API Routes
- `src/app/api/parse-resume/route.ts` - Update for placeholder resume parsing
- `src/app/api/generate-quest/route.ts` - Refactor to use LangChain with OpenAI
- `src/app/api/resume/route.ts` - New API for Supabase storage upload/fetch
- `src/app/api/goal/route.ts` - New API for goal CRUD operations
- `src/app/api/skills/route.ts` - New/update API for skill level calculations

### Library & Utilities
- `src/lib/ai/langchain.ts` - New LangChain setup and configuration
- `src/lib/ai/prompts.ts` - Update prompts for LangChain format
- `src/lib/utils/codeRunner.ts` - New sandboxed code execution utility
- `src/lib/resume/placeholder.ts` - New placeholder/fake resume data
- `src/lib/resume/parser.ts` - Resume parsing logic (using placeholder for now)

### Pages
- `src/app/dashboard/page.tsx` - Update to integrate new components

### Types
- `src/types/index.ts` - Add new types for Goal, updated Skill types

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx jest [optional/path/to/test/file]` to run tests.
- This feature set prioritizes functionality over UI polish (UI revamp is out of scope).

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

- [ ] 1.0 Database Schema Updates & Dependencies Setup
  - [ ] 1.1 Create new migration file `002_feature_updates_v2.sql`
  - [ ] 1.2 Add `goal` column (TEXT) to profiles table
  - [ ] 1.3 Add `resume_url` column (TEXT) to profiles table
  - [ ] 1.4 Add `resume_uploaded_at` column (TIMESTAMPTZ) to profiles table
  - [ ] 1.5 Add `earned_xp` column (INTEGER DEFAULT 0) to skills table
  - [ ] 1.6 Add `base_level` column (INTEGER DEFAULT 1) to skills table for resume-derived level
  - [ ] 1.7 Install CodeMirror packages: `@uiw/react-codemirror`, `@codemirror/lang-javascript`
  - [ ] 1.8 Install LangChain packages: `langchain`, `@langchain/openai`, `@langchain/core`
  - [ ] 1.9 Install recharts for radar chart: `recharts`
  - [ ] 1.10 Update `src/types/index.ts` with new types (Goal, updated Profile, updated Skill)

- [ ] 2.0 Implement Slide Panel Component
  - [ ] 2.1 Create `src/components/ui/SlidePanel.tsx` component
  - [ ] 2.2 Implement slide-in animation from right side
  - [ ] 2.3 Set panel width to 75% of viewport
  - [ ] 2.4 Add dark overlay on remaining 25% (click to dismiss)
  - [ ] 2.5 Add close button (X) in panel header
  - [ ] 2.6 Accept children prop for panel content
  - [ ] 2.7 Accept `isOpen` and `onClose` props for control
  - [ ] 2.8 Add keyboard support (Escape to close)

- [ ] 3.0 Implement Code Editor with CodeMirror (Debugging Interface)
  - [ ] 3.1 Create `src/components/ui/CodeEditor.tsx` using `@uiw/react-codemirror`
  - [ ] 3.2 Configure JavaScript/TypeScript syntax highlighting
  - [ ] 3.3 Set up dark theme for editor
  - [ ] 3.4 Accept `value` and `onChange` props
  - [ ] 3.5 Create `src/components/ui/ConsoleOutput.tsx` for displaying logs
  - [ ] 3.6 Create `src/lib/utils/codeRunner.ts` with sandboxed eval execution
  - [ ] 3.7 Implement console.log capture by overriding console methods
  - [ ] 3.8 Refactor `DebuggingDungeon.tsx` to use SlidePanel instead of modal
  - [ ] 3.9 Integrate CodeEditor component into DebuggingDungeon
  - [ ] 3.10 Integrate ConsoleOutput component into DebuggingDungeon
  - [ ] 3.11 Add "Run Code" button that executes code and shows output
  - [ ] 3.12 Add "Submit" button to check solution correctness
  - [ ] 3.13 Add "Complete Solution" button that reveals answer (0 XP)
  - [ ] 3.14 Update XP logic: Complete Solution = 0 XP earned

- [ ] 4.0 Resume Storage with Supabase
  - [ ] 4.1 Create Supabase storage bucket named `resumes` (via Supabase dashboard or migration)
  - [ ] 4.2 Set up RLS policies for resumes bucket (user can only access their own)
  - [ ] 4.3 Create `src/app/api/resume/route.ts` API endpoint
  - [ ] 4.4 Implement POST handler for resume upload to Supabase storage
  - [ ] 4.5 Implement GET handler to fetch resume URL from profile
  - [ ] 4.6 Implement file naming convention: `{user_id}/resume.{extension}`
  - [ ] 4.7 Update `ResumeUpload.tsx` to upload to Supabase storage
  - [ ] 4.8 Update profile with `resume_url` and `resume_uploaded_at` after upload
  - [ ] 4.9 Add "Update Resume" button to allow re-uploading
  - [ ] 4.10 Create `src/components/ui/ProfileSection.tsx` to display resume info
  - [ ] 4.11 Show last uploaded resume (filename, date, download/preview link) in profile

- [ ] 5.0 Resume Parsing & Placeholder Implementation
  - [ ] 5.1 Create `src/lib/resume/placeholder.ts` with fake markdown resume content
  - [ ] 5.2 Include diverse skills in placeholder: Frontend, Backend, Debugging, DevOps, Testing, Database
  - [ ] 5.3 Assign proficiency levels (1-10) to each skill in placeholder
  - [ ] 5.4 Create `src/lib/resume/parser.ts` with parsing logic
  - [ ] 5.5 Implement skill extraction function (returns skill name + level)
  - [ ] 5.6 Update `src/app/api/parse-resume/route.ts` to use placeholder parser
  - [ ] 5.7 Store parsed skills in database linked to user profile
  - [ ] 5.8 Calculate skill levels: `final_level = max(resume_level, base_level + earned_xp_level)`
  - [ ] 5.9 Ensure earned_xp persists when resume is updated/re-parsed

- [ ] 6.0 Skill Radar Chart Visualization
  - [ ] 6.1 Create `src/components/ui/SkillRadarChart.tsx` using recharts RadarChart
  - [ ] 6.2 Configure polygonal shape based on number of skills
  - [ ] 6.3 Implement concentric level rings (1-10 scale) as background
  - [ ] 6.4 Display filled area representing user's proficiency levels
  - [ ] 6.5 Label each axis with skill name
  - [ ] 6.6 Add hover tooltip showing "Skill Name: Level X/10"
  - [ ] 6.7 Visually distinguish levelable skills (Debugging) with highlight/different color
  - [ ] 6.8 Make Debugging skill axis clickable → opens DebuggingDungeon slide panel
  - [ ] 6.9 Show "Coming soon" toast/message for non-levelable skill clicks
  - [ ] 6.10 Add "Level Up Skills" button to dashboard that displays/opens the radar chart
  - [ ] 6.11 Remove or deprecate old `SkillTree.tsx` component

- [ ] 7.0 AI Quest Generation with LangChain/OpenAI
  - [ ] 7.1 Create `src/lib/ai/langchain.ts` with LangChain configuration
  - [ ] 7.2 Initialize ChatOpenAI model with gpt-4o-mini (configurable)
  - [ ] 7.3 Create PromptTemplate for quest generation
  - [ ] 7.4 Update prompt to include: skills, skill levels, and career goal
  - [ ] 7.5 Refactor `src/app/api/generate-quest/route.ts` to use LangChain
  - [ ] 7.6 Implement quest generation chain: prompt → model → output parser
  - [ ] 7.7 Generate 3-5 relevant quests based on user profile
  - [ ] 7.8 Store generated quests in database
  - [ ] 7.9 Update `src/lib/ai/prompts.ts` for LangChain-compatible format
  - [ ] 7.10 Add error handling for API rate limits and failures

- [ ] 8.0 Goal Feature Implementation
  - [ ] 8.1 Create `src/app/api/goal/route.ts` API endpoint
  - [ ] 8.2 Implement POST handler to save goal to profile
  - [ ] 8.3 Implement GET handler to fetch current goal
  - [ ] 8.4 Implement DELETE handler to remove goal
  - [ ] 8.5 Create `src/components/ui/GoalInput.tsx` component
  - [ ] 8.6 Implement free-text input field for goal
  - [ ] 8.7 Add "Save Goal" button
  - [ ] 8.8 Display current goal prominently when set
  - [ ] 8.9 Add "Delete Goal" button (with confirmation)
  - [ ] 8.10 Integrate GoalInput into dashboard/profile section
  - [ ] 8.11 Pass goal to quest generation API when generating quests

- [ ] 9.0 Integration & Testing
  - [ ] 9.1 Update `src/app/dashboard/page.tsx` to integrate all new components
  - [ ] 9.2 Add SkillRadarChart to dashboard
  - [ ] 9.3 Add ProfileSection with resume display and Update Resume button
  - [ ] 9.4 Add GoalInput component to dashboard
  - [ ] 9.5 Test full flow: Upload resume → Parse → Skills displayed in radar chart
  - [ ] 9.6 Test debugging flow: Click Debugging in radar → Slide panel → Complete challenge
  - [ ] 9.7 Test Complete Solution button (verify 0 XP awarded)
  - [ ] 9.8 Test goal flow: Add goal → Generate quests → Verify goal influences quests
  - [ ] 9.9 Test resume update: Update resume → Verify XP persists → Skills recalculated
  - [ ] 9.10 Verify console.log outputs display correctly in debugging challenges
