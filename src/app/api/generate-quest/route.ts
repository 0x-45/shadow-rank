import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  AWAKENING_SYSTEM_PROMPT,
  generateNextQuestPrompt,
  parseAIResponse,
} from '@/lib/ai/prompts';
import type { Rank, Quest, SkillGap } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get quest history
    const { data: questHistory } = await supabase
      .from('quest_history')
      .select('quest_title')
      .eq('user_id', user.id);

    const completedQuests = questHistory?.map(q => q.quest_title) || [];

    // Generate next quest using AI or fallback
    let nextQuest: Quest;
    
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (openaiKey && !openaiKey.includes('your_')) {
      nextQuest = await generateQuestWithOpenAI(
        profile.rank,
        completedQuests,
        openaiKey
      );
    } else if (groqKey && !groqKey.includes('your_')) {
      nextQuest = await generateQuestWithGroq(
        profile.rank,
        completedQuests,
        groqKey
      );
    } else {
      nextQuest = getFallbackQuest(profile.rank);
    }

    // Update profile with new quest
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        current_quest: nextQuest,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error('Failed to update profile with new quest');
    }

    return NextResponse.json({
      quest: nextQuest,
      profile: updatedProfile,
    });

  } catch (error) {
    console.error('Generate quest error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quest' },
      { status: 500 }
    );
  }
}

async function generateQuestWithOpenAI(
  rank: Rank,
  completedQuests: string[],
  apiKey: string
): Promise<Quest> {
  try {
    const gaps: SkillGap[] = [
      { skill: 'Project Building', current_level: 'beginner', recommended_level: 'intermediate', priority: 'high' }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AWAKENING_SYSTEM_PROMPT },
          { role: 'user', content: generateNextQuestPrompt(rank, completedQuests, gaps) },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = parseAIResponse<{ quest: Quest }>(content);

    if (parsed?.quest) {
      return parsed.quest;
    }

    throw new Error('Failed to parse quest');
  } catch (error) {
    console.error('OpenAI quest generation error:', error);
    return getFallbackQuest(rank);
  }
}

async function generateQuestWithGroq(
  rank: Rank,
  completedQuests: string[],
  apiKey: string
): Promise<Quest> {
  try {
    const gaps: SkillGap[] = [
      { skill: 'Project Building', current_level: 'beginner', recommended_level: 'intermediate', priority: 'high' }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: AWAKENING_SYSTEM_PROMPT },
          { role: 'user', content: generateNextQuestPrompt(rank, completedQuests, gaps) },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = parseAIResponse<{ quest: Quest }>(content);

    if (parsed?.quest) {
      return parsed.quest;
    }

    throw new Error('Failed to parse quest');
  } catch (error) {
    console.error('Groq quest generation error:', error);
    return getFallbackQuest(rank);
  }
}

function getFallbackQuest(rank: Rank): Quest {
  const quests: Record<Rank, Quest> = {
    E: {
      id: `quest-e-${Date.now()}`,
      title: 'First Gate: Build Your Foundation',
      description: 'Create a simple project that demonstrates clean code and basic functionality. This could be a CLI tool, a small web app, or an automation script.',
      requirements: [
        'Create a public GitHub repository',
        'Include a README with setup instructions',
        'Write clean, readable code',
      ],
      xp_reward: 50,
      skill_focus: 'Fundamentals',
      difficulty: 'easy',
    },
    D: {
      id: `quest-d-${Date.now()}`,
      title: 'Second Gate: Expand Your Arsenal',
      description: 'Build a more complex project with multiple features. Focus on code organization and best practices.',
      requirements: [
        'Implement at least 3 distinct features',
        'Add proper error handling',
        'Include documentation',
      ],
      xp_reward: 75,
      skill_focus: 'Architecture',
      difficulty: 'medium',
    },
    C: {
      id: `quest-c-${Date.now()}`,
      title: 'Third Gate: Master Your Craft',
      description: 'Create a project that solves a real problem. Include testing and deployment.',
      requirements: [
        'Write unit tests',
        'Deploy to a hosting platform',
        'Add CI/CD pipeline',
      ],
      xp_reward: 100,
      skill_focus: 'DevOps',
      difficulty: 'medium',
    },
    B: {
      id: `quest-b-${Date.now()}`,
      title: 'Elite Challenge: Lead and Innovate',
      description: 'Contribute to open source or create a tool that helps other developers.',
      requirements: [
        'Make meaningful open source contributions',
        'Write technical blog posts',
        'Mentor other developers',
      ],
      xp_reward: 150,
      skill_focus: 'Leadership',
      difficulty: 'hard',
    },
    A: {
      id: `quest-a-${Date.now()}`,
      title: 'Shadow Monarch: Transcend',
      description: 'You have reached the pinnacle. Continue pushing boundaries and inspiring others.',
      requirements: [
        'Create innovative solutions',
        'Build a community',
        'Share your knowledge',
      ],
      xp_reward: 200,
      skill_focus: 'Innovation',
      difficulty: 'hard',
    },
  };

  return quests[rank];
}
