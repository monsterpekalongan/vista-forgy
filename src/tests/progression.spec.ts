import { describe, it, expect } from 'vitest';
import { checkPromotionEligibility, evaluateExamResult, updateElo } from '../progression';

describe('Progression & Promotion Exam Tests', () => {
  it('evaluates promotion exam results correctly', () => {
    const examData = [
      { skillId: 'ari.tambah', correct: true, responseMs: 5000 },
      { skillId: 'ari.kurang', correct: true, responseMs: 6000 },
      { skillId: 'alj.linear1', correct: true, responseMs: 10000 },
    ];

    const evalResult = evaluateExamResult(examData, 85);
    expect(evalResult.score).toBe(100);
    expect(evalResult.passed).toBe(true);
  });

  it('updates Elo adaptively based on answer correctness', () => {
    const eloWin = updateElo(1200, 1200, true, false);
    const eloLoss = updateElo(1200, 1200, false, false);

    expect(eloWin).toBeGreaterThan(1200);
    expect(eloLoss).toBeLessThan(1200);
  });
});
