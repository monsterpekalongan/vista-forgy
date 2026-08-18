// Settings Screen
import { useState } from 'react';
import { useApp } from '../AppState';
import { Volume2, VolumeX, Shield, Moon, Sun, AlertTriangle, RotateCcw } from 'lucide-react';
import { audioSynth } from '../../audio';

export function SettingsScreen() {
  const { save, updateSave, setScreen } = useApp();

  const [confirmReset, setConfirmReset] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleSound = () => {
    const next = !save.settings.sound;
    updateSave(data => ({
      ...data,
      settings: { ...data.settings, sound: next },
    }));
    audioSynth.setMuted(!next);
  };

  const setVolume = (v: number) => {
    updateSave(data => ({
      ...data,
      settings: { ...data.settings, volume: v },
    }));
    audioSynth.setVolume(v);
  };

  const toggleSerious = () => {
    updateSave(data => ({
      ...data,
      settings: { ...data.settings, serious: !data.settings.serious },
    }));
  };

  const setTheme = (theme: 'dark' | 'light' | 'auto') => {
    updateSave(data => ({
      ...data,
      settings: { ...data.settings, theme },
    }));
  };

  const setMotion = (motion: 'auto' | 'full' | 'reduced') => {
    updateSave(data => ({
      ...data,
      settings: { ...data.settings, motion },
    }));
  };

  const handleReset = () => {
    if (confirmReset !== 'RESET') return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Pengaturan</h1>

      {/* Audio */}
      <div className="panel p-4 mb-4">
        <p className="text-xs font-medium mb-3 text-muted uppercase tracking-wider">Suara & Audio</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-text">Efek Suara Synth</span>
          <button className="btn-secondary text-xs" onClick={toggleSound}>
            {save.settings.sound ? <Volume2 size={16} color="var(--accent)" /> : <VolumeX size={16} color="var(--muted)" />}
            {save.settings.sound ? 'Aktif' : 'Mute'}
          </button>
        </div>
        {save.settings.sound && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={save.settings.volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
        )}
      </div>

      {/* Persona & Humor */}
      <div className="panel p-4 mb-4">
        <p className="text-xs font-medium mb-3 text-muted uppercase tracking-wider">Persona Maskot KOA</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text font-medium">Serius Mode</p>
            <p className="text-xs text-muted">Mematikan semua baris humor KOA</p>
          </div>
          <button
            className={`btn-secondary text-xs ${save.settings.serious ? 'bg-amber-500/20 border-amber-500' : ''}`}
            onClick={toggleSerious}
          >
            <Shield size={14} color={save.settings.serious ? 'var(--accent)' : 'var(--muted)'} />
            {save.settings.serious ? 'ON (KOA Diam)' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Tema & Animasi */}
      <div className="panel p-4 mb-4">
        <p className="text-xs font-medium mb-3 text-muted uppercase tracking-wider">Tampilan & Tema</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-text">Tema Warna</span>
          <div className="flex gap-2">
            <button className={`btn-secondary text-xs ${save.settings.theme === 'dark' ? 'border-amber-500' : ''}`} onClick={() => setTheme('dark')}>
              <Moon size={12} /> Dark
            </button>
            <button className={`btn-secondary text-xs ${save.settings.theme === 'light' ? 'border-amber-500' : ''}`} onClick={() => setTheme('light')}>
              <Sun size={12} /> Light
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text">Gerakan / Animasi</span>
          <div className="flex gap-2">
            <button className={`btn-secondary text-xs ${save.settings.motion === 'auto' ? 'border-amber-500' : ''}`} onClick={() => setMotion('auto')}>
              Sistem
            </button>
            <button className={`btn-secondary text-xs ${save.settings.motion === 'reduced' ? 'border-amber-500' : ''}`} onClick={() => setMotion('reduced')}>
              Minimal
            </button>
          </div>
        </div>
      </div>

      {/* Target & Track */}
      <div className="panel p-4 mb-4">
        <p className="text-xs font-medium mb-3 text-muted uppercase tracking-wider">Profil Belajar</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text">Track Utama</span>
          <span className="font-mono text-xs text-accent uppercase">{save.profile.track}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text">Target Harian</span>
          <span className="font-mono text-xs text-accent">{save.profile.dailyGoalMin} menit/hari</span>
        </div>
      </div>

      {/* Reset Area */}
      <div className="panel p-4 border-red-500/30 bg-red-500/5">
        <p className="text-xs font-medium mb-2 text-red-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={14} /> Zona Bahaya
        </p>
        <p className="text-xs text-muted mb-3">Reset akan menghapus seluruh statistik, progres skill, dan streak dari perangkat ini.</p>
        <button className="btn-secondary text-red-400 text-xs w-full" onClick={() => setShowResetModal(true)}>
          <RotateCcw size={12} /> Reset Progres Aplikasi
        </button>
      </div>

      {/* Modal Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="panel-lg p-6 max-w-sm w-full animate-slideUp">
            <h3 className="font-display font-bold text-lg text-text mb-2">Konfirmasi Reset Total</h3>
            <p className="text-xs text-muted mb-4">
              Disarankan melakukan **Ekspor Data (.fgy)** terlebih dahulu di menu Data sebelum mereset.
            </p>
            <button className="btn-secondary w-full text-xs mb-4" onClick={() => setScreen('data')}>
              Pergi ke Ekspor Data Dulu
            </button>

            <label className="text-xs text-muted block mb-2">Ketik "RESET" untuk melanjutkan:</label>
            <input
              type="text"
              value={confirmReset}
              onChange={e => setConfirmReset(e.target.value)}
              className="w-full bg-white/5 border border-border rounded-lg p-2 font-mono text-sm text-text mb-4"
              placeholder="RESET"
            />

            <div className="flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setShowResetModal(false)}>Batal</button>
              <button
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                disabled={confirmReset !== 'RESET'}
                onClick={handleReset}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
