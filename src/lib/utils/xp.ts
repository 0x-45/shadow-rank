import type { Rank, XPCalculation } from '@/types';

/**
 * XP thresholds for each rank
 * E -> D: 100 XP
 * D -> C: 250 XP
 * C -> B: 500 XP
 * B -> A: 1000 XP
 */
export const RANK_THRESHOLDS: Record<Rank, number> = {
  E: 0,
  D: 100,
  C: 250,
  B: 500,
  A: 1000,
};

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A'];

/**
 * Get the next rank in the progression
 */
export function getNextRank(currentRank: Rank): Rank | null {
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  if (currentIndex === RANK_ORDER.length - 1) return null; // Already at max rank
  return RANK_ORDER[currentIndex + 1];
}

/**
 * Get the XP required to reach the next rank
 */
export function getXPToNextRank(currentRank: Rank): number | null {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return null;
  return RANK_THRESHOLDS[nextRank];
}

/**
 * Calculate the rank based on total XP
 */
export function calculateRankFromXP(totalXP: number): Rank {
  if (totalXP >= RANK_THRESHOLDS.A) return 'A';
  if (totalXP >= RANK_THRESHOLDS.B) return 'B';
  if (totalXP >= RANK_THRESHOLDS.C) return 'C';
  if (totalXP >= RANK_THRESHOLDS.D) return 'D';
  return 'E';
}

/**
 * Calculate progress percentage to next rank
 */
export function calculateProgress(currentXP: number, currentRank: Rank): number {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return 100; // Max rank

  const currentThreshold = RANK_THRESHOLDS[currentRank];
  const nextThreshold = RANK_THRESHOLDS[nextRank];
  const xpInCurrentRank = currentXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;

  return Math.min(100, Math.floor((xpInCurrentRank / xpNeeded) * 100));
}

/**
 * XP rewards configuration
 */
export const XP_REWARDS = {
  QUEST_BASE: 50,
  QUEST_RECENCY_BONUS: 25, // Bonus if repo pushed in last 7 days
  DEBUGGING_CHALLENGE: 10,
  SKILL_LEVEL_UP_BONUS: 5,
};

/**
 * Calculate XP gain from quest completion
 */
export function calculateQuestXP(isRecentlyPushed: boolean): XPCalculation {
  const baseXP = XP_REWARDS.QUEST_BASE;
  const recencyBonus = isRecentlyPushed ? XP_REWARDS.QUEST_RECENCY_BONUS : 0;
  const totalXP = baseXP + recencyBonus;

  return {
    base_xp: baseXP,
    recency_bonus: recencyBonus,
    total_xp: totalXP,
    new_total: 0, // Will be calculated when we know current XP
    rank_up: false,
    new_rank: undefined,
  };
}

/**
 * Calculate full XP result including rank changes
 */
export function calculateXPGain(
  currentXP: number,
  currentRank: Rank,
  xpGain: number
): XPCalculation {
  const newTotal = currentXP + xpGain;
  const newRank = calculateRankFromXP(newTotal);
  const rankUp = RANK_ORDER.indexOf(newRank) > RANK_ORDER.indexOf(currentRank);

  return {
    base_xp: xpGain,
    recency_bonus: 0,
    total_xp: xpGain,
    new_total: newTotal,
    rank_up: rankUp,
    new_rank: rankUp ? newRank : undefined,
  };
}

/**
 * Check if a date is within the last 7 days
 */
export function isRecentlyPushed(pushedAt: string): boolean {
  const pushDate = new Date(pushedAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return pushDate > sevenDaysAgo;
}
