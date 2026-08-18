import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../AppState';
import { KaTeXRenderer } from '../components/KaTeXRenderer';
import { KoaAvatar } from '../components/KoaAvatar';
import { generateQuestion, getKnobsForElo } from '../../engine';
import type { QuestionSpec, Choice } from '../../engine/types';
import { determineRating, updateState, initState, type SkillState } from '../../scheduler';
import { SaveSystem } from '../../storage';
import { getHumorLine } from '../../content/humor';
import { SKILL_NODES } from '../../content/skillTree';
import { getConceptCard } from '../../content/conceptCards';
import { X, Lightbulb, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

type Phase = 'warmup' | 'review' | 'focus' | 'summary';
type AnswerState = 'pending' | 'correct' | 'wrong' | 'revealed';

const SESSION_SEED = Math.floor(Math.random() * 100000);

export function RunnerScreen() {
  const { save, setScreen, updateSave, dailyQueue, refreshQueue, setKoaState, setHumorLine, seriousMode } = useApp();

  const [phase, setPhase] = useState<Phase>('review');
  const [queueIds] = useState<string[]>(() => dailyQueue.length > 0 ? dailyQueue : SKILL_NODES.slice(0, 5).map(n => n.id));
  const [qIndex, setQIndex] = useState(0);
  const [counter, setCounter] = useState(0);

  const [question, setQuestion] = useState<QuestionSpec | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [startTs, setStartTs] = useState(performance.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [requeue, setRequeue] = useState<string[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentSkillId = queueIds[qIndex] || SKILL_NODES[0].id;
  const currentNode = SKILL_NODES.find(n => n.id === currentSkillId) || SKILL_NODES[0];
  const currentSkillState = save.skills[currentSkillId] as SkillState | undefined;
  const conceptCard = getConceptCard(currentSkillId);

  useEffect(() => {
    const elo = currentSkillState?.elo || 1200;
    const knobs = getKnobsForElo(elo);
    const q = generateQuestion(currentSkillId, SESSION_SEED, counter, knobs);
    setQuestion(q);
    setAnswerState('pending');
    setSelectedChoice(null);
    setNumericInput('');
    setShowSolution(false);
    setStartTs(performance.now());
  }, [currentSkillId, counter]);

  useEffect(() => {
    if (!currentSkillState || currentSkillState.attempts === 0) {
      if (conceptCard) setShowConcept(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSkillId]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (answerState !== 'pending' || !question) return;

    const responseMs = performance.now() - startTs;
    const rating = determineRating(correct, responseMs, question.targetMs, streak);
    const today = new Date().toISOString().slice(0, 10);

    const prevState = save.skills[currentSkillId] as SkillState | undefined;
    const newState = prevState
      ? updateState(prevState, rating, responseMs, currentNode.targetMs, question.difficultyRating)
      : initState(rating);

    updateSave(data => ({
      ...data,
      skills: { ...data.skills, [currentSkillId]: newState },
      stats: {
        ...data.stats,
        totalQuestions: data.stats.totalQuestions + 1,
      },
    }));

    SaveSystem.recordAnswer(correct, today, responseMs);

    setAnswerState(correct ? 'correct' : 'wrong');
    setTotalCount(t => t + 1);

    if (correct) {
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
      setKoaState('happy');
      if (!seriousMode) {
        const trigger = responseMs < question.targetMs * 0.6 ? 'benar-cepat'
          : responseMs > question.targetMs * 1.5 ? 'benar-lambat'
          : 'benar-normal';
        const line = getHumorLine(trigger);
        if (line) setHumorLine(line);
      }
    } else {
      setStreak(0);
      setKoaState('oops');
      setShakeKey(k => k + 1);
      if (!seriousMode) {
        const line = getHumorLine('salah');
        if (line) setHumorLine(line);
      }
      setRequeue(prev => [...prev, currentSkillId]);
    }

    setShowSolution(true);
  }, [answerState, question, startTs, streak, currentSkillId, currentNode, save.skills, updateSave, setKoaState, setHumorLine, seriousMode]);

  const handleMCChoice = (idx: number, isCorrect: boolean) => {
    if (answerState !== 'pending') return;
    setSelectedChoice(idx);
    handleAnswer(isCorrect);
  };

  const handleNumericSubmit = () => {
    if (answerState !== 'pending' || !question) return;
    const raw = numericInput.replace(',', '.');
    const val = parseFloat(raw);
    if (isNaN(val)) return;

    const ans = question.answer as { type: 'numeric'; value: number; tolerance: number };
    const correct = Math.abs(val - ans.value) <= ans.tolerance;
    handleAnswer(correct);
  };

  const nextQuestion = () => {
    setKoaState('idle');
    const nextIdx = qIndex + 1;

    const fullQueue = [...queueIds.slice(qIndex + 1), ...requeue];
    if (fullQueue.length === 0) {
      setPhase('summary');
      setKoaState('celebrate');
      refreshQueue();
      if (!seriousMode) {
        const line = getHumorLine('sesi-selesai');
        if (line) setHumorLine(line);
      }
      return;
    }

    if (nextIdx < queueIds.length) {
      setQIndex(nextIdx);
    } else if (requeue.length > 0) {
      const next = requeue[0];
      setRequeue(prev => prev.slice(1));
      const idx = queueIds.findIndex(id => id === next);
      if (idx !== -1) setQIndex(idx);
    }
    setCounter(c => c + 1);
  };

  void phase;
  void inputRef;

  if (!question) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
    </div>
  );

  if (phase === 'summary') {
    return <SessionSummary correct={correctCount} total={totalCount} onClose={() => setScreen('home')} />;
  }

  const progress = Math.min(qIndex / Math.max(queueIds.length, 1), 1);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setScreen('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 4 }}
          aria-label="Kembali"
        >
          <X size={20} />
        </button>

        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 3, width: `${progress * 100}%`, transition: 'width 0.4s ease' }} />
        </div>

        <span className="font-mono text-xs" style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {qIndex + 1}/{queueIds.length}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 28 }}>
          <KoaAvatar state="idle" size={28} mini />
        </div>
      </div>

      {/* Phase chip */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="tier-badge status-belajar">Review</span>
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{currentNode.name}</span>
          <span style={{ marginLeft: 'auto', color: streak >= 3 ? 'var(--accent)' : 'var(--muted)', fontSize: 12, fontFamily: 'monospace' }}>
            {streak > 0 ? `🔥 ×${streak}` : ''}
          </span>
        </div>
      </div>

      {/* Concept card modal */}
      {showConcept && conceptCard && (
        <ConceptCardModal card={conceptCard} onClose={() => setShowConcept(false)} />
      )}

      {/* Question */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div key={shakeKey} className={shakeKey > 0 ? 'animate-shake' : ''}>
          {/* Prompt */}
          <div className="panel-lg" style={{ padding: 20, marginBottom: 16 }}>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text)', marginBottom: question.prompt.latex ? 12 : 0 }}>
              {question.prompt.text}
            </p>
            {question.prompt.latex && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflowX: 'auto' }}>
                <KaTeXRenderer latex={question.prompt.latex} displayMode />
              </div>
            )}
          </div>

          {question.format === 'mc' && question.choices && (
            <MCInput
              choices={question.choices}
              selectedChoice={selectedChoice}
              answerState={answerState}
              onSelect={handleMCChoice}
            />
          )}

          {(question.format === 'numeric' || question.format === 'steps') && (
            <NumericInput
              value={numericInput}
              onChange={setNumericInput}
              onSubmit={handleNumericSubmit}
              disabled={answerState !== 'pending'}
              answerState={answerState}
              correctValue={answerState !== 'pending' ? (question.answer as { value: number }).value : undefined}
              inputRef={inputRef}
            />
          )}
        </div>

        {showSolution && (
          <SolutionPanel
            question={question}
            answerState={answerState}
            onNext={nextQuestion}
            onShowConcept={conceptCard ? () => setShowConcept(true) : undefined}
          />
        )}

        {!showSolution && conceptCard && (
          <button
            className="btn-secondary"
            style={{ alignSelf: 'flex-start', fontSize: 12 }}
            onClick={() => setShowConcept(true)}
          >
            <Lightbulb size={14} /> Konsep
          </button>
        )}
      </div>
    </div>
  );
}

function MCInput({ choices, selectedChoice, answerState, onSelect }: {
  choices: Choice[];
  selectedChoice: number | null;
  answerState: AnswerState;
  onSelect: (idx: number, isCorrect: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {choices.map((choice, idx) => {
        let extraClass = '';
        if (answerState !== 'pending') {
          if (choice.isCorrect) extraClass = 'correct';
          else if (selectedChoice === idx) extraClass = 'wrong';
        } else if (selectedChoice === idx) {
          extraClass = 'selected';
        }

        const label = String.fromCharCode(65 + idx);

        return (
          <button
            key={idx}
            className={`btn-choice ${extraClass}`}
            onClick={() => onSelect(idx, choice.isCorrect)}
            disabled={answerState !== 'pending'}
          >
            <span className="font-mono text-xs" style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '2px 7px',
              minWidth: 24,
              textAlign: 'center',
              flexShrink: 0,
            }}>{label}</span>
            <span style={{ flex: 1 }}>
              {choice.latex
                ? <KaTeXRenderer latex={choice.latex} />
                : choice.text}
            </span>
            {answerState !== 'pending' && choice.isCorrect && (
              <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
            )}
            {answerState !== 'pending' && !choice.isCorrect && selectedChoice === idx && (
              <XCircle size={16} color="var(--danger)" style={{ flexShrink: 0 }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function NumericInput({ value, onChange, onSubmit, disabled, answerState, correctValue, inputRef }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  answerState: AnswerState;
  correctValue?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '-'];

  const press = (key: string) => {
    if (disabled) return;
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === 'C') {
      onChange('');
    } else {
      if ((key === ',' || key === '.') && (value.includes(',') || value.includes('.'))) return;
      onChange(value + key);
    }
  };

  const displayColor = answerState === 'correct' ? 'var(--success)'
    : answerState === 'wrong' ? 'var(--danger)'
    : 'var(--text)';

  return (
    <div>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${answerState === 'correct' ? 'var(--success)' : answerState === 'wrong' ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '14px 20px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 56,
        transition: 'border-color 0.2s ease',
      }}>
        <span className="font-mono text-2xl font-bold" style={{ color: displayColor }}>
          {value || <span style={{ color: 'var(--muted)', fontSize: 16 }}>Ketik jawaban...</span>}
        </span>
        {answerState === 'correct' && <CheckCircle size={20} color="var(--success)" />}
        {answerState === 'wrong' && (
          <span className="font-mono text-sm" style={{ color: 'var(--danger)' }}>
            Jawaban: {correctValue}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => !disabled && onChange(e.target.value.replace(/[^0-9,.\-]/g, ''))}
        onKeyDown={e => e.key === 'Enter' && !disabled && onSubmit()}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        aria-label="Input jawaban"
        inputMode="numeric"
      />

      {!disabled && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {digits.map(d => (
            <button key={d} className="keypad-btn" onClick={() => press(d)} aria-label={d}>
              {d}
            </button>
          ))}
          <button className="keypad-btn" onClick={() => press('⌫')} aria-label="Hapus">⌫</button>
          <button className="keypad-btn" onClick={() => press('C')} aria-label="Bersihkan">C</button>
          <button
            className="keypad-btn submit"
            style={{ gridColumn: 'span 2' }}
            onClick={onSubmit}
            aria-label="Submit"
          >
            ↵
          </button>
        </div>
      )}
    </div>
  );
}

function SolutionPanel({ question, answerState, onNext, onShowConcept }: {
  question: QuestionSpec;
  answerState: AnswerState;
  onNext: () => void;
  onShowConcept?: () => void;
}) {
  const [unsure, setUnsure] = useState(false);
  void unsure;

  return (
    <div className="panel-lg animate-slideUp" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {answerState === 'correct'
          ? <><CheckCircle size={20} color="var(--success)" /><span className="font-display font-bold" style={{ color: 'var(--success)' }}>Benar!</span></>
          : <><XCircle size={20} color="var(--danger)" /><span className="font-display font-bold" style={{ color: 'var(--danger)' }}>Kurang tepat</span></>
        }
      </div>

      <p className="font-display font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>{question.solution.title}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {question.solution.steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="font-mono text-xs" style={{
              color: 'var(--accent)',
              background: 'rgba(245,166,35,0.12)',
              borderRadius: 5,
              padding: '2px 7px',
              flexShrink: 0,
              marginTop: 2,
            }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <p className="text-sm" style={{ color: 'var(--text)', marginBottom: step.latex ? 4 : 0 }}>{step.text}</p>
              {step.latex && (
                <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflowX: 'auto' }}>
                  <KaTeXRenderer latex={step.latex} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(245,166,35,0.08)', borderRadius: 10, marginBottom: 12, overflowX: 'auto' }}>
        <KaTeXRenderer latex={question.solution.finalLatex} />
      </div>

      <p className="text-xs italic" style={{ color: 'var(--muted)', marginBottom: 8 }}>
        💡 {question.solution.takeaway}
      </p>

      {question.solution.misconceptionNote && answerState === 'wrong' && (
        <p className="text-xs" style={{ color: '#FFB800', marginBottom: 12 }}>
          ⚠ {question.solution.misconceptionNote}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={onNext}>
          Lanjut <ChevronRight size={16} />
        </button>
        <button
          className="btn-secondary"
          style={{ fontSize: 12 }}
          onClick={() => setUnsure(u => !u)}
        >
          <RotateCcw size={12} /> Masih ragu
        </button>
        {onShowConcept && (
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={onShowConcept}>
            <Lightbulb size={12} /> Konsep
          </button>
        )}
      </div>
    </div>
  );
}

function ConceptCardModal({ card, onClose }: {
  card: NonNullable<ReturnType<typeof getConceptCard>>;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        className="panel-lg animate-slideUp"
        style={{ width: '100%', maxWidth: 640, maxHeight: '85dvh', overflow: 'auto', padding: 24, marginBottom: 'env(safe-area-inset-bottom, 0)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{card.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>{card.definition}</p>

        <div style={{ padding: '12px 16px', background: 'rgba(245,166,35,0.08)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' }}>
          <KaTeXRenderer latex={card.formula} displayMode />
        </div>

        <div className="panel" style={{ padding: 14, marginBottom: 16 }}>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>CONTOH</p>
          <p className="text-sm mb-2" style={{ color: 'var(--text)' }}>{card.example.problem}</p>
          {card.example.steps.map((s, i) => (
            <p key={i} className="text-sm" style={{ color: 'var(--muted)', paddingLeft: 12 }}>↳ {s}</p>
          ))}
          <p className="text-sm font-bold mt-2" style={{ color: 'var(--success)' }}>→ {card.example.answer}</p>
        </div>

        {card.misconceptions.map((m, i) => (
          <p key={i} className="text-xs mb-2" style={{ color: '#FFB800' }}>⚠ {m}</p>
        ))}

        <p className="text-xs mt-4 italic" style={{ color: 'var(--muted)' }}>🏭 {card.whyItMatters}</p>

        <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>
          Mengerti, Lanjut Latihan
        </button>
      </div>
    </div>
  );
}

function SessionSummary({ correct, total, onClose }: { correct: number; total: number; onClose: () => void }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: 24, textAlign: 'center' }}>
      <KoaAvatar state="celebrate" size={120} />
      <h2 className="font-display text-3xl font-bold mt-6 mb-2" style={{ color: 'var(--text)' }}>Sesi Selesai!</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>KOA menutup shift dengan rapi.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 320, marginBottom: 24 }}>
        <div className="panel" style={{ padding: 16 }}>
          <p className="font-display text-3xl font-bold" style={{ color: 'var(--success)' }}>{correct}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Benar</p>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <p className="font-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>{pct}%</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Akurasi</p>
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', maxWidth: 320 }} onClick={onClose}>
        Kembali ke Beranda
      </button>
    </div>
  );
}

import React from 'react';
void React;
