// SRS Scheduler — FSRS-lite implementation
// DILARANG import apapun dari /ui, /visual, /audio, atau library framework

export type SkillStatus = 'baru' | 'belajar' | 'lancar' | 'mastered' | 'memudar';

export interface SkillState {
  elo: number;
  D: number;          // Difficulty 1-10
  S: number;          // Stability (days)
  lastReviewTs: number;
  dueTs: number;
  streakBenar: number;
  medianMs: number;   // EMA of response time
  status: SkillStatus;
  attempts: number;
}

export type Rating = 1 | 2 | 3 | 4;  // Again, Hard, Good, Easy

// FSRS-lite constants
const DECAY = -0.5;
const FACTOR = 19 / 81;
const DESIRED_RETENTION = 0.90;
const ELO_K = 24;

// Compute retrievability R(elapsedDays, S)
export function computeR(elapsedDays: number, S: number): number {
  if (S <= 0) return 0;
  return Math.pow(1 + FACTOR * elapsedDays / S, DECAY);
}

// Compute next review interval in days
export function nextInterval(S: number): number {
  const days = (S / FACTOR) * (Math.pow(DESIRED_RETENTION, 1 / DECAY) - 1);
  return Math.min(Math.max(days, 0.25), 365);
}

// Determine rating from performance
export function determineRating(
  correct: boolean,
  responseMs: number,
  targetMs: number,
  streak: number,
): Rating {
  if (!correct) return 1;
  if (responseMs > 1.5 * targetMs) return 2;
  if (responseMs < 0.6 * targetMs && streak >= 2) return 4;
  return 3;
}

// Init state for a skill seen for the first time
export function initState(rating: Rating): SkillState {
  const sMap: Record<Rating, number> = { 1: 0.6, 2: 1.2, 3: 3.0, 4: 6.0 };
  const d = 5.5 + (3 - rating) * 0.7;
  const S = sMap[rating];
  const now = Date.now();
  const nextDays = nextInterval(S);
  return {
    elo: 1200,
    D: Math.min(Math.max(d, 1), 10),
    S,
    lastReviewTs: now,
    dueTs: now + nextDays * 86400000,
    streakBenar: rating >= 2 ? 1 : 0,
    medianMs: 0,
    status: rating >= 3 ? 'lancar' : 'belajar',
    attempts: 1,
  };
}

// Update state after a review
export function updateState(
  state: SkillState,
  rating: Rating,
  responseMs: number,
  targetMs: number,
  questionElo: number,
): SkillState {
  const now = Date.now();
  const elapsedDays = Math.max(0, (now - state.lastReviewTs) / 86400000);
  const R = computeR(elapsedDays, state.S);

  // Update D
  const deltaDMap: Record<Rating, number> = { 1: 1.2, 2: 0.3, 3: -0.1, 4: -0.6 };
  let newD = state.D + deltaDMap[rating];
  newD += 0.05 * (5 - newD); // mean reversion
  newD = Math.min(Math.max(newD, 1), 10);

  // Update S
  let newS: number;
  if (rating >= 2) {
    // Correct
    let growth = 1 + 0.42 * (11 - newD) * Math.pow(state.S || 0.1, -0.22) * (1 / Math.max(R, 0.01) - 1);
    growth = Math.min(growth, 2.5); // cap growth
    newS = (state.S || 0.1) * growth;
    if (rating === 4) newS *= 1.15;
  } else {
    // Forgot
    newS = Math.max(0.4, state.S * 0.35);
  }

  // Update streak
  const newStreak = rating >= 2 ? state.streakBenar + 1 : 0;

  // Update medianMs (EMA, α=0.3)
  const alpha = 0.3;
  const newMedianMs = state.medianMs === 0
    ? responseMs
    : state.medianMs * (1 - alpha) + responseMs * alpha;

  // Determine new status
  let newStatus: SkillStatus;
  if (rating < 2) {
    newStatus = 'belajar';
  } else if (newStreak >= 3 && questionElo >= 1300 && newMedianMs <= targetMs) {
    newStatus = 'mastered';
  } else if (newStreak >= 1) {
    newStatus = 'lancar';
  } else {
    newStatus = 'belajar';
  }

  const nextDays = nextInterval(newS);

  // Check for "memudar": R < 0.7 means decaying
  const newR = computeR(nextDays * 0.5, newS);
  if (newStatus === 'mastered' && newR < 0.7) {
    newStatus = 'memudar';
  }

  // Update Elo
  const score = rating >= 2 ? (rating === 2 ? 0.5 : 1.0) : 0;
  const E = 1 / (1 + Math.pow(10, (questionElo - state.elo) / 400));
  const newElo = Math.round(state.elo + ELO_K * (score - E));

  return {
    elo: Math.min(Math.max(newElo, 600), 2400),
    D: newD,
    S: newS,
    lastReviewTs: now,
    dueTs: now + nextDays * 86400000,
    streakBenar: newStreak,
    medianMs: newMedianMs,
    status: newStatus,
    attempts: (state.attempts || 0) + 1,
  };
}

// Check if a node is due for review
export function isDue(state: SkillState): boolean {
  return Date.now() >= state.dueTs;
}

// Check if state has decayed (memudar)
export function checkDecay(state: SkillState): SkillState {
  if (state.status !== 'mastered') return state;
  const elapsedDays = (Date.now() - state.lastReviewTs) / 86400000;
  const R = computeR(elapsedDays, state.S);
  if (R < 0.7) {
    return { ...state, status: 'memudar' };
  }
  return state;
}

// Build daily queue with priority
export function buildDailyQueue(
  skills: Record<string, SkillState>,
  allNodeIds: string[],
  maxItems = 25,
): string[] {
  const now = Date.now();
  const due: { id: string; R: number; overdue: boolean }[] = [];
  const todayDue: string[] = [];
  const newOrLearning: string[] = [];

  for (const id of allNodeIds) {
    const state = skills[id];
    if (!state) {
      newOrLearning.push(id);
      continue;
    }

    const elapsed = (now - state.lastReviewTs) / 86400000;
    const R = computeR(elapsed, state.S);
    const overdue = now > state.dueTs + 86400000; // >1 day overdue

    if (state.status === 'belajar' || state.status === 'memudar' || overdue) {
      due.push({ id, R, overdue });
    } else if (isDue(state)) {
      todayDue.push(id);
    }
  }

  // Sort: overdue first, then by R ascending (lowest retention first)
  due.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    return a.R - b.R;
  });

  const queue: string[] = [];
  const addItem = (id: string) => {
    if (queue.length < maxItems && !queue.includes(id)) queue.push(id);
  };

  // Priority: overdue → today due → new/learning
  for (const d of due) addItem(d.id);
  for (const id of todayDue) addItem(id);

  // Add 1 new item
  if (newOrLearning.length > 0 && queue.length < maxItems) {
    addItem(newOrLearning[0]);
  }

  return queue;
}

// Interleave queue to avoid 3 same-domain items in a row
export function interleaveQueue(queue: string[]): string[] {
  if (queue.length <= 3) return queue;

  const getDomain = (id: string) => id.split('.')[0];
  const result: string[] = [];
  const remaining = [...queue];

  while (remaining.length > 0) {
    const lastDomains = result.slice(-2).map(getDomain);
    const lastDomain = lastDomains.length === 2 && lastDomains[0] === lastDomains[1]
      ? lastDomains[0]
      : null;

    if (lastDomain) {
      // Find item from different domain
      const idx = remaining.findIndex(id => getDomain(id) !== lastDomain);
      if (idx !== -1) {
        result.push(remaining.splice(idx, 1)[0]);
        continue;
      }
    }

    result.push(remaining.shift()!);
  }

  return result;
}

// Mastery gate check
export function checkMasteryGate(
  skills: Record<string, SkillState>,
  tierNodes: string[],
  requiredCount: number,
): boolean {
  const mastered = tierNodes.filter(id => skills[id]?.status === 'mastered').length;
  return mastered >= requiredCount;
}

export function getSharpnessScore(
  skills: Record<string, SkillState>,
  allNodeIds: string[],
  streak: number,
  sessionsThisWeek: number,
): number {
  const total = allNodeIds.length;
  if (total === 0) return 0;

  const mastered = allNodeIds.filter(id => skills[id]?.status === 'mastered').length;
  const lancar = allNodeIds.filter(id => skills[id]?.status === 'lancar').length;

  const coverage = (mastered + 0.5 * lancar) / total;

  const stabilities = allNodeIds
    .filter(id => skills[id]?.S > 0)
    .map(id => Math.min(skills[id].S, 180) / 180);
  const avgStability = stabilities.length > 0
    ? stabilities.reduce((a, b) => a + b, 0) / stabilities.length
    : 0;

  const masteredNodes = allNodeIds.filter(id => skills[id]?.status === 'mastered');
  const speeds = masteredNodes
    .filter(id => skills[id].medianMs > 0)
    .map(id => {
      const node = allNodeIds.find(n => n === id);
      void node;
      return Math.min(1, 1); // simplified for now — will be enhanced
    });
  const avgSpeed = speeds.length > 0
    ? speeds.reduce((a, b) => a + b, 0) / speeds.length
    : 0;

  const consistency = Math.min(1, streak / 21) * Math.min(1, sessionsThisWeek / 5);

  const score = 400 * coverage + 300 * avgStability + 200 * avgSpeed + 100 * consistency;
  return Math.round(Math.min(score, 1000));
}
