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

- [x] 1.0 Database Schema Updates & Dependencies Setup
  - [x] 1.1 Create new migration file `002_feature_updates_v2.sql`
  - [x] 1.2 Add `goal` column (TEXT) to profiles table
  - [x] 1.3 Add `resume_url` column (TEXT) to profiles table
  - [x] 1.4 Add `resume_uploaded_at` column (TIMESTAMPTZ) to profiles table
  - [x] 1.5 Add `earned_xp` column (INTEGER DEFAULT 0) to skills table
  - [x] 1.6 Add `base_level` column (INTEGER DEFAULT 1) to skills table for resume-derived level
  - [x] 1.7 Install CodeMirror packages: `@uiw/react-codemirror`, `@codemirror/lang-javascript`
  - [x] 1.8 Install LangChain packages: `langchain`, `@langchain/openai`, `@langchain/core`
  - [x] 1.9 Install recharts for radar chart: `recharts`
  - [x] 1.10 Update `src/types/index.ts` with new types (Goal, updated Profile, updated Skill)

- [x] 2.0 Implement Slide Panel Component
  - [x] 2.1 Create `src/components/ui/SlidePanel.tsx` component
  - [x] 2.2 Implement slide-in animation from right side
  - [x] 2.3 Set panel width to 75% of viewport
  - [x] 2.4 Add dark overlay on remaining 25% (click to dismiss)
  - [x] 2.5 Add close button (X) in panel header
  - [x] 2.6 Accept children prop for panel content
  - [x] 2.7 Accept `isOpen` and `onClose` props for control
  - [x] 2.8 Add keyboard support (Escape to close)

- [x] 3.0 Implement Code Editor with CodeMirror (Debugging Interface)
  - [x] 3.1 Create `src/components/ui/CodeEditor.tsx` using `@uiw/react-codemirror`
  - [x] 3.2 Configure JavaScript/TypeScript syntax highlighting
  - [x] 3.3 Set up dark theme for editor
  - [x] 3.4 Accept `value` and `onChange` props
  - [x] 3.5 Create `src/components/ui/ConsoleOutput.tsx` for displaying logs
  - [x] 3.6 Create `src/lib/utils/codeRunner.ts` with sandboxed eval execution
  - [x] 3.7 Implement console.log capture by overriding console methods
  - [x] 3.8 Refactor `DebuggingDungeon.tsx` to use SlidePanel instead of modal
  - [x] 3.9 Integrate CodeEditor component into DebuggingDungeon
  - [x] 3.10 Integrate ConsoleOutput component into DebuggingDungeon
  - [x] 3.11 Add "Run Code" button that executes code and shows output
  - [x] 3.12 Add "Submit" button to check solution correctness
  - [x] 3.13 Add "Complete Solution" button that reveals answer (0 XP)
  - [x] 3.14 Update XP logic: Complete Solution = 0 XP earned

- [x] 4.0 Resume Storage with Supabase
  - [x] 4.1 Create Supabase storage bucket named `resumes` (via Supabase dashboard or migration)
  - [x] 4.2 Set up RLS policies for resumes bucket (user can only access their own)
  - [x] 4.3 Create `src/app/api/resume/route.ts` API endpoint
  - [x] 4.4 Implement POST handler for resume upload to Supabase storage
  - [x] 4.5 Implement GET handler to fetch resume URL from profile
  - [x] 4.6 Implement file naming convention: `{user_id}/resume.{extension}`
  - [x] 4.7 Update `ResumeUpload.tsx` to upload to Supabase storage
  - [x] 4.8 Update profile with `resume_url` and `resume_uploaded_at` after upload
  - [x] 4.9 Add "Update Resume" button to allow re-uploading
  - [x] 4.10 Create `src/components/ui/ProfileSection.tsx` to display resume info
  - [x] 4.11 Show last uploaded resume (filename, date, download/preview link) in profile

- [x] 5.0 Resume Parsing & Placeholder Implementation
  - [x] 5.1 Create `src/lib/resume/placeholder.ts` with fake markdown resume content
  - [x] 5.2 Include diverse skills in placeholder: Frontend, Backend, Debugging, DevOps, Testing, Database
  - [x] 5.3 Assign proficiency levels (1-10) to each skill in placeholder
  - [x] 5.4 Create `src/lib/resume/parser.ts` with parsing logic
  - [x] 5.5 Implement skill extraction function (returns skill name + level)
  - [x] 5.6 Update `src/app/api/parse-resume/route.ts` to use placeholder parser
  - [x] 5.7 Store parsed skills in database linked to user profile
  - [x] 5.8 Calculate skill levels: `final_level = max(resume_level, base_level + earned_xp_level)`
  - [x] 5.9 Ensure earned_xp persists when resume is updated/re-parsed

- [x] 6.0 Skill Radar Chart Visualization
  - [x] 6.1 Create `src/components/ui/SkillRadarChart.tsx` using recharts RadarChart
  - [x] 6.2 Configure polygonal shape based on number of skills
  - [x] 6.3 Implement concentric level rings (1-10 scale) as background
  - [x] 6.4 Display filled area representing user's proficiency levels
  - [x] 6.5 Label each axis with skill name
  - [x] 6.6 Add hover tooltip showing "Skill Name: Level X/10"
  - [x] 6.7 Visually distinguish levelable skills (Debugging) with highlight/different color
  - [x] 6.8 Make Debugging skill axis clickable → opens DebuggingDungeon slide panel
  - [x] 6.9 Show "Coming soon" toast/message for non-levelable skill clicks
  - [x] 6.10 Add "Level Up Skills" button to dashboard that displays/opens the radar chart
  - [x] 6.11 Remove or deprecate old `SkillTree.tsx` component

- [x] 7.0 AI Quest Generation with LangChain/OpenAI
  - [x] 7.1 Create `src/lib/ai/langchain.ts` with LangChain configuration
  - [x] 7.2 Initialize ChatOpenAI model with gpt-4o-mini (configurable)
  - [x] 7.3 Create PromptTemplate for quest generation
  - [x] 7.4 Update prompt to include: skills, skill levels, and career goal
  - [x] 7.5 Refactor `src/app/api/generate-quest/route.ts` to use LangChain
  - [x] 7.6 Implement quest generation chain: prompt → model → output parser
  - [x] 7.7 Generate 3-5 relevant quests based on user profile
  - [x] 7.8 Store generated quests in database
  - [x] 7.9 Update `src/lib/ai/prompts.ts` for LangChain-compatible format
  - [x] 7.10 Add error handling for API rate limits and failures

- [x] 8.0 Goal Feature Implementation
  - [x] 8.1 Create `src/app/api/goal/route.ts` API endpoint
  - [x] 8.2 Implement POST handler to save goal to profile
  - [x] 8.3 Implement GET handler to fetch current goal
  - [x] 8.4 Implement DELETE handler to remove goal
  - [x] 8.5 Create `src/components/ui/GoalInput.tsx` component
  - [x] 8.6 Implement free-text input field for goal
  - [x] 8.7 Add "Save Goal" button
  - [x] 8.8 Display current goal prominently when set
  - [x] 8.9 Add "Delete Goal" button (with confirmation)
  - [x] 8.10 Integrate GoalInput into dashboard/profile section
  - [x] 8.11 Pass goal to quest generation API when generating quests

- [x] 9.0 Integration & Testing
  - [x] 9.1 Update `src/app/dashboard/page.tsx` to integrate all new components
  - [x] 9.2 Add SkillRadarChart to dashboard
  - [x] 9.3 Add ProfileSection with resume display and Update Resume button
  - [x] 9.4 Add GoalInput component to dashboard
  - [ ] 9.5 Test full flow: Upload resume → Parse → Skills displayed in radar chart
  - [ ] 9.6 Test debugging flow: Click Debugging in radar → Slide panel → Complete challenge
  - [ ] 9.7 Test Complete Solution button (verify 0 XP awarded)
  - [ ] 9.8 Test goal flow: Add goal → Generate quests → Verify goal influences quests
  - [ ] 9.9 Test resume update: Update resume → Verify XP persists → Skills recalculated
  - [ ] 9.10 Verify console.log outputs display correctly in debugging challenges
