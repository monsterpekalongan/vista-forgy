import { useEffect, useState } from 'react';
import { useApp } from '../AppState';
import { KoaAvatar } from '../components/KoaAvatar';
import { ProgressRing } from '../components/ProgressRing';
import { getSharpnessScore } from '../../scheduler';
import { SKILL_NODES } from '../../content/skillTree';
import { Play, Zap, BookOpen, Calendar, TrendingUp, Flame } from 'lucide-react';

function useCountUp(target: number, duration = 600) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    const initial = display;
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(initial + (target - initial) * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

function HeatmapCalendar({ dailyLog }: { dailyLog: { date: string; questions: number }[] }) {
  const weeks = 12;
  const today = new Date();
  const cells: { date: string; level: number }[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().slice(0, 10);
      const log = dailyLog.find(l => l.date === dateStr);
      const q = log?.questions || 0;
      const level = q === 0 ? 0 : q < 5 ? 1 : q < 15 ? 2 : q < 30 ? 3 : 4;
      cells.push({ date: dateStr, level });
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks}, 12px)`, gridTemplateRows: 'repeat(7, 12px)', gap: 3, overflowX: 'auto' }}>
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`heatmap-cell level-${cell.level}`}
            title={`${cell.date}: ${cell.level > 0 ? 'Ada aktivitas' : 'Tidak ada'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function HomeScreen() {
  const { save, setScreen, dailyQueue, koaState, setKoaState, humorLine, seriousMode } = useApp();
  const [, forceUpdate] = useState(0);

  const allNodeIds = SKILL_NODES.map(n => n.id);
  const skills = save.skills as Record<string, import('../../scheduler').SkillState>;
  const sharpness = getSharpnessScore(skills, allNodeIds, save.streak.current, 3);
  const sharpnessDisplay = useCountUp(sharpness);

  // Today's progress
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = save.stats.dailyLog.find(l => l.date === today);
  const todayQ = todayLog?.questions || 0;
  const goalQ = Math.round(save.profile.dailyGoalMin * 1.5); // approx questions per minute
  const todayProgress = Math.min(todayQ / Math.max(goalQ, 1), 1);

  // Hour-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Selamat malam' : hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat sore';

  // Mastered count
  const masteredCount = allNodeIds.filter(id => skills[id]?.status === 'mastered').length;

  // Projection
  const avgDaysPerNode = 3; // simplified
  const remainingNodes = allNodeIds.length - masteredCount;
  const projectionDays = remainingNodes * avgDaysPerNode;
  const projDate = new Date();
  projDate.setDate(projDate.getDate() + projectionDays);
  const projDateStr = projDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p className="text-sm" style={{ color: 'var(--muted)', marginBottom: 2 }}>{greeting},</p>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {save.profile.name || 'Forge-er'} {save.streak.current > 0 && <span>🔥</span>}
          </h1>
        </div>
        <KoaAvatar state={koaState} size={60} mini />
      </div>

      {/* KOA humor line */}
      {!seriousMode && humorLine && (
        <div className="panel animate-fadeIn" style={{ padding: '10px 14px', marginBottom: 16, borderLeft: '3px solid var(--accent)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>KOA: {humorLine}</p>
        </div>
      )}

      {/* Main action + streak */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 12 }}>
        {/* Antrian Hari Ini */}
        <div className="panel-lg" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <BookOpen size={16} color="var(--accent)" />
            <span className="text-xs font-medium" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Antrian Hari Ini</span>
          </div>
          {dailyQueue.length > 0 ? (
            <>
              <p className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                {dailyQueue.length} soal menanti
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
                {dailyQueue.filter(id => skills[id]?.status === 'memudar').length} memudar · est. {save.profile.dailyGoalMin} menit
              </p>
            </>
          ) : (
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Antrian review kosong. Segar. Waktunya membuka node baru di Peta.
            </p>
          )}
          <button
            className="btn-primary"
            style={{ width: '100%', fontSize: 16 }}
            onClick={() => { setKoaState('focus'); setScreen('runner'); }}
          >
            <Play size={16} /> MULAI HARI INI
          </button>
        </div>

        {/* Streak */}
        <div className="panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 100 }}>
          <Flame size={24} color={save.streak.current > 0 ? '#FF7A1A' : 'var(--muted)'} />
          <p className="font-display text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{save.streak.current}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>streak</p>
          {save.streak.shields > 0 && (
            <div style={{ marginTop: 8, background: 'rgba(55,200,240,0.1)', borderRadius: 6, padding: '2px 6px' }}>
              <p className="text-xs font-mono" style={{ color: 'var(--data)' }}>🛡 ×{save.streak.shields}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <button
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={() => setScreen('runner')}
        >
          <Zap size={14} /> Quick 5
        </button>
        <button
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={() => setScreen('exam')}
        >
          <TrendingUp size={14} /> Exam Sim
        </button>
      </div>

      {/* Progress row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {/* Today progress */}
        <div className="panel" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProgressRing value={todayProgress} size={52} strokeWidth={5}>
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{todayQ}</span>
          </ProgressRing>
          <div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Hari ini</p>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{todayQ} soal</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>target ~{goalQ}</p>
          </div>
        </div>

        {/* Sharpness */}
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Sharpness Score</span>
          </div>
          <p className="font-display text-3xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
            {sharpnessDisplay}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>/ 1000</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Calendar size={14} color="var(--muted)" />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aktivitas 12 Minggu</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <HeatmapCalendar dailyLog={save.stats.dailyLog} />
        </div>
      </div>

      {/* Projection */}
      <div className="panel" style={{ padding: 16 }}>
        <p className="text-xs" style={{ color: 'var(--muted)', marginBottom: 4 }}>Proyeksi penyelesaian jalur inti</p>
        <p className="font-display font-bold" style={{ color: 'var(--text)' }}>
          {masteredCount === allNodeIds.length ? '🎉 Selesai!' : `± ${projDateStr}`}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {masteredCount}/{allNodeIds.length} node dikuasai · {remainingNodes} tersisa
        </p>
      </div>
    </div>
  );
}
