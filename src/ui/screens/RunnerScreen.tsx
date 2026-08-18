import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../AppState';
import { KaTeXRenderer } from '../components/KaTeXRenderer';
import { KoaAvatar } from '../components/KoaAvatar';
import { VisualRenderer } from '../../visual/InteractiveCharts';
import { generateQuestion, getKnobsForElo } from '../../engine';
import type { QuestionSpec, Choice } from '../../engine/types';
import { determineRating, updateState, initState, type SkillState } from '../../scheduler';
import { SaveSystem } from '../../storage';
import { getHumorLine } from '../../content/humor';
import { SKILL_NODES } from '../../content/skillTree';
import { getConceptCard } from '../../content/conceptCards';
import { audioSynth } from '../../audio';
import { X, Lightbulb, ChevronRight, RotateCcw, CheckCircle, XCircle, Zap, Flame, Award, ArrowRight } from 'lucide-react';

type SessionPhase = 'warmup' | 'review' | 'focus' | 'cooldown';
type AnswerState = 'pending' | 'correct' | 'wrong';

const SESSION_SEED = Math.floor(Math.random() * 100000);

export function RunnerScreen() {
  const { save, setScreen, updateSave, dailyQueue, refreshQueue, setKoaState, setHumorLine, seriousMode } = useApp();

  // Formal 4-Phase Session State
  const [phase, setPhase] = useState<SessionPhase>('warmup');
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [warmupScore, setWarmupScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewQueue] = useState<string[]>(() => dailyQueue.length > 0 ? dailyQueue : SKILL_NODES.slice(0, 5).map(n => n.id));

  const [focusIndex, setFocusIndex] = useState(0);
  const [counter, setCounter] = useState(0);

  const [question, setQuestion] = useState<QuestionSpec | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [symbolExpr, setSymbolExpr] = useState('');
  const [stepsInputs, setStepsInputs] = useState<string[]>(['', '', '']);

  const [showSolution, setShowSolution] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [startTs, setStartTs] = useState(performance.now());

  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [requeue, setRequeue] = useState<string[]>([]);
  const [shakeKey, setShakeKey] = useState(0);

  const currentSkillId = phase === 'warmup' ? 'mm.campur'
    : phase === 'review' ? (reviewQueue[reviewIndex] || SKILL_NODES[0].id)
    : (reviewQueue[0] || SKILL_NODES[0].id);

  const currentNode = SKILL_NODES.find(n => n.id === currentSkillId) || SKILL_NODES[0];
  const currentSkillState = save.skills[currentSkillId] as SkillState | undefined;
  const conceptCard = getConceptCard(currentSkillId);

  // Generate question on skill change / counter increment
  useEffect(() => {
    const elo = currentSkillState?.elo || 1200;
    const knobs = getKnobsForElo(elo);
    const q = generateQuestion(currentSkillId, SESSION_SEED, counter, knobs);

    if (phase === 'warmup') {
      q.format = 'rush';
    }

    setQuestion(q);
    setAnswerState('pending');
    setSelectedChoice(null);
    setNumericInput('');
    setSymbolExpr('');
    setSliderValue(50);
    setStepsInputs(['', '', '']);
    setShowSolution(false);
    setStartTs(performance.now());
  }, [currentSkillId, counter, phase]);

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
      audioSynth.playCorrect();
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
      setCombo(c => c + 1);
      setKoaState('happy');
      if (combo > 0 && combo % 3 === 0) {
        audioSynth.playCombo(combo);
      }
      if (!seriousMode) {
        const trigger = responseMs < question.targetMs * 0.6 ? 'benar-cepat'
          : responseMs > question.targetMs * 1.5 ? 'benar-lambat'
          : 'benar-normal';
        const line = getHumorLine(trigger);
        if (line) setHumorLine(line);
      }
    } else {
      audioSynth.playWrong();
      setStreak(0);
      setCombo(0);
      setKoaState('oops');
      setShakeKey(k => k + 1);
      if (!seriousMode) {
        const line = getHumorLine('salah');
        if (line) setHumorLine(line);
      }
      setRequeue(prev => [...prev, currentSkillId]);
    }

    setShowSolution(true);
  }, [answerState, question, startTs, streak, combo, currentSkillId, currentNode, save.skills, updateSave, setKoaState, setHumorLine, seriousMode]);

  const advanceSession = () => {
    setKoaState('idle');

    if (phase === 'warmup') {
      if (warmupIndex + 1 < 5) {
        setWarmupIndex(w => w + 1);
        setCounter(c => c + 1);
      } else {
        // Warmup complete -> Move to SRS Review
        setPhase('review');
        setCounter(c => c + 1);
      }
      return;
    }

    if (phase === 'review') {
      if (reviewIndex + 1 < reviewQueue.length) {
        setReviewIndex(r => r + 1);
        setCounter(c => c + 1);
      } else if (requeue.length > 0) {
        // Clear requeue items
        const nextId = requeue[0];
        setRequeue(r => r.slice(1));
        setCounter(c => c + 1);
      } else {
        // Review complete -> Move to Focus Node
        setPhase('focus');
        setCounter(c => c + 1);
      }
      return;
    }

    if (phase === 'focus') {
      if (focusIndex + 1 < 5) {
        setFocusIndex(f => f + 1);
        setCounter(c => c + 1);
      } else {
        // Focus complete -> Move to Cooldown Summary
        setPhase('cooldown');
        setKoaState('celebrate');
        audioSynth.playFanfare();
        refreshQueue();
      }
    }
  };

  const submitNumeric = () => {
    if (!question) return;
    const val = parseFloat(numericInput.replace(',', '.'));
    if (isNaN(val)) return;
    const ans = question.answer as { type: 'numeric'; value: number; tolerance: number };
    const correct = Math.abs(val - ans.value) <= ans.tolerance;
    handleAnswer(correct);
  };

  const submitSlider = () => {
    if (!question) return;
    const ans = question.answer as { type: 'slider'; value: number; tolerance: number };
    const correct = Math.abs(sliderValue - ans.value) <= (ans.tolerance || 5);
    handleAnswer(correct);
  };

  const submitSteps = () => {
    if (!question) return;
    const ans = question.answer as { type: 'steps'; stepValues: number[] };
    const userVals = stepsInputs.map(s => parseFloat(s.replace(',', '.')));
    const allCorrect = ans.stepValues.every((target, idx) => Math.abs((userVals[idx] || 0) - target) <= 0.1);
    handleAnswer(allCorrect);
  };

  if (!question) return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="animate-spin w-8 h-8 border-3 border-border border-t-accent rounded-full" />
    </div>
  );

  if (phase === 'cooldown') {
    return (
      <CooldownSummary
        correct={correctCount}
        total={totalCount}
        onClose={() => setScreen('home')}
      />
    );
  }

  const phaseProgress = phase === 'warmup' ? (warmupIndex / 5)
    : phase === 'review' ? (reviewIndex / Math.max(reviewQueue.length, 1))
    : (focusIndex / 5);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div className="p-3 border-b border-border flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="text-muted hover:text-text p-1 bg-none border-none cursor-pointer"
          aria-label="Kembali"
        >
          <X size={20} />
        </button>

        {/* Phase progress bar */}
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${Math.round(phaseProgress * 100)}%` }}
          />
        </div>

        <span className="font-mono text-xs text-muted">
          {phase === 'warmup' ? `Warm-Up ${warmupIndex + 1}/5`
            : phase === 'review' ? `Review ${reviewIndex + 1}/${reviewQueue.length}`
            : `Fokus ${focusIndex + 1}/5`}
        </span>

        <KoaAvatar state="idle" size={28} mini />
      </div>

      {/* Phase Indicator Badge */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {phase === 'warmup' && <span className="tier-badge status-lancar flex items-center gap-1"><Zap size={10} /> Warm-Up Mental</span>}
          {phase === 'review' && <span className="tier-badge status-belajar flex items-center gap-1">SRS Review</span>}
          {phase === 'focus' && <span className="tier-badge status-mastered flex items-center gap-1">Fokus Skill</span>}
          <span className="font-mono text-xs text-muted">{currentNode.name}</span>
        </div>

        {combo > 1 && (
          <span className="font-mono text-xs font-bold text-amber-400 animate-pulse-amber">
            🔥 Combo x{combo}
          </span>
        )}
      </div>

      {/* Concept Card Modal */}
      {showConcept && conceptCard && (
        <ConceptCardModal card={conceptCard} onClose={() => setShowConcept(false)} />
      )}

      {/* Main Question Card Container */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div key={shakeKey} className={shakeKey > 0 ? 'animate-shake' : ''}>
          {/* Prompt Card */}
          <div className="panel-lg p-5 mb-4">
            <p className="text-base text-text leading-relaxed mb-3">
              {question.prompt.text}
            </p>

            {question.prompt.latex && (
              <div className="p-3 bg-white/5 rounded-xl mb-3 overflow-x-auto">
                <KaTeXRenderer latex={question.prompt.latex} displayMode />
              </div>
            )}

            {/* Embedded Interactive SVG Chart (if available) */}
            {question.prompt.visual && (
              <div className="mt-3">
                <VisualRenderer spec={question.prompt.visual} />
              </div>
            )}
          </div>

          {/* Answer Formats */}
          {question.format === 'mc' && question.choices && (
            <div className="flex flex-col gap-2">
              {question.choices.map((c, idx) => (
                <button
                  key={idx}
                  className={`btn-choice ${answerState !== 'pending' ? (c.isCorrect ? 'correct' : selectedChoice === idx ? 'wrong' : '') : (selectedChoice === idx ? 'selected' : '')}`}
                  disabled={answerState !== 'pending'}
                  onClick={() => {
                    setSelectedChoice(idx);
                    handleAnswer(c.isCorrect);
                  }}
                >
                  <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1">{c.latex ? <KaTeXRenderer latex={c.latex} /> : c.text}</span>
                  {answerState !== 'pending' && c.isCorrect && <CheckCircle size={16} color="var(--success)" />}
                  {answerState !== 'pending' && !c.isCorrect && selectedChoice === idx && <XCircle size={16} color="var(--danger)" />}
                </button>
              ))}
            </div>
          )}

          {(question.format === 'numeric' || question.format === 'rush') && (
            <NumericKeypadInput
              value={numericInput}
              onChange={setNumericInput}
              onSubmit={submitNumeric}
              disabled={answerState !== 'pending'}
              answerState={answerState}
              correctValue={(question.answer as any).value}
            />
          )}

          {question.format === 'slider' && (
            <div className="panel p-4">
              <p className="text-xs text-muted mb-2 font-mono text-center">Estimasi Nilai: {sliderValue}</p>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={e => setSliderValue(parseInt(e.target.value))}
                disabled={answerState !== 'pending'}
                className="w-full accent-amber-500 mb-4"
              />
              {answerState === 'pending' && (
                <button className="btn-primary w-full" onClick={submitSlider}>Submit Estimasi</button>
              )}
            </div>
          )}

          {question.format === 'steps' && (
            <div className="panel p-4 flex flex-col gap-3">
              <p className="text-xs text-muted font-mono mb-1">Isi Langkah Prosedur:</p>
              {((question.answer as any).stepValues || [0, 0]).map((_: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-accent bg-amber-500/10 px-2 py-1 rounded">Langkah {idx + 1}</span>
                  <input
                    type="text"
                    value={stepsInputs[idx] || ''}
                    onChange={e => {
                      const next = [...stepsInputs];
                      next[idx] = e.target.value;
                      setStepsInputs(next);
                    }}
                    disabled={answerState !== 'pending'}
                    className="flex-1 bg-white/5 border border-border rounded-lg p-2 font-mono text-sm text-text"
                    placeholder="Hasil..."
                  />
                </div>
              ))}
              {answerState === 'pending' && (
                <button className="btn-primary w-full mt-2" onClick={submitSteps}>Submit Semua Langkah</button>
              )}
            </div>
          )}

          {question.format === 'mathlive' && (
            <div className="panel p-4 flex flex-col gap-3">
              <p className="text-xs text-muted font-mono mb-1">Ekspresi Simbolik:</p>
              <div className="p-3 bg-white/5 border border-border rounded-xl font-mono text-lg text-amber-400 min-h-[48px] flex items-center">
                {symbolExpr ? <KaTeXRenderer latex={symbolExpr} /> : <span className="text-muted text-sm">Gunakan tombol simbol di bawah...</span>}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['x^2', '\\sqrt{x}', '\\pi', '\\frac{d}{dx}', '\\int'].map(sym => (
                  <button key={sym} className="btn-secondary text-xs" onClick={() => setSymbolExpr(prev => prev + sym)}>
                    <KaTeXRenderer latex={sym} />
                  </button>
                ))}
              </div>
              {answerState === 'pending' && (
                <button className="btn-primary w-full mt-2" onClick={() => handleAnswer(true)}>Submit Ekspresi</button>
              )}
            </div>
          )}
        </div>

        {/* Solution Panel */}
        {showSolution && (
          <SolutionPanel
            question={question}
            answerState={answerState}
            onNext={advanceSession}
            onShowConcept={conceptCard ? () => setShowConcept(true) : undefined}
          />
        )}

        {!showSolution && conceptCard && (
          <button className="btn-secondary self-start text-xs" onClick={() => setShowConcept(true)}>
            <Lightbulb size={14} /> Konsep
          </button>
        )}
      </div>
    </div>
  );
}

function NumericKeypadInput({ value, onChange, onSubmit, disabled, answerState, correctValue }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  answerState: AnswerState;
  correctValue?: number;
}) {
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '-'];

  const press = (key: string) => {
    if (disabled) return;
    audioSynth.playClick();
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === 'C') {
      onChange('');
    } else {
      if ((key === ',' || key === '.') && (value.includes(',') || value.includes('.'))) return;
      onChange(value + key);
    }
  };

  return (
    <div>
      <div className={`panel p-3.5 mb-3 flex items-center justify-between min-h-[56px] border-1.5 ${answerState === 'correct' ? 'border-emerald-500 text-emerald-400' : answerState === 'wrong' ? 'border-red-500 text-red-400' : 'border-border text-text'}`}>
        <span className="font-mono text-2xl font-bold">
          {value || <span className="text-muted text-base">Ketik jawaban...</span>}
        </span>
        {answerState === 'correct' && <CheckCircle size={20} color="var(--success)" />}
        {answerState === 'wrong' && <span className="font-mono text-sm text-red-400">Jawaban: {correctValue}</span>}
      </div>

      {!disabled && (
        <div className="grid grid-cols-4 gap-2">
          {digits.map(d => (
            <button key={d} className="keypad-btn" onClick={() => press(d)}>{d}</button>
          ))}
          <button className="keypad-btn" onClick={() => press('⌫')}>⌫</button>
          <button className="keypad-btn" onClick={() => press('C')}>C</button>
          <button className="keypad-btn submit col-span-2" onClick={onSubmit}>↵ Submit</button>
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
  return (
    <div className="panel-lg p-5 animate-slideUp">
      <div className="flex items-center gap-2 mb-3">
        {answerState === 'correct'
          ? <><CheckCircle size={20} color="var(--success)" /><span className="font-display font-bold text-emerald-400">Benar!</span></>
          : <><XCircle size={20} color="var(--danger)" /><span className="font-display font-bold text-red-400">Kurang tepat</span></>
        }
      </div>

      <p className="font-display font-bold text-sm mb-3 text-text">{question.solution.title}</p>

      <div className="flex flex-col gap-2 mb-3">
        {question.solution.steps.map((step, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <span className="font-mono text-xs text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{i + 1}</span>
            <div className="flex-1">
              <p className="text-sm text-text">{step.text}</p>
              {step.latex && (
                <div className="p-2 bg-white/5 rounded-lg overflow-x-auto mt-1">
                  <KaTeXRenderer latex={step.latex} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-amber-500/10 rounded-lg mb-3 overflow-x-auto">
        <KaTeXRenderer latex={question.solution.finalLatex} />
      </div>

      <p className="text-xs italic text-muted mb-3">💡 {question.solution.takeaway}</p>

      {question.solution.misconceptionNote && answerState === 'wrong' && (
        <p className="text-xs text-amber-400 mb-4 p-2 bg-amber-500/10 rounded-lg">
          ⚠ {question.solution.misconceptionNote}
        </p>
      )}

      <div className="flex gap-2">
        <button className="btn-primary flex-1" onClick={onNext}>
          Lanjut <ChevronRight size={16} />
        </button>
        {onShowConcept && (
          <button className="btn-secondary text-xs" onClick={onShowConcept}>
            <Lightbulb size={14} /> Konsep
          </button>
        )}
      </div>
    </div>
  );
}

function ConceptCardModal({ card, onClose }: { card: NonNullable<ReturnType<typeof getConceptCard>>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div className="panel-lg p-6 w-full max-w-2xl max-h-[85dvh] overflow-y-auto animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display font-bold text-xl text-text">{card.title}</h2>
          <button onClick={onClose} className="text-muted hover:text-text"><X size={20} /></button>
        </div>

        <p className="text-sm leading-relaxed mb-4 text-text">{card.definition}</p>

        <div className="p-3 bg-amber-500/10 rounded-xl mb-4 overflow-x-auto">
          <KaTeXRenderer latex={card.formula} displayMode />
        </div>

        <div className="panel p-4 mb-4 bg-white/5">
          <p className="text-xs font-mono font-medium text-muted mb-2">CONTOH SOAL & LANGKAH</p>
          <p className="text-sm text-text mb-2">{card.example.problem}</p>
          {card.example.steps.map((s, i) => (
            <p key={i} className="text-sm text-muted pl-3">↳ {s}</p>
          ))}
          <p className="text-sm font-bold text-emerald-400 mt-2">→ {card.example.answer}</p>
        </div>

        {card.misconceptions.map((m, i) => (
          <p key={i} className="text-xs text-amber-400 mb-2">⚠ {m}</p>
        ))}

        <p className="text-xs italic text-muted mt-4">🏭 {card.whyItMatters}</p>

        <button className="btn-primary w-full mt-4" onClick={onClose}>Mengerti, Lanjut Latihan</button>
      </div>
    </div>
  );
}

function CooldownSummary({ correct, total, onClose }: { correct: number; total: number; onClose: () => void }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6 text-center">
      <KoaAvatar state="celebrate" size={120} />
      <h2 className="font-display text-3xl font-bold text-text mt-4 mb-1">Shift Selesai!</h2>
      <p className="text-sm text-muted mb-6">KOA menutup shift produksi hari ini dengan rapi.</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
        <div className="panel p-4">
          <p className="font-display text-3xl font-bold text-emerald-400">{correct}</p>
          <p className="text-xs text-muted">Soal Benar</p>
        </div>
        <div className="panel p-4">
          <p className="font-display text-3xl font-bold text-amber-400">{pct}%</p>
          <p className="text-xs text-muted">Akurasi</p>
        </div>
      </div>

      <button className="btn-primary w-full max-w-xs" onClick={onClose}>
        Kembali ke Beranda <ArrowRight size={16} />
      </button>
    </div>
  );
}
