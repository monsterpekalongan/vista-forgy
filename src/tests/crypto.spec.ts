import { describe, it, expect } from 'vitest';
import { exportToFgy, importFromFgy, mergeImportData } from '../crypto';

describe('Web Crypto .fgy Export/Import Tests', () => {
  it('encrypts and decrypts payload correctly with the valid password', async () => {
    const payload = {
      version: 1,
      exportedAt: Date.now(),
      profile: { name: 'TestUser', track: 'ti' as const, dailyGoalMin: 25 },
      skills: { 'ari.tambah': { elo: 1300, D: 5, S: 10, lastReviewTs: 100, dueTs: 200, streakBenar: 3, medianMs: 5000, status: 'mastered', attempts: 5 } },
      tiers: { current: 1, unlocked: [0, 1], examHistory: [] },
      streak: { current: 5, best: 10, shields: 1, lastSessionDate: '2026-08-19' },
      stats: { totalQuestions: 100, totalSessions: 10, dailyLog: [] },
      badges: ['streak-7'],
    };

    const password = 'SecretPassword123!';
    const blob = await exportToFgy(payload, password);
    const buffer = await blob.arrayBuffer();

    const decrypted = await importFromFgy(buffer, password);
    expect(decrypted.profile.name).toBe('TestUser');
    expect(decrypted.badges).toContain('streak-7');
  });

  it('rejects decryption when given an incorrect password', async () => {
    const payload = { version: 1, exportedAt: Date.now(), profile: {}, skills: {}, tiers: {}, streak: {}, stats: {}, badges: [] };
    const blob = await exportToFgy(payload, 'CorrectPassword');
    const buffer = await blob.arrayBuffer();

    await expect(importFromFgy(buffer, 'WrongPassword')).rejects.toThrow();
  });
});
