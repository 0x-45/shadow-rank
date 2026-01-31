'use client';

import { useState, useEffect, useCallback } from 'react';

// Force dynamic rendering (Supabase requires valid URL at runtime)
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import RankBadge from '@/components/ui/RankBadge';
import XPProgressBar from '@/components/ui/XPProgressBar';
import QuestCard from '@/components/ui/QuestCard';
import SkillTree from '@/components/ui/SkillTree';
import DebuggingDungeon from '@/components/ui/DebuggingDungeon';
import ResumeUpload from '@/components/ui/ResumeUpload';
import RankUpAnimation from '@/components/ui/RankUpAnimation';
import { getRandomChallenge } from '@/lib/challenges/debugging';
import type { User, Skill, Challenge, Rank, SkillName } from '@/types';

type DashboardState = 'loading' | 'upload' | 'awakening' | 'dashboard';

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [authUser, setAuthUser] = useState<{ email?: string; user_metadata?: { user_name?: string; avatar_url?: string } } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDungeon, setShowDungeon] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showRankUp, setShowRankUp] = useState(false);
  const [newRank, setNewRank] = useState<Rank | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Load user data
  const loadUserData = useCallback(async () => {
    // Check for dev mode (allows testing without auth)
    const urlParams = new URLSearchParams(window.location.search);
    const isDevMode = urlParams.get('dev') === 'true';

    const { data: { user: authUserData } } = await supabase.auth.getUser();
    
    if (!authUserData && !isDevMode) {
      router.push('/');
      return;
    }

    // In dev mode, use mock auth user
    if (isDevMode && !authUserData) {
      setAuthUser({
        user_metadata: {
          user_name: 'DevHunter',
          avatar_url: 'https://github.com/github.png',
        },
      });
      // Show upload screen for dev mode
      setState('upload');
      return;
    }

    // At this point authUserData is guaranteed to exist
    // (we've handled null cases above)
    setAuthUser(authUserData!);

    // Fetch profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserData!.id)
      .single();

    if (profile) {
      setUser(profile as User);
      
      // Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', authUserData!.id);
      
      if (skillsData) {
        setSkills(skillsData as Skill[]);
      }

      // If user has a rank and quest, show dashboard
      if (profile.rank && profile.current_quest) {
        setState('dashboard');
      } else {
        setState('upload');
      }
    } else {
      // New user - show upload screen
      setState('upload');
    }
  }, [supabase, router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Check if in dev mode
  const isDevMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dev') === 'true';

  // Handle resume upload
  const handleResumeUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // In dev mode, use mock data
      if (isDevMode) {
        setState('awakening');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        const mockProfile: User = {
          id: 'dev-user-123',
          github_id: 'devhunter',
          username: 'DevHunter',
          avatar_url: 'https://github.com/github.png',
          rank: 'E',
          xp: 0,
          current_quest: {
            id: 'quest-1',
            title: 'First Gate: Build Your Foundation',
            description: 'Create a simple full-stack application that demonstrates your coding abilities. This could be a todo app, blog, or any project that shows clean code structure.',
            requirements: ['Create a public GitHub repository', 'Include a README', 'Implement basic functionality'],
            xp_reward: 50,
            skill_focus: 'Full-Stack Development',
            difficulty: 'easy',
          },
          resume_data: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockSkills: Skill[] = [{
          id: 'skill-1',
          user_id: 'dev-user-123',
          skill_name: 'Debugging',
          level: 1,
          xp: 0,
          unlocked: true,
        }];

        setUser(mockProfile);
        setSkills(mockSkills);
        setNewRank('E');
        setShowRankUp(true);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call parse-resume API
      const parseResponse = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        const error = await parseResponse.json();
        throw new Error(error.error || 'Failed to parse resume');
      }

      const { resume_data } = await parseResponse.json();

      // Call awaken API
      setState('awakening');
      const awakenResponse = await fetch('/api/awaken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_data }),
      });

      if (!awakenResponse.ok) {
        const error = await awakenResponse.json();
        throw new Error(error.error || 'Failed to awaken');
      }

      const { profile } = await awakenResponse.json();
      
      setUser(profile);
      setNewRank(profile.rank);
      setShowRankUp(true);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setState('upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle GitHub profile fallback
  const handleGitHubFallback = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // In dev mode, use mock data
      if (isDevMode) {
        setState('awakening');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockProfile: User = {
          id: 'dev-user-123',
          github_id: 'devhunter',
          username: 'DevHunter',
          avatar_url: 'https://github.com/github.png',
          rank: 'D',
          xp: 50,
          current_quest: {
            id: 'quest-2',
            title: 'Second Gate: Prove Your Worth',
            description: 'Build a project that solves a real problem. Focus on clean architecture and good documentation.',
            requirements: ['Create a public GitHub repository', 'Add unit tests', 'Deploy to a hosting platform'],
            xp_reward: 75,
            skill_focus: 'Software Architecture',
            difficulty: 'medium',
          },
          resume_data: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockSkills: Skill[] = [{
          id: 'skill-1',
          user_id: 'dev-user-123',
          skill_name: 'Debugging',
          level: 1,
          xp: 0,
          unlocked: true,
        }];

        setUser(mockProfile);
        setSkills(mockSkills);
        setNewRank('D');
        setShowRankUp(true);
        return;
      }

      const username = authUser?.user_metadata?.user_name;
      if (!username) throw new Error('GitHub username not found');

      // Call awaken API with GitHub fallback flag
      setState('awakening');
      const awakenResponse = await fetch('/api/awaken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_username: username }),
      });

      if (!awakenResponse.ok) {
        const error = await awakenResponse.json();
        throw new Error(error.error || 'Failed to awaken');
      }

      const { profile } = await awakenResponse.json();
      
      setUser(profile);
      setNewRank(profile.rank);
      setShowRankUp(true);

    } catch (error) {
      console.error('Fallback error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to use GitHub profile');
      setState('upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle quest submission
  const handleQuestSubmit = async (repoUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // In dev mode, simulate verification
      if (isDevMode) {
        // Basic URL validation
        if (!repoUrl.includes('github.com')) {
          return { success: false, error: 'Please enter a valid GitHub URL' };
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update mock user with XP gain
        if (user) {
          const newXP = user.xp + 50;
          const newRank = newXP >= 100 ? 'D' : user.rank;
          const rankedUp = newRank !== user.rank;

          setUser({
            ...user,
            xp: newXP,
            rank: newRank as Rank,
            current_quest: {
              id: 'quest-next',
              title: 'Continue Your Journey',
              description: 'Keep building and improving. Create another project that demonstrates your growth.',
              requirements: ['New GitHub repository', 'Improved code quality', 'Better documentation'],
              xp_reward: 75,
              skill_focus: 'Continuous Improvement',
              difficulty: 'medium',
            },
          });

          if (rankedUp) {
            setNewRank(newRank as Rank);
            setShowRankUp(true);
          }
        }

        return { success: true };
      }

      const response = await fetch('/api/verify-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Verification failed' };
      }

      // Update local state
      if (data.xp_calculation?.rank_up && data.xp_calculation?.new_rank) {
        setNewRank(data.xp_calculation.new_rank);
        setShowRankUp(true);
      }

      // Reload user data
      await loadUserData();

      return { success: true };
    } catch (error) {
      console.error('Quest submit error:', error);
      return { success: false, error: 'Failed to submit quest' };
    }
  };

  // Handle skill click
  const handleSkillClick = (skillName: SkillName) => {
    if (skillName === 'Debugging') {
      const challenge = getRandomChallenge(completedChallenges);
      setCurrentChallenge(challenge);
      setShowDungeon(true);
    }
  };

  // Handle dungeon challenge complete
  const handleChallengeComplete = async (success: boolean, xpGained: number) => {
    if (success && currentChallenge) {
      setCompletedChallenges((prev) => [...prev, currentChallenge.id]);

      // In dev mode, update state directly
      if (isDevMode) {
        const debuggingSkill = skills.find((s) => s.skill_name === 'Debugging');
        if (debuggingSkill && debuggingSkill.level < 10) {
          setSkills((prev) =>
            prev.map((s) =>
              s.skill_name === 'Debugging' ? { ...s, level: s.level + 1 } : s
            )
          );
        }

        if (user) {
          const newXP = user.xp + xpGained;
          setUser({ ...user, xp: newXP });
        }
        return;
      }

      // Update skill level in Supabase
      const debuggingSkill = skills.find((s) => s.skill_name === 'Debugging');
      if (debuggingSkill && debuggingSkill.level < 10) {
        const { data: updatedSkill } = await supabase
          .from('skills')
          .update({ level: debuggingSkill.level + 1 })
          .eq('id', debuggingSkill.id)
          .select()
          .single();

        if (updatedSkill) {
          setSkills((prev) =>
            prev.map((s) => (s.id === updatedSkill.id ? updatedSkill as Skill : s))
          );
        }
      }

      // Update user XP
      if (user) {
        const newXP = user.xp + xpGained;
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .update({ xp: newXP })
          .eq('id', user.id)
          .select()
          .single();

        if (updatedProfile) {
          setUser(updatedProfile as User);
        }
      }
    }
  };

  // Handle next challenge
  const handleNextChallenge = () => {
    const challenge = getRandomChallenge(completedChallenges);
    setCurrentChallenge(challenge);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Handle rank up animation complete
  const handleRankUpComplete = () => {
    setShowRankUp(false);
    setNewRank(null);
    setState('dashboard');
  };

  // Render based on state
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-accent text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-card-border bg-card-bg/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-purple-accent">Shadow Rank</span>
          </div>
          <div className="flex items-center gap-4">
            {authUser && (
              <div className="flex items-center gap-2">
                {authUser.user_metadata?.avatar_url ? (
                  <img
                    src={authUser.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-400">
                  {authUser.user_metadata?.user_name || 'Hunter'}
                </span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {state === 'upload' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Begin Your Awakening
              </h1>
              <p className="text-gray-400 max-w-md mx-auto">
                Upload your resume to discover your Hunter Rank and receive your first quest.
              </p>
            </div>
            <ResumeUpload
              onUpload={handleResumeUpload}
              onSkip={handleGitHubFallback}
              isLoading={isUploading}
              error={uploadError}
            />
          </div>
        )}

        {state === 'awakening' && (
          <div className="py-24 text-center">
            <div className="text-6xl mb-8 animate-pulse">⚔️</div>
            <h2 className="text-2xl font-bold text-purple-accent mb-4">
              Analyzing Your Power...
            </h2>
            <p className="text-gray-400">
              The system is evaluating your skills and experience.
            </p>
          </div>
        )}

        {state === 'dashboard' && user && (
          <div className="space-y-8">
            {/* Rank and XP Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl bg-card-bg border border-card-border">
              <RankBadge rank={user.rank} size="xl" animated />
              <div className="flex-1 w-full">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome back, {authUser?.user_metadata?.user_name || 'Hunter'}
                </h2>
                <p className="text-gray-400 mb-4">
                  Continue your journey to become a Shadow Monarch.
                </p>
                <XPProgressBar currentXP={user.xp} currentRank={user.rank} />
              </div>
            </div>

            {/* Quest Section */}
            <QuestCard
              quest={user.current_quest}
              onSubmit={handleQuestSubmit}
            />

            {/* Skill Tree Section */}
            <SkillTree
              skills={skills}
              onSkillClick={handleSkillClick}
            />
          </div>
        )}
      </main>

      {/* Debugging Dungeon Modal */}
      {showDungeon && currentChallenge && (
        <DebuggingDungeon
          challenge={currentChallenge}
          skillLevel={skills.find((s) => s.skill_name === 'Debugging')?.level || 1}
          onComplete={handleChallengeComplete}
          onClose={() => setShowDungeon(false)}
          onNextChallenge={handleNextChallenge}
        />
      )}

      {/* Rank Up Animation */}
      {showRankUp && newRank && (
        <RankUpAnimation
          newRank={newRank}
          onComplete={handleRankUpComplete}
        />
      )}
    </div>
  );
}
