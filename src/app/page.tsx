'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering (Supabase requires valid URL at runtime)
export const dynamic = 'force-dynamic';
import { Github, Zap, Shield, Target, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: 'read:user user:email',
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-accent text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-dark/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-dark/10 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Rank Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-bg border border-card-border">
            <Shield className="w-4 h-4 text-purple-accent" />
            <span className="text-sm text-gray-400">Solo Leveling Career System</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-glow text-purple-glow">Awaken</span>
            <br />
            <span className="text-foreground">Your Career</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your professional growth into an epic journey.
            <br className="hidden md:block" />
            Upload your resume. Discover your rank. Complete quests. <span className="text-purple-accent">Level up.</span>
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-purple-accent hover:bg-purple-glow text-white font-semibold rounded-xl transition-all duration-300 glow-pulse hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-6 h-6" />
            <span>{isLoading ? 'Connecting...' : 'Sign in with GitHub'}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Free to use • No credit card required
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="AI-Powered Awakening"
            description="Upload your resume and let AI analyze your skills, identify gaps, and assign your starting rank."
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Personalized Quests"
            description="Receive tailored main quests designed to fill your career gaps. Verify completion via GitHub."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Skill Grinding"
            description="Enter the Debugging Dungeon to solve challenges and level up your skills independently."
          />
        </div>

        {/* Rank Preview */}
        <div className="mt-24 text-center">
          <p className="text-gray-500 mb-6">Hunter Ranks</p>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {['E', 'D', 'C', 'B', 'A'].map((rank, index) => (
              <div
                key={rank}
                className="relative"
                style={{
                  opacity: 0.4 + index * 0.15,
                }}
              >
                <span
                  className={`text-3xl md:text-5xl font-bold ${
                    rank === 'A' ? 'text-purple-accent text-glow' : 'text-gray-600'
                  }`}
                >
                  {rank}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-sm">
        Built for the modern hunter • Inspired by Solo Leveling
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-purple-accent/50 transition-colors">
      <div className="text-purple-accent mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
