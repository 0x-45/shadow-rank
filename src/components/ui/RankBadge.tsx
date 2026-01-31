'use client';

import type { Rank } from '@/types';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showLabel?: boolean;
}

const RANK_COLORS: Record<Rank, { text: string; glow: string; bg: string }> = {
  E: {
    text: 'text-gray-400',
    glow: 'shadow-gray-500/30',
    bg: 'bg-gray-800/50',
  },
  D: {
    text: 'text-green-400',
    glow: 'shadow-green-500/30',
    bg: 'bg-green-900/30',
  },
  C: {
    text: 'text-blue-400',
    glow: 'shadow-blue-500/30',
    bg: 'bg-blue-900/30',
  },
  B: {
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30',
    bg: 'bg-yellow-900/30',
  },
  A: {
    text: 'text-purple-accent',
    glow: 'shadow-purple-accent/50',
    bg: 'bg-purple-dark/30',
  },
};

const RANK_LABELS: Record<Rank, string> = {
  E: 'Novice Hunter',
  D: 'Apprentice Hunter',
  C: 'Skilled Hunter',
  B: 'Elite Hunter',
  A: 'Shadow Monarch',
};

const SIZE_CLASSES = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
  xl: 'w-32 h-32 text-7xl',
};

export default function RankBadge({
  rank,
  size = 'lg',
  animated = true,
  showLabel = true,
}: RankBadgeProps) {
  const colors = RANK_COLORS[rank];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizeClass}
          ${colors.bg}
          ${colors.text}
          ${animated ? 'glow-pulse' : ''}
          flex items-center justify-center
          rounded-2xl
          font-bold
          border border-card-border
          shadow-lg ${colors.glow}
          transition-all duration-300
        `}
      >
        {rank}
      </div>
      {showLabel && (
        <div className="text-center">
          <p className={`text-sm font-medium ${colors.text}`}>
            Rank {rank}
          </p>
          <p className="text-xs text-gray-500">
            {RANK_LABELS[rank]}
          </p>
        </div>
      )}
    </div>
  );
}

// Small inline rank indicator
export function RankIndicator({ rank }: { rank: Rank }) {
  const colors = RANK_COLORS[rank];
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        w-6 h-6 rounded-md
        text-xs font-bold
        ${colors.bg} ${colors.text}
        border border-card-border
      `}
    >
      {rank}
    </span>
  );
}
