import { useState } from 'react';
import { useApp } from '../AppState';
import { SKILL_NODES, TIER_CONFIG } from '../../content/skillTree';
import { getConceptCard } from '../../content/conceptCards';
import { type SkillState } from '../../scheduler';
import { KaTeXRenderer } from '../components/KaTeXRenderer';
import { X, Lock, Star, Zap, BookOpen } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  mastered: 'var(--success)',
  lancar: 'var(--accent)',
  belajar: 'var(--data)',
  memudar: '#FFB800',
  baru: 'var(--muted)',
};

const STATUS_LABELS: Record<string, string> = {
  mastered: 'Dikuasai',
  lancar: 'Lancar',
  belajar: 'Belajar',
  memudar: 'Memudar',
  baru: 'Baru',
};

export function SkillMapScreen() {
  const { save, setScreen } = useApp();
  const [selectedTier, setSelectedTier] = useState(save.tiers.current);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const skills = save.skills as Record<string, SkillState>;

  const masteredIds = new Set(
    Object.entries(skills)
      .filter(([, s]) => s.status === 'mastered')
      .map(([id]) => id)
  );

  const tierNodes = SKILL_NODES.filter(n => n.tier === selectedTier);
  const selectedNodeData = selectedNode ? SKILL_NODES.find(n => n.id === selectedNode) : null;
  const selectedSkillState = selectedNode ? skills[selectedNode] : null;
  const conceptCard = selectedNode ? getConceptCard(selectedNode) : null;

  const isNodeUnlocked = (nodeId: string) => {
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node) return false;
    return node.prereq.every(p => masteredIds.has(p));
  };

  const isTierUnlocked = (tier: number) => save.tiers.unlocked.includes(tier);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
        Peta Skill
      </h1>

      {/* Tier tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {TIER_CONFIG.map(tc => {
          const unlocked = isTierUnlocked(tc.tier);
          const tierNodeIds = SKILL_NODES.filter(n => n.tier === tc.tier).map(n => n.id);
          const masteredInTier = tierNodeIds.filter(id => masteredIds.has(id)).length;
          const isActive = selectedTier === tc.tier;

          return (
            <button
              key={tc.tier}
              onClick={() => unlocked && setSelectedTier(tc.tier)}
              style={{
                flexShrink: 0,
                background: isActive ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '8px 14px',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minWidth: 80,
              }}
            >
              {!unlocked && <Lock size={12} color="var(--muted)" />}
              <span className="font-display font-bold text-xs" style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}>
                Tier {tc.tier}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{tc.name}</span>
              {unlocked && (
                <span className="font-mono text-xs" style={{ color: 'var(--success)' }}>
                  {masteredInTier}/{tierNodeIds.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tier info */}
      <div className="panel" style={{ padding: 14, marginBottom: 16 }}>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {TIER_CONFIG[selectedTier]?.description}
        </p>
      </div>

      {/* Node grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {tierNodes.map(node => {
          const state = skills[node.id];
          const status = state?.status || 'baru';
          const unlocked = isNodeUnlocked(node.id);
          const color = STATUS_COLORS[status] || 'var(--muted)';

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              style={{
                background: `rgba(${hexToRgb(color)}, 0.06)`,
                border: `1.5px solid rgba(${hexToRgb(color)}, 0.3)`,
                borderRadius: 12,
                padding: 14,
                textAlign: 'left',
                cursor: 'pointer',
                opacity: unlocked ? 1 : 0.5,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              {!unlocked && (
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Lock size={12} color="var(--muted)" />
                </div>
              )}
              {status === 'mastered' && (
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Star size={12} color="var(--success)" fill="var(--success)" />
                </div>
              )}
              <p className="font-display font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>
                {node.name}
              </p>
              <div className={`tier-badge status-${status}`} style={{ display: 'inline-block' }}>
                {STATUS_LABELS[status] || status}
              </div>
              {state && (
                <p className="font-mono text-xs mt-2" style={{ color: 'var(--muted)' }}>
                  Elo: {state.elo} · S: {state.S.toFixed(1)}d
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Node detail sheet */}
      {selectedNode && selectedNodeData && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setSelectedNode(null)}>
          <div
            className="panel-lg animate-slideUp"
            style={{ width: '100%', maxWidth: 640, maxHeight: '80dvh', overflow: 'auto', padding: 24, marginBottom: 'env(safe-area-inset-bottom, 0)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>{selectedNodeData.name}</h3>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted)' }}>{selectedNodeData.id} · Tier {selectedNodeData.tier}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status */}
            {selectedSkillState && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <div className="panel" style={{ padding: 12, textAlign: 'center' }}>
                  <p className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{selectedSkillState.elo}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Elo</p>
                </div>
                <div className="panel" style={{ padding: 12, textAlign: 'center' }}>
                  <p className="font-mono font-bold" style={{ color: 'var(--data)' }}>{selectedSkillState.S.toFixed(1)}d</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Stabilitas</p>
                </div>
                <div className="panel" style={{ padding: 12, textAlign: 'center' }}>
                  <p className="font-mono font-bold" style={{ color: 'var(--success)' }}>{selectedSkillState.streakBenar}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Streak</p>
                </div>
              </div>
            )}

            {/* Concept card preview */}
            {conceptCard && (
              <div className="panel" style={{ padding: 14, marginBottom: 16 }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>KONSEP SINGKAT</p>
                <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>{conceptCard.definition.slice(0, 150)}...</p>
                <div style={{ padding: '8px 12px', background: 'rgba(245,166,35,0.08)', borderRadius: 8, overflowX: 'auto' }}>
                  <KaTeXRenderer latex={conceptCard.formula} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => { setSelectedNode(null); setScreen('runner'); }}
              >
                <Zap size={14} /> Latihan
              </button>
              {conceptCard && (
                <button className="btn-secondary" onClick={() => setSelectedNode(selectedNode)}>
                  <BookOpen size={14} /> Konsep
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(color: string): string {
  // For CSS variables, return a default
  if (color.startsWith('var(')) {
    const defaults: Record<string, string> = {
      'var(--success)': '61,220,132',
      'var(--accent)': '245,166,35',
      'var(--data)': '55,200,240',
      'var(--muted)': '147,160,180',
    };
    return defaults[color] || '147,160,180';
  }
  return '147,160,180';
}
