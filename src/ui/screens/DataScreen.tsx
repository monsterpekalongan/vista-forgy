// Data Screen — Export/Import .fgy encrypted files
import { useState } from 'react';
import { useApp } from '../AppState';
import { exportToFgy, importFromFgy, mergeImportData } from '../../crypto';
import { SaveSystem } from '../../storage';
import { Download, Upload, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export function DataScreen() {
  const { save, updateSave } = useApp();

  const [exportPassword, setExportPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');

  const [importFileBuffer, setImportFileBuffer] = useState<ArrayBuffer | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!exportPassword) {
      setErrorMsg('Masukkan password enkripsi untuk mengamankan file .fgy');
      return;
    }
    if (exportPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        version: save.version,
        exportedAt: Date.now(),
        profile: save.profile,
        skills: save.skills,
        tiers: save.tiers,
        streak: save.streak,
        stats: save.stats,
        badges: save.badges,
      };

      const blob = await exportToFgy(payload, exportPassword);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `vista-forgy-${dateStr}.fgy`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccessMsg('File .fgy terenkripsi berhasil diunduh!');
      setExportPassword('');
      setConfirmPassword('');
    } catch {
      setErrorMsg('Gagal membuat file ekspor terenkripsi');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImportFileBuffer(evt.target.result as ArrayBuffer);
        setErrorMsg(null);
        setPreviewData(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDecryptPreview = async () => {
    if (!importFileBuffer || !importPassword) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const decoded = await importFromFgy(importFileBuffer, importPassword);
      setPreviewData(decoded);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendeskripsi file .fgy');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMerge = () => {
    if (!previewData) return;
    updateSave(data => mergeImportData(data, previewData));
    setSuccessMsg('Progres berhasil digabungkan (Merge) dengan file .fgy!');
    setPreviewData(null);
    setImportFileBuffer(null);
    setImportPassword('');
  };

  const handleApplyReplace = () => {
    if (!previewData) return;
    updateSave(() => ({
      ...SaveSystem.load(),
      ...previewData,
    }));
    setSuccessMsg('Progres aplikasi telah digantikan penuh oleh isi file .fgy!');
    setPreviewData(null);
    setImportFileBuffer(null);
    setImportPassword('');
  };

  const handlePlainExport = () => {
    const jsonStr = SaveSystem.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vista-forgy-backup-unencrypted.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 className="font-display text-2xl font-bold mb-6 text-text">Manajemen Data & Backup</h1>

      {errorMsg && (
        <div className="panel p-3 mb-4 border-red-500/50 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="panel p-3 mb-4 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Export Section */}
      <div className="panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Download size={18} color="var(--accent)" />
          <h3 className="font-display font-bold text-text text-base">Ekspor File Terenkripsi (.fgy)</h3>
        </div>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          File `.fgy` diamankan dengan **AES-GCM-256** dan kunci turunan **PBKDF2 (250.000 iterasi)**. Password tidak disimpan — amankan password kamu.
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <input
            type="password"
            placeholder="Password Enkripsi"
            value={exportPassword}
            onChange={e => setExportPassword(e.target.value)}
            className="bg-white/5 border border-border rounded-lg p-2.5 text-sm text-text font-mono"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="bg-white/5 border border-border rounded-lg p-2.5 text-sm text-text font-mono"
          />
        </div>

        <button
          className="btn-primary w-full"
          disabled={loading || !exportPassword || !confirmPassword}
          onClick={handleExport}
        >
          {loading ? 'Memproses Enkripsi...' : 'Unduh File .fgy'}
        </button>
      </div>

      {/* Import Section */}
      <div className="panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Upload size={18} color="var(--data)" />
          <h3 className="font-display font-bold text-text text-base">Impor File Terenkripsi (.fgy)</h3>
        </div>

        {!previewData ? (
          <div>
            <input
              type="file"
              accept=".fgy"
              onChange={handleFileSelect}
              className="text-xs text-muted mb-3 block w-full"
            />
            {importFileBuffer && (
              <div className="flex flex-col gap-3 mt-3">
                <input
                  type="password"
                  placeholder="Masukkan Password File .fgy"
                  value={importPassword}
                  onChange={e => setImportPassword(e.target.value)}
                  className="bg-white/5 border border-border rounded-lg p-2.5 text-sm text-text font-mono"
                />
                <button
                  className="btn-primary"
                  disabled={loading || !importPassword}
                  onClick={handleDecryptPreview}
                >
                  {loading ? 'Mendeskripsi...' : 'Dekripsi & Buka Preview'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 p-4 rounded-xl border border-accent/30">
            <p className="text-xs text-accent font-mono font-bold mb-2">PREVIEW ISI FILE .FGY</p>
            <p className="text-xs text-muted mb-1">Dibuat: {new Date(previewData.exportedAt).toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted mb-1">Profil: {previewData.profile?.name}</p>
            <p className="text-xs text-muted mb-3">Total Node Diketahui: {Object.keys(previewData.skills || {}).length}</p>

            <div className="flex gap-2">
              <button className="btn-primary flex-1 text-xs" onClick={handleApplyMerge}>
                Gabungkan (Merge)
              </button>
              <button className="btn-secondary flex-1 text-xs" onClick={handleApplyReplace}>
                Gantikan Total (Replace)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unencrypted JSON Backup */}
      <div className="panel p-4">
        <p className="text-xs text-muted mb-2">Cadangan Plain JSON (TIDAK Terenkripsi)</p>
        <button className="btn-secondary text-xs w-full" onClick={handlePlainExport}>
          <Shield size={12} /> Unduh Backup JSON Mentah
        </button>
      </div>
    </div>
  );
}
