import type { ParsedSkill, SkillName, ResumeData } from '@/types';
import { getPlaceholderSkills, getPlaceholderResumeMarkdown } from './placeholder';

/**
 * Resume Parser
 * 
 * Currently uses placeholder data for development.
 * In production, this would integrate with an AI service or resume parsing API.
 */

// Map from placeholder skill names to our SkillName type
const SKILL_NAME_MAP: Record<string, SkillName> = {
  'Frontend': 'Frontend',
  'Backend': 'Backend',
  'Debugging': 'Debugging',
  'DevOps': 'DevOps',
  'Testing': 'Testing',
  'Database': 'Database',
  'System Design': 'System Design',
};

/**
 * Parse a resume file and extract skills
 * Currently returns placeholder data for development
 * 
 * @param fileContent - The file content (unused in placeholder mode)
 * @param fileType - The file MIME type (unused in placeholder mode)
 * @returns Parsed skills with levels
 */
export function parseResumeForSkills(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileContent?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileType?: string
): ParsedSkill[] {
  // TODO: In production, parse fileContent based on fileType
  // For now, return placeholder skills
  const placeholderSkills = getPlaceholderSkills();
  
  return placeholderSkills
    .filter(skill => SKILL_NAME_MAP[skill.name])
    .map(skill => ({
      name: SKILL_NAME_MAP[skill.name],
      level: skill.level,
      confidence: skill.confidence,
    }));
}

/**
 * Parse resume and extract full resume data
 * 
 * @param fileContent - The file content
 * @param source - Source of the resume ('resume' or 'github')
 * @returns Full resume data object
 */
export function parseResumeData(
  _fileContent?: string,
  source: 'resume' | 'github' = 'resume'
): ResumeData {
  const rawText = getPlaceholderResumeMarkdown();
  const skills = parseResumeForSkills();
  
  return {
    source,
    raw_text: rawText,
    skills: skills.map(s => s.name),
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        duration: 'Jan 2022 - Present',
        description: 'Led development of customer-facing dashboard serving 100K+ users',
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        duration: 'Jun 2020 - Dec 2021',
        description: 'Built real-time collaboration features using WebSockets',
      },
      {
        title: 'Junior Developer',
        company: 'WebAgency',
        duration: 'Jun 2019 - May 2020',
        description: 'Developed responsive web applications for clients',
      },
    ],
    projects: [
      {
        name: 'Real-time Collaborative Coding Platform',
        description: 'Senior project at UC Berkeley',
        technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of California, Berkeley',
        year: '2019',
      },
    ],
    languages: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
  };
}

/**
 * Calculate the final skill level considering both resume-parsed level and earned XP
 * 
 * Formula: final_level = max(base_level, base_level + earned_xp_level)
 * where earned_xp_level = floor(earned_xp / 100) (100 XP per level bonus)
 * 
 * @param baseLevel - The level derived from resume parsing (1-10)
 * @param earnedXp - XP earned from activities (debugging challenges, etc.)
 * @returns Final calculated skill level (capped at 10)
 */
export function calculateFinalSkillLevel(baseLevel: number, earnedXp: number): number {
  // Each 100 XP grants +1 level bonus
  const earnedXpBonus = Math.floor(earnedXp / 100);
  
  // Final level is base + bonus, capped at 10
  const finalLevel = Math.min(10, baseLevel + earnedXpBonus);
  
  // Ensure we never go below 1
  return Math.max(1, finalLevel);
}

/**
 * Merge new resume skills with existing skills, preserving earned XP
 * 
 * @param newSkills - Skills parsed from the new resume
 * @param existingSkills - Existing skills with earned XP
 * @returns Merged skills array
 */
export function mergeSkillsWithEarnedXp(
  newSkills: ParsedSkill[],
  existingSkills: Array<{ skill_name: string; earned_xp: number; base_level: number }>
): Array<{ skill_name: string; base_level: number; earned_xp: number; level: number }> {
  const existingMap = new Map(
    existingSkills.map(s => [s.skill_name, s])
  );

  return newSkills.map(newSkill => {
    const existing = existingMap.get(newSkill.name);
    const baseLevel = newSkill.level;
    const earnedXp = existing?.earned_xp || 0;
    
    return {
      skill_name: newSkill.name,
      base_level: baseLevel,
      earned_xp: earnedXp,
      level: calculateFinalSkillLevel(baseLevel, earnedXp),
    };
  });
}
