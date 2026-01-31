'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { Rank } from '@/types';

interface RankUpAnimationProps {
  newRank: Rank;
  onComplete: () => void;
}

const RANK_MESSAGES: Record<Rank, string> = {
  E: 'Your journey begins...',
  D: 'You have awakened!',
  C: 'Your power grows stronger!',
  B: 'You are becoming a true hunter!',
  A: 'You have reached the pinnacle! Shadow Monarch!',
};

export default function RankUpAnimation({ newRank, onComplete }: RankUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#8b5cf6', '#a78bfa', '#6d28d9', '#c4b5fd'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst in the middle
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    }, 500);

    // Auto-close after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onComplete}
    >
      <div className="text-center">
        {/* Rank Display */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-purple-accent text-glow rank-up-animation">
            {newRank}
          </div>
          {/* Glow rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-purple-accent/30 animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border border-purple-dark/20 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-foreground mb-4 animate-pulse">
          RANK UP!
        </h2>
        <p className="text-xl text-purple-glow mb-8">
          {RANK_MESSAGES[newRank]}
        </p>

        {/* Continue prompt */}
        <p className="text-gray-500 text-sm animate-pulse">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}
