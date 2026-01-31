// Shadow Rank - TypeScript Type Definitions

/**
 * Rank levels inspired by Solo Leveling
 * E (lowest) -> D -> C -> B -> A (highest)
 */
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A';

/**
 * User's career goal
 */
export interface Goal {
  text: string;
  created_at: string;
  updated_at: string;
}

/**
 * User profile stored in Supabase
 */
export interface User {
  id: string;
  github_id: string;
  username: string;
  avatar_url: string;
  rank: Rank;
  xp: number;
  current_quest: Quest | null;
  resume_data: ResumeData | null;
  goal: string | null; // User's career goal
  resume_url: string | null; // URL to uploaded resume in Supabase storage
  resume_uploaded_at: string | null; // When resume was last uploaded
  created_at: string;
  updated_at: string;
}

/**
 * Parsed resume data from Reducto or GitHub fallback
 */
export interface ResumeData {
  source: 'resume' | 'github';
  raw_text?: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  languages: string[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

/**
 * Quest assigned to the user
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  xp_reward: number;
  skill_focus: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repo_url?: string; // Filled when quest is submitted
  completed_at?: string;
}

/**
 * Skill in the skill tree
 */
export interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  level: number; // 1-10, calculated as max(base_level, base_level + earned_xp_level)
  base_level: number; // 1-10, derived from resume parsing
  xp: number; // Legacy field for compatibility
  earned_xp: number; // XP earned from activities (debugging challenges, etc.)
  unlocked: boolean;
  icon?: string;
}

/**
 * Skill data for radar chart display
 */
export interface SkillRadarData {
  skill_name: string;
  level: number;
  base_level: number;
  earned_xp: number;
  is_levelable: boolean; // Can earn XP through activities (e.g., Debugging)
  full_mark: number; // Max value (10 for skills)
}

/**
 * Available skills in the system
 */
export type SkillName = 
  | 'Debugging'
  | 'System Design'
  | 'Frontend'
  | 'Backend'
  | 'DevOps'
  | 'Testing'
  | 'Database';

/**
 * Skills that can be leveled up through activities
 */
export const LEVELABLE_SKILLS: SkillName[] = ['Debugging'];

/**
 * Parsed skill from resume with proficiency level
 */
export interface ParsedSkill {
  name: SkillName;
  level: number; // 1-10
  confidence: number; // 0-1, how confident we are in this assessment
}

/**
 * Debugging challenge for the dungeon
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  buggy_code: string;
  expected_output: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp_reward: number;
}

/**
 * Result from the AI awakening process
 */
export interface AwakeningResult {
  rank: Rank;
  rank_reasoning: string;
  gaps: SkillGap[];
  quest: Quest;
  message: string; // Personalized awakening message
}

/**
 * Identified skill gap from resume analysis
 */
export interface SkillGap {
  skill: string;
  current_level: 'none' | 'beginner' | 'intermediate' | 'advanced';
  recommended_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'low' | 'medium' | 'high';
}

/**
 * Quest history entry
 */
export interface QuestHistoryItem {
  id: string;
  user_id: string;
  quest_title: string;
  quest_description: string;
  repo_url: string;
  xp_earned: number;
  completed_at: string;
}

/**
 * XP calculation result
 */
export interface XPCalculation {
  base_xp: number;
  recency_bonus: number;
  total_xp: number;
  new_total: number;
  rank_up: boolean;
  new_rank?: Rank;
}

/**
 * GitHub repository info for verification
 */
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  pushed_at: string;
  created_at: string;
  language: string;
  stargazers_count: number;
  is_valid: boolean;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ParseResumeResponse {
  resume_data: ResumeData;
}

export interface AwakenResponse {
  awakening: AwakeningResult;
  profile: User;
}

export interface VerifyGitHubResponse {
  repo: GitHubRepo;
  xp_calculation: XPCalculation;
  updated_profile: User;
}
