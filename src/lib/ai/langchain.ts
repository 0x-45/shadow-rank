import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import type { Quest, SkillName } from '@/types';

/**
 * LangChain configuration for AI quest generation
 */

// Initialize the ChatOpenAI model
export function createChatModel(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  
  if (!key || key.includes('your_')) {
    return null;
  }

  return new ChatOpenAI({
    openAIApiKey: key,
    modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1500,
  });
}

// Quest generation prompt template
export const QUEST_GENERATION_PROMPT = PromptTemplate.fromTemplate(`
You are a gamified career development AI assistant for "Shadow Rank", a platform inspired by Solo Leveling where developers level up their skills through quests.

Generate {numQuests} unique coding quests for a developer with the following profile:

## Current Skills (Level 1-10):
{skills}

## Career Goal:
{goal}

## Current Rank: {rank}
## Current XP: {xp}

## Guidelines for Quest Generation:
1. Each quest should be achievable by building a GitHub project
2. Focus on skills that need improvement (lower levels) or align with the career goal
3. Make quests progressively challenging based on the user's rank
4. Include clear, measurable requirements
5. Quests should be fun and engaging with creative titles

## Difficulty Guidelines by Rank:
- E Rank: Basic projects, single feature focus (50 XP)
- D Rank: Multi-feature projects, basic architecture (75 XP)
- C Rank: Complex projects, good practices required (100 XP)
- B Rank: Production-ready projects, advanced patterns (150 XP)
- A Rank: Innovative projects, system design focus (200 XP)

Return the quests as a JSON array with this exact structure (no markdown, just pure JSON):
[
  {{
    "title": "Quest title (creative, game-like)",
    "description": "Detailed description of what to build",
    "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
    "xp_reward": 50,
    "skill_focus": "Skill name",
    "difficulty": "easy"
  }}
]

Only return valid JSON, no explanations or markdown formatting.
`);

// Parse quest JSON response
export function parseQuestResponse(response: string): Quest[] {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    return parsed.map((q, index) => ({
      id: `quest-${Date.now()}-${index}`,
      title: q.title || `Quest ${index + 1}`,
      description: q.description || '',
      requirements: Array.isArray(q.requirements) ? q.requirements : [],
      xp_reward: typeof q.xp_reward === 'number' ? q.xp_reward : 50,
      skill_focus: q.skill_focus || 'General',
      difficulty: q.difficulty || 'easy',
    }));
  } catch (error) {
    console.error('Failed to parse quest response:', error);
    throw new Error('Failed to parse AI response');
  }
}

// Format skills for the prompt
export function formatSkillsForPrompt(
  skills: Array<{ skill_name: string; level: number }>
): string {
  if (!skills.length) {
    return 'No skills assessed yet';
  }

  return skills
    .map(s => `- ${s.skill_name}: Level ${s.level}/10`)
    .join('\n');
}

// Create the quest generation chain
export function createQuestGenerationChain(apiKey?: string) {
  const model = createChatModel(apiKey);
  
  if (!model) {
    return null;
  }

  return RunnableSequence.from([
    QUEST_GENERATION_PROMPT,
    model,
    new StringOutputParser(),
  ]);
}

// Generate quests using LangChain
export async function generateQuestsWithLangChain(params: {
  skills: Array<{ skill_name: string; level: number }>;
  goal: string | null;
  rank: string;
  xp: number;
  numQuests?: number;
  apiKey?: string;
}): Promise<Quest[]> {
  const { skills, goal, rank, xp, numQuests = 3, apiKey } = params;

  const chain = createQuestGenerationChain(apiKey);
  
  if (!chain) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await chain.invoke({
      skills: formatSkillsForPrompt(skills),
      goal: goal || 'Become a better developer',
      rank,
      xp,
      numQuests: numQuests.toString(),
    });

    return parseQuestResponse(response);
  } catch (error) {
    console.error('LangChain quest generation error:', error);
    throw error;
  }
}

// Fallback quests when AI is not available
export function getFallbackQuests(rank: string, skillFocus?: SkillName): Quest[] {
  const baseXP = rank === 'E' ? 50 : rank === 'D' ? 75 : rank === 'C' ? 100 : rank === 'B' ? 150 : 200;
  const difficulty = rank === 'E' ? 'easy' : rank === 'D' ? 'easy' : rank === 'C' ? 'medium' : rank === 'B' ? 'medium' : 'hard';

  const quests: Quest[] = [
    {
      id: `quest-fallback-${Date.now()}-1`,
      title: 'The First Gate: Build Your Foundation',
      description: 'Create a project that showcases your coding abilities. This could be a portfolio site, a utility tool, or any project that demonstrates clean code.',
      requirements: [
        'Create a public GitHub repository',
        'Include a comprehensive README',
        'Write clean, well-documented code',
      ],
      xp_reward: baseXP,
      skill_focus: skillFocus || 'Frontend',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    },
    {
      id: `quest-fallback-${Date.now()}-2`,
      title: 'Debug Master: Fix the Impossible',
      description: 'Find an open source project with open issues and contribute a bug fix. Debugging is a crucial skill for any developer.',
      requirements: [
        'Find an open source project on GitHub',
        'Identify and fix a bug',
        'Submit a pull request with proper documentation',
      ],
      xp_reward: baseXP + 25,
      skill_focus: 'Debugging',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    },
    {
      id: `quest-fallback-${Date.now()}-3`,
      title: 'Test Guardian: Ensure Quality',
      description: 'Add comprehensive tests to one of your existing projects. Quality assurance separates good developers from great ones.',
      requirements: [
        'Add unit tests with at least 70% coverage',
        'Set up CI/CD pipeline for automated testing',
        'Document your testing strategy',
      ],
      xp_reward: baseXP + 25,
      skill_focus: 'Testing',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    },
  ];

  return quests;
}
