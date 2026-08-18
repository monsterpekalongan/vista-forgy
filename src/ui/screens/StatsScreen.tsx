import { useApp } from '../AppState';
import { SKILL_NODES } from '../../content/skillTree';
import { getSharpnessScore, type SkillState } from '../../scheduler';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';

export function StatsScreen() {
  const { save } = useApp();
  const skills = save.skills as Record<string, SkillState>;
  const allIds = SKILL_NODES.map(n => n.id);

  const sharpness = getSharpnessScore(skills, allIds, save.streak.current, 3);

  const mastered = allIds.filter(id => skills[id]?.status === 'mastered').length;
  const lancar = allIds.filter(id => skills[id]?.status === 'lancar').length;
  const belajar = allIds.filter(id => skills[id]?.status === 'belajar').length;
  const memudar = allIds.filter(id => skills[id]?.status === 'memudar').length;

  // Domain breakdown
  const domains = [
    { label: 'Aritmetika', prefix: 'ari', color: '#F5A623' },
    { label: 'Aljabar', prefix: 'alj', color: '#37C8F0' },
    { label: 'Kalkulus', prefix: 'kald', color: '#3DDC84' },
    { label: 'Probabilitas', prefix: 'pro', color: '#FF7A1A' },
    { label: 'Riset Operasi', prefix: 'rso', color: '#BB86FC' },
    { label: 'Inventori', prefix: 'inv', color: '#CF6679' },
    { label: 'Antrean', prefix: 'ant', color: '#37C8F0' },
    { label: 'Universal', prefix: 'uni', color: '#F5A623' },
  ];

  // Daily log for last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const log = save.stats.dailyLog.find(l => l.date === dateStr);
    return { date: dateStr, questions: log?.questions || 0, correct: log?.correct || 0 };
  });

  const maxQ = Math.max(...last7.map(d => d.questions), 1);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Statistik</h1>

      {/* Sharpness */}
      <div className="panel-lg" style={{ padding: 24, marginBottom: 12, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <TrendingUp size={20} color="var(--accent)" />
          <span className="text-sm font-medium" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sharpness Score</span>
        </div>
        <p className="font-display font-bold font-mono" style={{ fontSize: 64, color: 'var(--accent)', lineHeight: 1 }}>{sharpness}</p>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>dari 1000</p>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #FF7A1A)', borderRadius: 4, width: `${sharpness / 10}%`, transition: 'width 1s ease' }} />
        </div>
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
        <StatCard icon={<Target size={16} color="var(--accent)" />} label="Total Soal" value={save.stats.totalQuestions} color="var(--accent)" />
        <StatCard icon={<Award size={16} color="var(--success)" />} label="Dikuasai" value={mastered} color="var(--success)" />
        <StatCard icon={<Calendar size={16} color="var(--data)" />} label="Streak Terbaik" value={save.streak.best} color="var(--data)" unit="hari" />
        <StatCard icon={<TrendingUp size={16} color="var(--spark)" />} label="Total Sesi" value={save.stats.totalSessions} color="var(--spark)" />
      </div>

      {/* Skill status distribution */}
      <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Distribusi Status Skill</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Dikuasai', count: mastered, color: 'var(--success)' },
            { label: 'Lancar', count: lancar, color: 'var(--accent)' },
            { label: 'Belajar', count: belajar, color: 'var(--data)' },
            { label: 'Memudar', count: memudar, color: '#FFB800' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
                <span className="font-mono text-xs" style={{ color: s.color }}>{s.count}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: s.color, borderRadius: 3, width: `${(s.count / allIds.length) * 100}%`, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day activity chart */}
      <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aktivitas 7 Hari</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
          {last7.map((d, i) => {
            const h = maxQ > 0 ? Math.round((d.questions / maxQ) * 70) + 4 : 4;
            const dayLabel = new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short' });
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: h, background: d.questions > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.06)', borderRadius: 4, transition: 'height 0.5s ease' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain progress */}
      <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Progress per Domain</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {domains.map(domain => {
            const domainNodes = allIds.filter(id => id.startsWith(domain.prefix + '.'));
            if (domainNodes.length === 0) return null;
            const domainMastered = domainNodes.filter(id => skills[id]?.status === 'mastered').length;
            const pct = domainNodes.length > 0 ? Math.round((domainMastered / domainNodes.length) * 100) : 0;
            return (
              <div key={domain.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="text-xs" style={{ color: 'var(--text)' }}>{domain.label}</span>
                  <span className="font-mono text-xs" style={{ color: domain.color }}>{domainMastered}/{domainNodes.length}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: domain.color, borderRadius: 3, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {save.badges.length > 0 && (
        <div className="panel" style={{ padding: 16 }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {save.badges.map((badge, i) => (
              <span key={i} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: 'var(--accent)' }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, unit }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  unit?: string;
}) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {icon}
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <p className="font-display font-bold text-2xl font-mono" style={{ color }}>
        {value.toLocaleString('id-ID')}{unit ? <span className="text-sm ml-1" style={{ color: 'var(--muted)' }}>{unit}</span> : null}
      </p>
    </div>
  );
}

import React from 'react';
void React;
