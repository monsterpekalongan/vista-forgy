// Global app state management — React context
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SaveSystem, type SaveData } from '../storage';
import { SKILL_NODES } from '../content/skillTree';
import { buildDailyQueue, interleaveQueue, type SkillState } from '../scheduler';

export type Screen = 'onboarding' | 'home' | 'runner' | 'map' | 'stats' | 'settings' | 'data' | 'exam';

interface AppContextType {
  save: SaveData;
  screen: Screen;
  setScreen: (s: Screen) => void;
  updateSave: (updater: (data: SaveData) => SaveData) => void;
  dailyQueue: string[];
  refreshQueue: () => void;
  koaState: KoaAnimState;
  setKoaState: (s: KoaAnimState) => void;
  humorLine: string | null;
  setHumorLine: (s: string | null) => void;
  seriousMode: boolean;
}

export type KoaAnimState = 'idle' | 'happy' | 'oops' | 'focus' | 'celebrate';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => SaveSystem.load());
  const [screen, setScreenState] = useState<Screen>(() => {
    return save.profile.name ? 'home' : 'onboarding';
  });
  const [dailyQueue, setDailyQueue] = useState<string[]>([]);
  const [koaState, setKoaState] = useState<KoaAnimState>('idle');
  const [humorLine, setHumorLine] = useState<string | null>(null);
  const humorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seriousMode = save.settings.serious;

  // Apply theme
  useEffect(() => {
    const theme = save.settings.theme;
    const html = document.documentElement;
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
  }, [save.settings.theme]);

  const refreshQueue = useCallback(() => {
    const skills = save.skills as Record<string, SkillState>;
    const allIds = SKILL_NODES.map(n => n.id);
    const raw = buildDailyQueue(skills, allIds, 25);
    const interleaved = interleaveQueue(raw);
    setDailyQueue(interleaved);
  }, [save.skills]);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const updateSave = useCallback((updater: (data: SaveData) => SaveData) => {
    setSave(prev => {
      const next = updater(prev);
      SaveSystem.save(next);
      return next;
    });
  }, []);

  const setScreen = useCallback((s: Screen) => {
    setScreenState(s);
  }, []);

  // Humor line auto-clear
  useEffect(() => {
    if (humorLine) {
      if (humorTimeoutRef.current) clearTimeout(humorTimeoutRef.current);
      humorTimeoutRef.current = setTimeout(() => setHumorLine(null), 4000);
    }
  }, [humorLine]);

  const value: AppContextType = {
    save,
    screen,
    setScreen,
    updateSave,
    dailyQueue,
    refreshQueue,
    koaState,
    setKoaState,
    humorLine,
    setHumorLine,
    seriousMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
