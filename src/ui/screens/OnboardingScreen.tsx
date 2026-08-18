import { useState } from 'react';
import { KoaAvatar } from '../components/KoaAvatar';
import { useApp } from '../AppState';
import { ArrowRight, Zap, RotateCcw, Shield } from 'lucide-react';

export function OnboardingScreen() {
  const { updateSave, setScreen } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [track, setTrack] = useState<'ti' | 'universal' | 'both'>('ti');
  const [goal, setGoal] = useState(25);

  const finish = () => {
    if (!name.trim()) return;
    updateSave(data => ({
      ...data,
      profile: { name: name.trim(), track, dailyGoalMin: goal },
    }));
    setScreen('home');
  };

  const slides = [
    {
      icon: <Zap size={32} color="#F5A623" />,
      title: 'Gym untuk otakmu',
      body: 'Bukan kursus online. Bukan video. Setiap hari kamu angkat beban logika dan matematika sampai jadi refleks — seperti atlet berlatih gerakan dasar.',
      sub: 'Soal selalu beda. Otak yang terasah, bukan hafalan.',
    },
    {
      icon: <RotateCcw size={32} color="#37C8F0" />,
      title: 'Soalnya tidak pernah berulang',
      body: 'Semua soal digenerate oleh mesin prosedural — tiap kemunculan punya angka, konteks, dan variasi yang berbeda. Tidak ada bank soal. Tidak ada hafalan.',
      sub: 'Yang terlatih adalah cara berpikirmu, bukan ingatanmu.',
    },
    {
      icon: <Shield size={32} color="#3DDC84" />,
      title: 'Progresmu, milikmu',
      body: 'Semua data tersimpan di perangkat kamu sendiri. Bisa dibawa ke perangkat lain dengan file terenkripsi .fgy. Tidak ada akun, tidak ada cloud, tidak ada yang dipantau.',
      sub: 'Privasi penuh. Offline sempurna.',
    },
  ];

  if (step < 3) {
    const s = slides[step];
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh p-6 text-center animate-fadeIn">
        <div className="mb-8">
          <KoaAvatar state={step === 2 ? 'celebrate' : 'happy'} size={120} />
        </div>

        <div className="mb-3 flex items-center justify-center gap-2">
          {s.icon}
        </div>

        <h1 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
          {s.title}
        </h1>

        <p className="text-base mb-3 max-w-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {s.body}
        </p>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          {s.sub}
        </p>

        {/* Step dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <button className="btn-primary" onClick={() => setStep(s => s + 1)} style={{ width: '100%', maxWidth: 320 }}>
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // Step 3: Profile setup
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6 animate-fadeIn">
      <KoaAvatar state="idle" size={80} />
      <h2 className="font-display text-2xl font-bold mt-4 mb-1" style={{ color: 'var(--text)' }}>Mulai dari mana?</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Sebentar saja — kita siapkan semuanya</p>

      <div className="panel p-6 w-full max-w-sm" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--muted)' }}>Nama kamu</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Arif"
            className="font-mono"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              padding: '12px 16px',
              color: 'var(--text)',
              fontSize: 16,
              outline: 'none',
            }}
            maxLength={30}
            autoFocus
          />
        </div>

        {/* Track */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--muted)' }}>Track belajar</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {([
              { value: 'ti', label: 'Teknik Industri', desc: 'Lengkap — kalkulus, OR, statistika, dst.' },
              { value: 'universal', label: 'Universal', desc: 'Bisnis, akuntansi, manajemen, informatika' },
              { value: 'both', label: 'Keduanya', desc: 'Akses semua track' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setTrack(opt.value)}
                style={{
                  background: track === opt.value ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${track === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{opt.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily goal */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--muted)' }}>
            Target harian: <span className="font-mono" style={{ color: 'var(--accent)' }}>{goal} menit</span>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[15, 25, 40].map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                style={{
                  flex: 1,
                  background: goal === g ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${goal === g ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: '10px 4px',
                  cursor: 'pointer',
                  color: goal === g ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.15s ease',
                }}
              >
                {g}'
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={finish}
          disabled={!name.trim()}
          style={{ opacity: name.trim() ? 1 : 0.5 }}
        >
          Mulai Sekarang <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
