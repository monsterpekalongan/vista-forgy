// Exam Screen — Promotion Exams & Exam Sim (30/60/90 min)
import { useState } from 'react';
import { useApp } from '../AppState';
import { checkPromotionEligibility, generateExamBlueprint, evaluateExamResult } from '../../progression';
import { TIER_CONFIG, SKILL_NODES } from '../../content/skillTree';
import { generateQuestion } from '../../engine';
import { KaTeXRenderer } from '../components/KaTeXRenderer';
import { Award, CheckCircle, XCircle, Clock, ShieldAlert, Play, Download } from 'lucide-react';

export function ExamScreen() {
  const { save, updateSave, setScreen } = useApp();
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [examState, setExamState] = useState<'intro' | 'running' | 'result'>('intro');

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ skillId: string; correct: boolean; responseMs: number }[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [examStartTs, setExamStartTs] = useState(0);
  const [questionStartTs, setQuestionStartTs] = useState(0);

  const selectedTier = save.tiers.current;
  const eligibility = checkPromotionEligibility(
    selectedTier,
    save.skills as any,
    save.tiers.examHistory || [],
    save.stats.totalQuestions
  );

  const startPromotionExam = () => {
    const blueprint = generateExamBlueprint(selectedTier, save.skills as any);
    const questions = blueprint.map((cfg, i) => {
      const q = generateQuestion(cfg.skillId, Math.floor(Math.random() * 100000), i, {
        magnitude: 2, steps: 2, abstraction: 2, timePressure: true, contextDepth: 2,
      });
      return { ...q, targetMs: cfg.targetMs };
    });

    setActiveExam({
      type: 'promotion',
      tier: selectedTier,
      questions,
    });
    setAnswers([]);
    setUserInputs([]);
    setCurrentIdx(0);
    setExamStartTs(performance.now());
    setQuestionStartTs(performance.now());
    setExamState('running');
  };

  const handleAnswerQuestion = (inputVal: string, isCorrect: boolean) => {
    const responseMs = performance.now() - questionStartTs;
    const q = activeExam.questions[currentIdx];

    const newAnswers = [...answers, { skillId: q.skillId, correct: isCorrect, responseMs }];
    setAnswers(newAnswers);
    setUserInputs([...userInputs, inputVal]);

    if (currentIdx + 1 < activeExam.questions.length) {
      setCurrentIdx(c => c + 1);
      setQuestionStartTs(performance.now());
    } else {
      // Evaluate exam result
      const result = evaluateExamResult(newAnswers, 85);
      const now = Date.now();

      updateSave(data => {
        const nextTiers = { ...data.tiers };
        nextTiers.examHistory = [
          ...(nextTiers.examHistory || []),
          { tier: selectedTier, ts: now, passed: result.passed, score: result.score, breakdown: result.domainScores },
        ];
        if (result.passed) {
          nextTiers.current = Math.min(selectedTier + 1, 5);
          if (!nextTiers.unlocked.includes(nextTiers.current)) {
            nextTiers.unlocked.push(nextTiers.current);
          }
        }
        return { ...data, tiers: nextTiers };
      });

      setExamState('result');
    }
  };

  const downloadCertificatePNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0B0E13';
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = '#F5A623';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 560);

    ctx.fillStyle = '#F5A623';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SERTIFIKAT PROMOSI TIER', 400, 100);

    ctx.fillStyle = '#E8ECF3';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(save.profile.name || 'Forge-er', 400, 220);

    ctx.fillStyle = '#93A0B4';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Telah berhasil lulus Ujian Promosi Tier ${selectedTier}`, 400, 280);

    ctx.fillStyle = '#3DDC84';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(`SKOR: ${answers.length > 0 ? Math.round((answers.filter(a => a.correct).length / answers.length) * 100) : 100}%`, 400, 380);

    ctx.fillStyle = '#93A0B4';
    ctx.font = '16px monospace';
    ctx.fillText(`Diterbitkan pada: ${new Date().toLocaleDateString('id-ID')} · Vista Forgy VF-1.0`, 400, 480);

    const link = document.createElement('a');
    link.download = `sertifikat-vista-forgy-tier${selectedTier}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (examState === 'running' && activeExam) {
    const q = activeExam.questions[currentIdx];
    const nodeName = SKILL_NODES.find(n => n.id === q.skillId)?.name || q.skillId;

    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <span className="font-display font-bold text-accent">UJIAN PROMOSI TIER {selectedTier}</span>
          <span className="font-mono text-xs text-muted">Soal {currentIdx + 1} / {activeExam.questions.length}</span>
        </div>

        <div className="panel p-5 mb-4">
          <span className="text-xs font-mono text-muted mb-2 block">{nodeName}</span>
          <p className="text-base font-bold text-text mb-3">{q.prompt.text}</p>
          {q.prompt.latex && (
            <div className="p-3 bg-white/5 rounded-lg mb-4 overflow-x-auto">
              <KaTeXRenderer latex={q.prompt.latex} displayMode />
            </div>
          )}

          {q.format === 'mc' && q.choices && (
            <div className="flex flex-col gap-2">
              {q.choices.map((c: any, idx: number) => (
                <button
                  key={idx}
                  className="btn-choice text-left"
                  onClick={() => handleAnswerQuestion(c.text, c.isCorrect)}
                >
                  <span className="font-mono text-xs text-muted mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {c.latex ? <KaTeXRenderer latex={c.latex} /> : c.text}
                </button>
              ))}
            </div>
          )}

          {q.format !== 'mc' && (
            <div className="flex gap-2">
              <input
                type="text"
                id="examInput"
                className="flex-1 bg-white/5 border border-border rounded-lg p-3 text-lg font-mono text-text"
                placeholder="Jawaban kamu..."
              />
              <button
                className="btn-primary"
                onClick={() => {
                  const el = document.getElementById('examInput') as HTMLInputElement;
                  const val = el?.value?.replace(',', '.') || '';
                  const num = parseFloat(val);
                  const isCorrect = Math.abs(num - (q.answer as any).value) <= (q.answer as any).tolerance;
                  handleAnswerQuestion(val, isCorrect);
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (examState === 'result') {
    const score = Math.round((answers.filter(a => a.correct).length / Math.max(answers.length, 1)) * 100);
    const passed = score >= 85;

    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px', textAlign: 'center' }}>
        <div className="my-6">
          {passed ? <CheckCircle size={64} color="var(--success)" className="mx-auto mb-2" /> : <XCircle size={64} color="var(--danger)" className="mx-auto mb-2" />}
          <h2 className="font-display text-3xl font-bold text-text">{passed ? 'LULUS UJIAN PROMOSI!' : 'BELUM LULUS'}</h2>
          <p className="text-sm text-muted mt-1">{passed ? `Selamat! Kamu berhasil naik ke Tier ${selectedTier + 1}` : 'Cooldown 48 jam diaktifkan. Review kelemahan kamu.'}</p>
        </div>

        <div className="panel p-6 mb-6">
          <p className="font-display font-bold font-mono text-5xl text-accent mb-2">{score}%</p>
          <p className="text-xs text-muted">Syarat Lulus: 85%</p>
        </div>

        {passed && (
          <button className="btn-primary w-full mb-4" onClick={downloadCertificatePNG}>
            <Download size={16} /> Unduh Sertifikat (PNG)
          </button>
        )}

        <button className="btn-secondary w-full" onClick={() => { setExamState('intro'); setScreen('home'); }}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 className="font-display text-2xl font-bold mb-6 text-text">Ujian Promosi Tier</h1>

      {/* Tier Gate Checklist */}
      <div className="panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Award size={20} color="var(--accent)" />
          <h3 className="font-display font-bold text-text text-lg">Gerbang Tier {selectedTier}: {TIER_CONFIG[selectedTier]?.name}</h3>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <CheckItem title="Mastery Gate (>= 90% node dikuasai)" pass={eligibility.masteryGatePassed} />
          <CheckItem title="Sehat (tidak ada node memudar/belajar)" pass={eligibility.isHealthy} />
          <CheckItem title="Volume Latihan (>= 400 soal)" pass={eligibility.volumePassed} />
          <CheckItem title="Tidak dalam Cooldown (48 jam)" pass={!eligibility.cooldownActive} />
        </div>

        {eligibility.canRegister ? (
          <button className="btn-primary w-full text-base" onClick={startPromotionExam}>
            <Play size={16} /> MULAI UJIAN PROMOSI
          </button>
        ) : (
          <div className="panel p-3 border-amber-500/30 bg-amber-500/10 text-xs text-amber-400">
            <p className="font-bold mb-1 flex items-center gap-1"><ShieldAlert size={14} /> Belum Memenuhi Syarat:</p>
            <ul className="list-disc pl-4 space-y-1">
              {eligibility.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckItem({ title, pass }: { title: string; pass: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text">{title}</span>
      {pass ? <CheckCircle size={18} color="var(--success)" /> : <XCircle size={18} color="var(--danger)" />}
    </div>
  );
}
