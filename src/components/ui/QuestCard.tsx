'use client';

import { useState } from 'react';
import { Target, Github, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest | null;
  onSubmit: (repoUrl: string) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

export default function QuestCard({ quest, onSubmit, isLoading = false }: QuestCardProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!quest) {
    return (
      <div className="p-6 rounded-2xl bg-card-bg border border-card-border">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-500">Main Quest</h2>
        </div>
        <p className="text-gray-500">
          Complete the awakening process to receive your first quest.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    const result = await onSubmit(repoUrl.trim());

    if (result.success) {
      setSuccess(true);
      setRepoUrl('');
    } else {
      setError(result.error || 'Failed to verify repository');
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-card-bg border border-success/50">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-success" />
          <h2 className="text-xl font-semibold text-success">Quest Complete!</h2>
        </div>
        <p className="text-gray-400">
          Congratulations, Hunter! Your submission has been verified. You have ranked up!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-purple-accent/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-dark/30">
            <Target className="w-5 h-5 text-purple-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{quest.title}</h2>
            <span className="text-xs text-purple-accent capitalize">{quest.difficulty} Quest</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-dark/30 text-purple-accent text-sm font-medium">
          +{quest.xp_reward} XP
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-4 leading-relaxed">{quest.description}</p>

      {/* Requirements */}
      {quest.requirements && quest.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Requirements:</p>
          <ul className="space-y-1">
            {quest.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-purple-accent mt-1">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="repo-url" className="block text-sm text-gray-400 mb-2">
            Submit GitHub Repository
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full pl-11 pr-4 py-3 bg-background border border-card-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-purple-accent transition-colors"
              disabled={submitting || isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!repoUrl.trim() || submitting || isLoading}
          className="w-full py-3 px-4 bg-purple-accent hover:bg-purple-glow text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting || isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Submit Quest
            </>
          )}
        </button>
      </form>
    </div>
  );
}
