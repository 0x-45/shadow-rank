'use client';

import type { Rank } from '@/types';
import { calculateProgress, getXPToNextRank, getNextRank } from '@/lib/utils/xp';

interface XPProgressBarProps {
  currentXP: number;
  currentRank: Rank;
  showDetails?: boolean;
}

export default function XPProgressBar({
  currentXP,
  currentRank,
  showDetails = true,
}: XPProgressBarProps) {
  const progress = calculateProgress(currentXP, currentRank);
  const nextRank = getNextRank(currentRank);
  const xpToNext = getXPToNextRank(currentRank);

  const isMaxRank = !nextRank;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-4 bg-card-bg rounded-full overflow-hidden border border-card-border">
        {/* Background shimmer */}
        <div className="absolute inset-0 shimmer opacity-30" />
        
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-dark to-purple-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect at the end */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-purple-glow/50 blur-sm" />
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-400">
            {currentXP} XP
          </span>
          
          {isMaxRank ? (
            <span className="text-purple-accent font-medium">
              Max Rank Achieved! 🏆
            </span>
          ) : (
            <span className="text-gray-400">
              {xpToNext! - currentXP} XP to Rank {nextRank}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Compact version for skill tree
export function SkillProgressBar({
  level,
  maxLevel = 10,
}: {
  level: number;
  maxLevel?: number;
}) {
  const progress = (level / maxLevel) * 100;

  return (
    <div className="w-full">
      <div className="h-2 bg-card-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-dark to-purple-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>Lvl {level}</span>
        <span>{maxLevel}</span>
      </div>
    </div>
  );
}
