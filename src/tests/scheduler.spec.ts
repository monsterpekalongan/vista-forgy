import { describe, it, expect } from 'vitest';
import { computeR, nextInterval, determineRating, interleaveQueue, getSharpnessScore } from '../scheduler';

describe('SRS Scheduler (FSRS-Lite) Tests', () => {
  it('computes retrievability R correctly and decays with time', () => {
    const rDay0 = computeR(0, 10);
    const rDay10 = computeR(10, 10);
    const rDay30 = computeR(30, 10);

    expect(rDay0).toBeCloseTo(1.0, 2);
    expect(rDay10).toBeLessThan(rDay0);
    expect(rDay30).toBeLessThan(rDay10);
  });

  it('determines rating from performance parameters', () => {
    const rIncorrect = determineRating(false, 5000, 10000, 0);
    expect(rIncorrect).toBe(1);

    const rSlow = determineRating(true, 20000, 10000, 0);
    expect(rSlow).toBe(2);

    const rFast = determineRating(true, 3000, 10000, 3);
    expect(rFast).toBe(4);
  });

  it('interleaves queue to avoid 3 consecutive items from same domain', () => {
    const rawQueue = ['ari.tambah', 'ari.kurang', 'ari.kali', 'kald.power', 'ari.bagi'];
    const interleaved = interleaveQueue(rawQueue);

    for (let i = 0; i < interleaved.length - 2; i++) {
      const d1 = interleaved[i].split('.')[0];
      const d2 = interleaved[i + 1].split('.')[0];
      const d3 = interleaved[i + 2].split('.')[0];

      const sameDomainCount = (d1 === d2 && d2 === d3) ? 3 : 0;
      expect(sameDomainCount).toBeLessThan(3);
    }
  });

  it('calculates sharpness score bounded between 0 and 1000', () => {
    const score = getSharpnessScore({}, ['ari.tambah'], 5, 3);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1000);
  });
});
