import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateQuestion, DEFAULT_KNOBS } from '../engine';
import { SKILL_NODES } from '../content/skillTree';

describe('QuestionForge Engine Property Tests', () => {
  it('generates non-null, valid QuestionSpecs for any seed across all skills', () => {
    fc.assert(
      fc.property(fc.nat(100000), fc.integer({ min: 0, max: SKILL_NODES.length - 1 }), (seed, skillIdx) => {
        const skill = SKILL_NODES[skillIdx];
        const q = generateQuestion(skill.id, seed, 0, DEFAULT_KNOBS);

        expect(q).toBeDefined();
        expect(q.id).toBeDefined();
        expect(q.prompt.text).toBeTruthy();
        expect(q.solution.finalLatex).toBeTruthy();

        if (q.format === 'numeric') {
          const ans = q.answer as { type: 'numeric'; value: number; tolerance: number };
          expect(isNaN(ans.value)).toBe(false);
          expect(isFinite(ans.value)).toBe(true);
        }

        if (q.format === 'mc' && q.choices) {
          const correctChoices = q.choices.filter(c => c.isCorrect);
          expect(correctChoices.length).toBe(1);
        }
      }),
      { numRuns: 500 }
    );
  });

  it('guarantees deterministic output given the exact same seed', () => {
    const q1 = generateQuestion('ari.tambah', 12345, 0, DEFAULT_KNOBS);
    const q2 = generateQuestion('ari.tambah', 12345, 0, DEFAULT_KNOBS);

    expect(q1.prompt.text).toBe(q2.prompt.text);
    expect(q1.solution.finalLatex).toBe(q2.solution.finalLatex);
  });
});
