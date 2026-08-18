// Save System — localStorage schema, versioning, snapshot, crash resume
// DILARANG import apapun dari /ui atau library framework

export const SCHEMA_VERSION = 1;

export interface DailyLog {
  date: string;
  minutes: number;
  questions: number;
  correct: number;
}

export interface ExamHistory {
  tier: number;
  ts: number;
  score: number;
  passed: boolean;
  breakdown: Record<string, number>;
}

export interface SkillSave {
  elo: number;
  D: number;
  S: number;
  lastReviewTs: number;
  dueTs: number;
  streakBenar: number;
  medianMs: number;
  status: string;
  attempts: number;
}

export interface SaveData {
  version: number;
  createdAt: number;
  updatedAt: number;
  profile: {
    name: string;
    track: 'ti' | 'universal' | 'both';
    dailyGoalMin: number;
  };
  skills: Record<string, SkillSave>;
  tiers: {
    current: number;
    unlocked: number[];
    examHistory: ExamHistory[];
  };
  streak: {
    current: number;
    best: number;
    shields: number;
    lastSessionDate: string;
  };
  stats: {
    totalQuestions: number;
    totalSessions: number;
    dailyLog: DailyLog[];
  };
  badges: string[];
  settings: {
    sound: boolean;
    volume: number;
    serious: boolean;
    motion: 'auto' | 'full' | 'reduced';
    theme: 'dark' | 'light' | 'auto';
  };
  schemaMigrations: number[];
}

export interface SessionSave {
  phase: string;
  queue: string[];
  queueIndex: number;
  startTs: number;
  correct: number;
  total: number;
  date: string;
}

const KEYS = {
  save: 'vf.save',
  snapshots: 'vf.snapshots',
  session: 'vf.session',
};

const MIGRATIONS: { fromVersion: number; migrate: (data: SaveData) => SaveData }[] = [
  // v0 → v1: add missing fields
  {
    fromVersion: 0,
    migrate: (data) => ({
      ...defaultSave(),
      ...data,
      version: 1,
      schemaMigrations: [...(data.schemaMigrations || []), 1],
    }),
  },
];

export function defaultSave(): SaveData {
  return {
    version: SCHEMA_VERSION,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile: { name: '', track: 'ti', dailyGoalMin: 25 },
    skills: {},
    tiers: { current: 0, unlocked: [0], examHistory: [] },
    streak: { current: 0, best: 0, shields: 0, lastSessionDate: '' },
    stats: { totalQuestions: 0, totalSessions: 0, dailyLog: [] },
    badges: [],
    settings: { sound: true, volume: 0.7, serious: false, motion: 'auto', theme: 'dark' },
    schemaMigrations: [],
  };
}

function runMigrations(data: SaveData): SaveData {
  let current = data;
  for (const m of MIGRATIONS) {
    if (current.version <= m.fromVersion) {
      current = m.migrate(current);
    }
  }
  return current;
}

class SaveSystemClass {
  private cache: SaveData | null = null;

  load(): SaveData {
    if (this.cache) return this.cache;
    try {
      const raw = localStorage.getItem(KEYS.save);
      if (!raw) {
        this.cache = defaultSave();
        return this.cache;
      }
      const parsed = JSON.parse(raw) as SaveData;
      const migrated = runMigrations(parsed);
      this.cache = migrated;
      return this.cache;
    } catch {
      // Try snapshot recovery
      const recovered = this.recoverFromSnapshot();
      if (recovered) {
        this.cache = recovered;
        return this.cache;
      }
      this.cache = defaultSave();
      return this.cache;
    }
  }

  save(data: SaveData): void {
    data.updatedAt = Date.now();
    try {
      const json = JSON.stringify(data);
      // Guard size < 800KB
      if (json.length > 800000) {
        this.compactData(data);
      }
      localStorage.setItem(KEYS.save, JSON.stringify(data));
      this.cache = data;
    } catch {
      console.error('[VF] Save failed');
    }
  }

  private compactData(data: SaveData): void {
    // Keep only last 24 months of daily logs
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 24);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    data.stats.dailyLog = data.stats.dailyLog.filter(l => l.date >= cutoffStr);
  }

  takeSnapshot(): void {
    try {
      const data = this.load();
      const snapshots: SaveData[] = JSON.parse(localStorage.getItem(KEYS.snapshots) || '[]');
      snapshots.push({ ...data });
      // Keep max 7 snapshots
      while (snapshots.length > 7) snapshots.shift();
      localStorage.setItem(KEYS.snapshots, JSON.stringify(snapshots));
    } catch {
      console.error('[VF] Snapshot failed');
    }
  }

  private recoverFromSnapshot(): SaveData | null {
    try {
      const raw = localStorage.getItem(KEYS.snapshots);
      if (!raw) return null;
      const snapshots: SaveData[] = JSON.parse(raw);
      if (snapshots.length === 0) return null;
      return snapshots[snapshots.length - 1];
    } catch {
      return null;
    }
  }

  saveSession(session: SessionSave): void {
    try {
      localStorage.setItem(KEYS.session, JSON.stringify(session));
    } catch {
      console.error('[VF] Session save failed');
    }
  }

  loadSession(): SessionSave | null {
    try {
      const raw = localStorage.getItem(KEYS.session);
      if (!raw) return null;
      return JSON.parse(raw) as SessionSave;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(KEYS.session);
    } catch {
      console.error('[VF] Session clear failed');
    }
  }

  reset(): void {
    try {
      localStorage.removeItem(KEYS.save);
      localStorage.removeItem(KEYS.session);
      this.cache = null;
    } catch {
      console.error('[VF] Reset failed');
    }
  }

  exportJSON(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  updateSkill(skillId: string, skillData: SkillSave): void {
    const data = this.load();
    data.skills[skillId] = skillData;
    this.save(data);
  }

  recordAnswer(correct: boolean, date: string, durationMs: number): void {
    const data = this.load();
    data.stats.totalQuestions++;
    if (correct) {
      // update daily log
    }
    const today = data.stats.dailyLog.find(l => l.date === date);
    if (today) {
      today.questions++;
      if (correct) today.correct++;
      today.minutes = Math.round(today.minutes + durationMs / 60000);
    } else {
      data.stats.dailyLog.push({ date, questions: 1, correct: correct ? 1 : 0, minutes: Math.round(durationMs / 60000) });
    }
    this.save(data);
  }

  updateStreak(date: string): void {
    const data = this.load();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);

    if (!data.streak.lastSessionDate) {
      data.streak.current = 1;
    } else if (data.streak.lastSessionDate === yStr) {
      data.streak.current++;
    } else if (data.streak.lastSessionDate !== date) {
      // Gap: check shields
      if (data.streak.shields > 0) {
        data.streak.shields--;
        data.streak.current++;
      } else {
        data.streak.current = 1;
      }
    }

    if (data.streak.current > data.streak.best) {
      data.streak.best = data.streak.current;
    }
    data.streak.lastSessionDate = date;
    this.save(data);
  }
}

export const SaveSystem = new SaveSystemClass();
