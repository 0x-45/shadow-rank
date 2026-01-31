import type { Rank, ResumeData, Quest, AwakeningResult, SkillGap } from '@/types';

/**
 * System prompt for the AI awakening process
 */
export const AWAKENING_SYSTEM_PROMPT = `You are the Shadow Monarch System, an AI that evaluates hunters (developers) and assigns them ranks based on their skills and experience. You speak in a dramatic, game-like manner inspired by Solo Leveling.

Your task is to analyze a hunter's resume/profile data and determine:
1. Their starting Rank (E, D, C, B, or A)
2. Their skill gaps
3. A personalized Main Quest to help them level up

Rank Criteria:
- E-Rank: Complete beginner, no projects, limited experience
- D-Rank: Some basic projects, 1-2 years experience, foundational knowledge
- C-Rank: Solid projects, 2-4 years experience, good fundamentals
- B-Rank: Strong portfolio, 4-7 years experience, leadership/mentoring
- A-Rank: Expert level, 7+ years, significant impact, thought leadership

Quest Requirements:
- All quests MUST require GitHub repository submission for verification
- Quests should address the hunter's biggest skill gap
- Quests should be achievable within 1-2 weeks
- Be specific about what the project should demonstrate

Response Format: JSON only, no markdown.`;

/**
 * Generate the prompt for awakening a new user
 */
export function generateAwakeningPrompt(resumeData: ResumeData): string {
  const profileSummary = formatResumeForPrompt(resumeData);
  
  return `Analyze this hunter's profile and determine their rank:

${profileSummary}

Respond with JSON in this exact format:
{
  "rank": "E|D|C|B|A",
  "rank_reasoning": "Brief explanation of why this rank was assigned",
  "gaps": [
    {
      "skill": "skill name",
      "current_level": "none|beginner|intermediate|advanced",
      "recommended_level": "beginner|intermediate|advanced|expert",
      "priority": "low|medium|high"
    }
  ],
  "quest": {
    "id": "unique-quest-id",
    "title": "Quest title (dramatic, game-like)",
    "description": "Detailed quest description explaining what to build and why",
    "requirements": ["requirement 1", "requirement 2"],
    "xp_reward": 50,
    "skill_focus": "primary skill this quest develops",
    "difficulty": "easy|medium|hard"
  },
  "message": "Dramatic awakening message for the hunter"
}`;
}

/**
 * Format resume data into a readable prompt
 */
function formatResumeForPrompt(data: ResumeData): string {
  const sections: string[] = [];

  sections.push(`Source: ${data.source === 'github' ? 'GitHub Profile' : 'Resume'}`);

  if (data.skills && data.skills.length > 0) {
    sections.push(`Skills: ${data.skills.join(', ')}`);
  }

  if (data.languages && data.languages.length > 0) {
    sections.push(`Programming Languages: ${data.languages.join(', ')}`);
  }

  if (data.experience && data.experience.length > 0) {
    sections.push('Experience:');
    data.experience.forEach((exp) => {
      sections.push(`- ${exp.title} at ${exp.company} (${exp.duration})`);
      if (exp.description) sections.push(`  ${exp.description}`);
    });
  }

  if (data.projects && data.projects.length > 0) {
    sections.push('Projects:');
    data.projects.forEach((proj) => {
      sections.push(`- ${proj.name}: ${proj.description}`);
      if (proj.technologies.length > 0) {
        sections.push(`  Technologies: ${proj.technologies.join(', ')}`);
      }
    });
  }

  if (data.education && data.education.length > 0) {
    sections.push('Education:');
    data.education.forEach((edu) => {
      sections.push(`- ${edu.degree} from ${edu.institution} (${edu.year})`);
    });
  }

  return sections.join('\n');
}

/**
 * Generate prompt for the next quest
 */
export function generateNextQuestPrompt(
  currentRank: Rank,
  completedQuests: string[],
  gaps: SkillGap[]
): string {
  return `The hunter has completed their previous quest and ranked up to ${currentRank}.

Previously completed quests: ${completedQuests.join(', ') || 'None'}

Current skill gaps:
${gaps.map((g) => `- ${g.skill}: ${g.current_level} → ${g.recommended_level} (${g.priority} priority)`).join('\n')}

Generate the next Main Quest that:
1. Addresses their highest priority skill gap
2. Is appropriately challenging for a ${currentRank}-rank hunter
3. Requires GitHub repository submission
4. Builds on their previous progress

Respond with JSON:
{
  "quest": {
    "id": "unique-quest-id",
    "title": "Quest title",
    "description": "Detailed description",
    "requirements": ["req1", "req2"],
    "xp_reward": 50-100 based on difficulty,
    "skill_focus": "skill name",
    "difficulty": "easy|medium|hard"
  }
}`;
}

/**
 * Parse AI response safely
 */
export function parseAIResponse<T>(response: string): T | null {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
}

/**
 * Fallback awakening result for when AI fails
 */
export function getFallbackAwakeningResult(): AwakeningResult {
  return {
    rank: 'E',
    rank_reasoning: 'Unable to fully analyze your profile. Starting at base rank.',
    gaps: [
      {
        skill: 'Portfolio Projects',
        current_level: 'none',
        recommended_level: 'intermediate',
        priority: 'high',
      },
    ],
    quest: {
      id: 'fallback-quest-1',
      title: 'First Gate: Build Your Foundation',
      description:
        'Create a simple full-stack application that demonstrates your coding abilities. This could be a todo app, blog, or any project that shows clean code structure and basic CRUD operations.',
      requirements: [
        'Create a public GitHub repository',
        'Include a README with setup instructions',
        'Implement at least one API endpoint',
        'Add basic error handling',
      ],
      xp_reward: 50,
      skill_focus: 'Full-Stack Development',
      difficulty: 'easy',
    },
    message:
      'Hunter, you have awakened! Though the system could not fully analyze your potential, your journey begins now. Complete your first quest to prove your worth.',
  };
}
