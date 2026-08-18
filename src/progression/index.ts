// Progression system — Tiers, Promotion Exams, Cooldowns, Boss Battles, Elo & Sharpness Score
// Pure TypeScript - NO framework/UI imports

import type { SkillState } from '../scheduler';
import { SKILL_NODES, TIER_CONFIG } from '../content/skillTree';

export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000; // 48 hours

export interface PromotionEligibility {
  canRegister: boolean;
  masteryGatePassed: boolean;
  isHealthy: boolean;
  volumePassed: boolean;
  cooldownActive: boolean;
  cooldownRemainingMs: number;
  weaknesses: string[];
  reasons: string[];
}

export function checkPromotionEligibility(
  tier: number,
  skills: Record<string, SkillState>,
  examHistory: { tier: number; ts: number; passed: boolean; score: number }[],
  totalTierQuestions: number
): PromotionEligibility {
  const tierConfig = TIER_CONFIG.find(t => t.tier === tier);
  const tierNodes = SKILL_NODES.filter(n => n.tier === tier);
  const totalTierNodes = tierNodes.length || 1;

  // 1. Mastery gate (>= 90% mastered)
  const masteredCount = tierNodes.filter(n => skills[n.id]?.status === 'mastered').length;
  const masteryRatio = masteredCount / totalTierNodes;
  const masteryGatePassed = masteryRatio >= 0.90 || (tierConfig && masteredCount >= tierConfig.masteryRequired);

  // 2. Healthy check (no prereq nodes in tier with 'memudar' or 'belajar')
  const unhealthyNodes = tierNodes.filter(n => {
    const st = skills[n.id]?.status;
    return st === 'memudar' || st === 'belajar';
  });
  const isHealthy = unhealthyNodes.length === 0;

  // 3. Volume gate (>= 400 questions solved in tier)
  const volumePassed = totalTierQuestions >= 400 || (tier === 0 && totalTierQuestions >= 50); // relaxed for tier 0 calibration

  // 4. Cooldown check (48h after failed attempt)
  const lastFailedExam = examHistory
    .filter(e => e.tier === tier && !e.passed)
    .sort((a, b) => b.ts - a.ts)[0];

  const now = Date.now();
  let cooldownActive = false;
  let cooldownRemainingMs = 0;

  if (lastFailedExam) {
    const elapsed = now - lastFailedExam.ts;
    if (elapsed < EXAM_COOLDOWN_MS) {
      cooldownActive = true;
      cooldownRemainingMs = EXAM_COOLDOWN_MS - elapsed;
    }
  }

  // Identify top weaknesses
  const weaknesses = tierNodes
    .map(n => ({ id: n.id, name: n.name, state: skills[n.id] }))
    .filter(item => !item.state || item.state.status !== 'mastered')
    .sort((a, b) => (a.state?.elo || 1200) - (b.state?.elo || 1200))
    .slice(0, 3)
    .map(item => item.id);

  const reasons: string[] = [];
  if (!masteryGatePassed) reasons.push(`Syarat mastery belum tercapai (${masteredCount}/${Math.ceil(totalTierNodes * 0.9)} node dikuasai)`);
  if (!isHealthy) reasons.push(`Masih ada ${unhealthyNodes.length} node yang memudar atau butuh belajar`);
  if (!volumePassed) reasons.push(`Volume latihan belum cukup (${totalTierQuestions}/400 soal)`);
  if (cooldownActive) {
    const hoursLeft = Math.ceil(cooldownRemainingMs / (1000 * 60 * 60));
    reasons.push(`Cooldown aktif: tunggu ${hoursLeft} jam lagi setelah kegagalan ujian sebelumnya`);
  }

  const canRegister = masteryGatePassed && isHealthy && volumePassed && !cooldownActive;

  return {
    canRegister,
    masteryGatePassed,
    isHealthy,
    volumePassed,
    cooldownActive,
    cooldownRemainingMs,
    weaknesses,
    reasons,
  };
}

export interface ExamQuestionConfig {
  skillId: string;
  targetMs: number;
}

export function generateExamBlueprint(tier: number, skills: Record<string, SkillState>): ExamQuestionConfig[] {
  const tierNodes = SKILL_NODES.filter(n => n.tier === tier);
  if (tierNodes.length === 0) return [];

  // Sort nodes by weakness (lowest Elo or non-mastered first)
  const sorted = [...tierNodes].sort((a, b) => {
    const eloA = skills[a.id]?.elo || 1200;
    const eloB = skills[b.id]?.elo || 1200;
    return eloA - eloB;
  });

  const questionList: ExamQuestionConfig[] = [];

  // Heavy weighting on weakest nodes (3 questions per weak node, 1 for others)
  for (let i = 0; i < sorted.length; i++) {
    const count = i < 5 ? 2 : 1;
    for (let c = 0; c < count; c++) {
      questionList.push({
        skillId: sorted[i].id,
        targetMs: sorted[i].targetMs,
      });
    }
  }

  // Clamp total exam questions to 25 - 30 questions
  return questionList.slice(0, 30);
}

export function evaluateExamResult(
  examQuestions: { skillId: string; correct: boolean; responseMs: number }[],
  targetPassScore = 85
): {
  passed: boolean;
  score: number;
  domainScores: Record<string, number>;
  totalMs: number;
  weakestSkills: string[];
} {
  const total = examQuestions.length;
  if (total === 0) {
    return { passed: false, score: 0, domainScores: {}, totalMs: 0, weakestSkills: [] };
  }

  const correctCount = examQuestions.filter(q => q.correct).length;
  const score = Math.round((correctCount / total) * 100);

  const domainTotal: Record<string, number> = {};
  const domainCorrect: Record<string, number> = {};

  const skillWrongCount: Record<string, number> = {};

  let totalMs = 0;

  for (const q of examQuestions) {
    totalMs += q.responseMs;
    const domain = q.skillId.split('.')[0];
    domainTotal[domain] = (domainTotal[domain] || 0) + 1;
    if (q.correct) {
      domainCorrect[domain] = (domainCorrect[domain] || 0) + 1;
    } else {
      skillWrongCount[q.skillId] = (skillWrongCount[q.skillId] || 0) + 1;
    }
  }

  const domainScores: Record<string, number> = {};
  let allDomainsPassed = true;

  for (const domain of Object.keys(domainTotal)) {
    const dScore = Math.round(((domainCorrect[domain] || 0) / domainTotal[domain]) * 100);
    domainScores[domain] = dScore;
    if (dScore < 70) {
      allDomainsPassed = false;
    }
  }

  const passed = score >= targetPassScore && allDomainsPassed;

  const weakestSkills = Object.keys(skillWrongCount).sort(
    (a, b) => skillWrongCount[b] - skillWrongCount[a]
  ).slice(0, 3);

  return {
    passed,
    score,
    domainScores,
    totalMs,
    weakestSkills,
  };
}

export function updateElo(userElo: number, questionElo: number, correct: boolean, isSlow: boolean): number {
  const K = 24;
  const score = correct ? (isSlow ? 0.5 : 1.0) : 0;
  const E = 1 / (1 + Math.pow(10, (questionElo - userElo) / 400));
  const newElo = Math.round(userElo + K * (score - E));
  return Math.min(Math.max(newElo, 600), 2400);
}
