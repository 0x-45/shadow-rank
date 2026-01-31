import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyGitHubRepo } from '@/lib/utils/github';
import { calculateQuestXP, calculateXPGain, isRecentlyPushed, XP_REWARDS } from '@/lib/utils/xp';
import type { Rank } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repo_url } = await request.json();

    if (!repo_url) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Verify the GitHub repository
    const verification = await verifyGitHubRepo(repo_url);

    if (!verification.valid || !verification.repo) {
      return NextResponse.json(
        { error: verification.error || 'Repository verification failed' },
        { status: 400 }
      );
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check for duplicate submission
    const { data: existingSubmission } = await supabase
      .from('quest_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('repo_url', verification.repo.html_url)
      .single();

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this repository for a previous quest' },
        { status: 400 }
      );
    }

    // Calculate XP
    const recentlyPushed = isRecentlyPushed(verification.repo.pushed_at);
    const questXP = calculateQuestXP(recentlyPushed);
    const xpGain = calculateXPGain(
      profile.xp,
      profile.rank as Rank,
      questXP.total_xp
    );

    // Save quest to history
    const currentQuest = profile.current_quest;
    if (currentQuest) {
      await supabase.from('quest_history').insert({
        user_id: user.id,
        quest_title: currentQuest.title,
        quest_description: currentQuest.description,
        repo_url: verification.repo.html_url,
        xp_earned: questXP.total_xp,
      });
    }

    // Update profile with new XP and rank
    const updateData: {
      xp: number;
      rank?: Rank;
      current_quest?: object | null;
      updated_at: string;
    } = {
      xp: xpGain.new_total,
      updated_at: new Date().toISOString(),
    };

    if (xpGain.rank_up && xpGain.new_rank) {
      updateData.rank = xpGain.new_rank;
    }

    // Generate next quest if not at max rank
    if (profile.rank !== 'A') {
      // For MVP, use a simple next quest
      updateData.current_quest = generateNextQuest(xpGain.new_rank || profile.rank);
    } else {
      updateData.current_quest = null;
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw new Error('Failed to update profile');
    }

    return NextResponse.json({
      repo: verification.repo,
      xp_calculation: {
        ...questXP,
        new_total: xpGain.new_total,
        rank_up: xpGain.rank_up,
        new_rank: xpGain.new_rank,
      },
      updated_profile: updatedProfile,
    });

  } catch (error) {
    console.error('Verify GitHub error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Generate a simple next quest for the MVP
function generateNextQuest(rank: Rank): object | null {
  const quests: Record<Rank, object | null> = {
    E: {
      id: 'quest-d-rank',
      title: 'The Second Gate: Strengthen Your Arsenal',
      description: 'Build a more complex project that demonstrates multiple skills. Include user authentication, data persistence, and a polished UI.',
      requirements: [
        'Implement user authentication',
        'Add database integration',
        'Create a responsive design',
        'Write comprehensive README',
      ],
      xp_reward: 75,
      skill_focus: 'Full-Stack Development',
      difficulty: 'medium',
    },
    D: {
      id: 'quest-c-rank',
      title: 'Gate of Mastery: Build for Scale',
      description: 'Create a project that handles real-world complexity. Focus on clean architecture, testing, and performance optimization.',
      requirements: [
        'Implement proper error handling',
        'Add unit tests',
        'Optimize for performance',
        'Document your architecture decisions',
      ],
      xp_reward: 100,
      skill_focus: 'Software Architecture',
      difficulty: 'medium',
    },
    C: {
      id: 'quest-b-rank',
      title: 'Elite Challenge: Lead the Way',
      description: 'Contribute to open source or build a tool that helps other developers. Show leadership and community impact.',
      requirements: [
        'Create or contribute to open source',
        'Write technical documentation',
        'Include contribution guidelines',
        'Engage with the community',
      ],
      xp_reward: 150,
      skill_focus: 'Technical Leadership',
      difficulty: 'hard',
    },
    B: {
      id: 'quest-a-rank',
      title: 'Final Gate: Shadow Monarch Ascension',
      description: 'Build something that pushes boundaries. Create innovative solutions, mentor others, or make significant open source contributions.',
      requirements: [
        'Demonstrate technical innovation',
        'Show measurable impact',
        'Include advanced features',
        'Create comprehensive documentation',
      ],
      xp_reward: 200,
      skill_focus: 'Innovation & Impact',
      difficulty: 'hard',
    },
    A: null,
  };

  return quests[rank];
}
