// Enterprise Jury Selection Utility Functions

import type { Juror, StrikeTracker, Party, StrikeType } from '@/types/jury';

export const SCORE_THRESHOLDS = {
  HIGH: 8,
  MEDIUM: 5,
};

export const DEFAULT_SCORE = 5;

/**
 * Get color class based on score (1-10)
 * High (8-10): Green
 * Medium (5-7): Yellow
 * Low (1-4): Red
 */
export function getScoreColor(score: number | undefined): string {
  if (!score) return 'text-slate-400';
  if (score >= SCORE_THRESHOLDS.HIGH) return 'text-emerald-400';
  if (score >= SCORE_THRESHOLDS.MEDIUM) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Get background color class for score badge
 */
export function getScoreBgColor(score: number | undefined): string {
  if (!score) return 'bg-slate-700/50 border-slate-600/40';
  if (score >= SCORE_THRESHOLDS.HIGH) return 'bg-emerald-500/20 border-emerald-500/40';
  if (score >= SCORE_THRESHOLDS.MEDIUM) return 'bg-amber-500/20 border-amber-500/40';
  return 'bg-red-500/20 border-red-500/40';
}

/**
 * Get tag color classes
 */
export function getTagColors(tag: string | null): { bg: string; border: string; text: string } {
  switch (tag) {
    case 'green':
      return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300' };
    case 'yellow':
      return { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300' };
    case 'red':
      return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300' };
    default:
      return { bg: 'bg-slate-700/50', border: 'border-slate-600/40', text: 'text-slate-300' };
  }
}

/**
 * Check if party can strike (has remaining peremptory strikes)
 */
export function canStrike(strikes: StrikeTracker, party: Party): boolean {
  return strikes[party].peremptory < strikes[party].maxPeremptory;
}

/**
 * Get remaining strikes for a party
 */
export function getRemainingStrikes(strikes: StrikeTracker, party: Party): number {
  return strikes[party].maxPeremptory - strikes[party].peremptory;
}

/**
 * Apply strike to juror and update strike tracker
 */
export function applyStrike(
  juror: Juror,
  strikeType: StrikeType,
  party: Party,
  strikes: StrikeTracker
): { juror: Juror; strikes: StrikeTracker } {
  const updatedJuror = {
    ...juror,
    struck: true,
    strikeType,
    strikeParty: party,
    status: 'struck' as const,
    seatIndex: null,
  };

  const updatedStrikes = { ...strikes };
  if (strikeType === 'peremptory') {
    updatedStrikes[party] = {
      ...updatedStrikes[party],
      peremptory: updatedStrikes[party].peremptory + 1,
    };
  } else if (strikeType === 'for_cause') {
    updatedStrikes[party] = {
      ...updatedStrikes[party],
      cause: updatedStrikes[party].cause + 1,
    };
  }

  return { juror: updatedJuror, strikes: updatedStrikes };
}

/**
 * Remove strike from juror and update strike tracker
 */
export function removeStrike(
  juror: Juror,
  strikes: StrikeTracker
): { juror: Juror; strikes: StrikeTracker } {
  const updatedJuror = {
    ...juror,
    struck: false,
    strikeType: 'none' as const,
    strikeParty: null,
    status: 'pool' as const,
  };

  const updatedStrikes = { ...strikes };
  if (juror.strikeType === 'peremptory' && juror.strikeParty) {
    updatedStrikes[juror.strikeParty] = {
      ...updatedStrikes[juror.strikeParty],
      peremptory: Math.max(0, updatedStrikes[juror.strikeParty].peremptory - 1),
    };
  } else if (juror.strikeType === 'for_cause' && juror.strikeParty) {
    updatedStrikes[juror.strikeParty] = {
      ...updatedStrikes[juror.strikeParty],
      cause: Math.max(0, updatedStrikes[juror.strikeParty].cause - 1),
    };
  }

  return { juror: updatedJuror, strikes: updatedStrikes };
}

/**
 * Format juror number with leading zeros
 */
export function formatJurorNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Validate score is within range
 */
export function validateScore(score: number): number {
  return Math.max(1, Math.min(10, score));
}
