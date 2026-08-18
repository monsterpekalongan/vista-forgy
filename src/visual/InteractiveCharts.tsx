// 8 Interactive Industrial Engineering SVG Charts with Fallback Table
import { useState, useEffect } from 'react';

// ── 1. M/M/1 Queue Animation ────────────────────────────────────────────────
export function MM1QueueChart({ data }: { data: any }) {
  const [frame, setFrame] = useState(0);
  const [tableMode, setTableMode] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  if (tableMode) {
    return (
      <div className="table-fallback">
        <button className="btn-secondary mb-2" onClick={() => setTableMode(false)}>Tampilkan Visual SVG</button>
        <table className="w-full text-xs font-mono">
          <tbody>
            <tr><td>Laju Kedatangan (λ)</td><td>{data.lambda} /menit</td></tr>
            <tr><td>Laju Layanan (μ)</td><td>{data.mu} /menit</td></tr>
            <tr><td>Utilisasi (ρ)</td><td>{data.rho}</td></tr>
            <tr><td>Pelanggan Sistem (Ls)</td><td>{data.Ls}</td></tr>
            <tr><td>Pelanggan Antrian (Lq)</td><td>{data.Lq}</td></tr>
            <tr><td>Waktu Sistem (Ws)</td><td>{data.Ws} menit</td></tr>
            <tr><td>Waktu Antrian (Wq)</td><td>{data.Wq} menit</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  const queueLength = Math.min(Math.round(data.Lq || 2), 6);

  return (
    <div className="panel p-4 text-center">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted font-medium">SIMULASI ANTREAN M/M/1</span>
        <button className="text-xs text-accent underline" onClick={() => setTableMode(true)}>Tabel Mode</button>
      </div>

      <svg width="100%" height="120" viewBox="0 0 300 120">
        {/* Server Box */}
        <rect x="220" y="35" width="50" height="50" rx="8" fill="#1A2035" stroke="#F5A623" strokeWidth="2" />
        <text x="245" y="65" textAnchor="middle" fill="#F5A623" fontSize="10" fontWeight="bold">SERVER</text>
        <text x="245" y="77" textAnchor="middle" fill="#93A0B4" fontSize="8">μ = {data.mu}</text>

        {/* Customer in service */}
        <circle cx={245 + Math.sin(frame * 0.1) * 2} cy="20" r="10" fill="#37C8F0" />

        {/* Queue Line */}
        <line x1="40" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

        {/* Arriving Customer */}
        <circle cx={40 + (frame * 1.5) % 150} cy="60" r="8" fill="#3DDC84" opacity="0.8" />

        {/* Queue Customers */}
        {Array.from({ length: queueLength }).map((_, i) => (
          <circle key={i} cx={190 - i * 22} cy="60" r="8" fill="#F5A623" />
        ))}
      </svg>
      <p className="text-xs text-muted mt-2 font-mono">ρ = {data.rho} · Ls = {data.Ls} pelanggan dalam sistem</p>
    </div>
  );
}

// ── 2. EOQ Chart with Interactive Q Slider ──────────────────────────────────
export function EOQChart({ data }: { data: any }) {
  const [userQ, setUserQ] = useState(data.Q_star || 100);
  const [tableMode, setTableMode] = useState(false);

  const D = data.D || 1000;
  const S = data.S || 100000;
  const H = data.H || 5000;

  const orderingCost = (D / Math.max(userQ, 1)) * S;
  const holdingCost = (userQ / 2) * H;
  const totalCost = orderingCost + holdingCost;

  if (tableMode) {
    return (
      <div className="table-fallback">
        <button className="btn-secondary mb-2" onClick={() => setTableMode(false)}>Tampilkan Visual SVG</button>
        <table className="w-full text-xs font-mono">
          <tbody>
            <tr><td>Kuantitas (Q)</td><td>{userQ} unit</td></tr>
            <tr><td>Biaya Pesan (D/Q)*S</td><td>Rp{Math.round(orderingCost).toLocaleString('id-ID')}</td></tr>
            <tr><td>Biaya Simpan (Q/2)*H</td><td>Rp{Math.round(holdingCost).toLocaleString('id-ID')}</td></tr>
            <tr><td>Biaya Total (TC)</td><td>Rp{Math.round(totalCost).toLocaleString('id-ID')}</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="panel p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted font-medium">KURVA BIAYA EOQ INTERAKTIF</span>
        <button className="text-xs text-accent underline" onClick={() => setTableMode(true)}>Tabel Mode</button>
      </div>

      <svg width="100%" height="130" viewBox="0 0 300 130">
        {/* Axes */}
        <line x1="30" y1="10" x2="30" y2="110" stroke="rgba(255,255,255,0.2)" />
        <line x1="30" y1="110" x2="280" y2="110" stroke="rgba(255,255,255,0.2)" />

        {/* EOQ minimum point */}
        <circle cx="150" cy="55" r="5" fill="#3DDC84" />
        <text x="150" y="45" textAnchor="middle" fill="#3DDC84" fontSize="9" fontWeight="bold">Q* = {data.Q_star}</text>

        {/* Current User Q indicator */}
        const curX = Math.min(270, Math.max(40, (userQ / (data.Q_star * 2)) * 240));
        <line x1={Math.min(270, Math.max(40, (userQ / (data.Q_star * 2 || 200)) * 240))} y1="10" x2={Math.min(270, Math.max(40, (userQ / (data.Q_star * 2 || 200)) * 240))} y2="110" stroke="#F5A623" strokeDasharray="3 3" />
      </svg>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-mono text-muted">Q = {userQ}</span>
        <input
          type="range"
          min={Math.max(10, Math.round(data.Q_star * 0.2))}
          max={Math.round(data.Q_star * 2.5)}
          value={userQ}
          onChange={e => setUserQ(parseInt(e.target.value))}
          className="flex-1 accent-amber-500"
        />
      </div>
      <p className="text-xs text-center font-mono mt-1 text-accent">
        TC = Rp{Math.round(totalCost).toLocaleString('id-ID')}
      </p>
    </div>
  );
}

// ── 3. LP Grafis Chart ──────────────────────────────────────────────────────
export function LPGrafisChart({ data }: { data: any }) {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const xOpt = data.x_opt || 4;
  const yOpt = data.y_opt || 3;

  return (
    <div className="panel p-4 text-center">
      <p className="text-xs text-muted mb-2 font-medium">DAERAH LAYAK & TITIK SUDUT LP</p>
      <svg width="100%" height="140" viewBox="0 0 200 140">
        <rect x="20" y="20" width="160" height="100" fill="rgba(55,200,240,0.1)" stroke="#37C8F0" strokeDasharray="4 4" />
        <circle cx="20" cy="120" r="6" fill="#F5A623" onClick={() => setSelectedPoint('(0,0)')} className="cursor-pointer" />
        <circle cx="180" cy="120" r="6" fill="#F5A623" onClick={() => setSelectedPoint('(x_max,0)')} className="cursor-pointer" />
        <circle cx="20" cy="20" r="6" fill="#F5A623" onClick={() => setSelectedPoint('(0,y_max)')} className="cursor-pointer" />
        <circle cx="120" cy="50" r="8" fill="#3DDC84" onClick={() => setSelectedPoint(`Optimal (${xOpt}, ${yOpt})`)} className="cursor-pointer" />
        <text x="120" y="40" textAnchor="middle" fill="#3DDC84" fontSize="10" fontWeight="bold">Z* ({xOpt},{yOpt})</text>
      </svg>
      {selectedPoint && <p className="text-xs font-mono text-accent mt-1">Titik diklik: {selectedPoint}</p>}
    </div>
  );
}

// ── 4. Control Chart (X-bar) ────────────────────────────────────────────────
export function ControlChart() {
  const points = [10.2, 10.5, 9.8, 10.1, 11.2, 9.9, 10.3, 10.0];
  const UCL = 11.0;
  const LCL = 9.0;
  const CL = 10.0;

  return (
    <div className="panel p-4">
      <p className="text-xs text-muted mb-2 font-medium">CONTROL CHART (X-BAR)</p>
      <svg width="100%" height="120" viewBox="0 0 260 120">
        <line x1="20" y1="20" x2="240" y2="20" stroke="#FF5C5C" strokeDasharray="4 4" />
        <text x="245" y="23" fill="#FF5C5C" fontSize="8">UCL</text>
        <line x1="20" y1="60" x2="240" y2="60" stroke="#37C8F0" />
        <text x="245" y="63" fill="#37C8F0" fontSize="8">CL</text>
        <line x1="20" y1="100" x2="240" y2="100" stroke="#FF5C5C" strokeDasharray="4 4" />
        <text x="245" y="103" fill="#FF5C5C" fontSize="8">LCL</text>

        {points.map((p, i) => {
          const x = 30 + i * 28;
          const y = 60 - (p - CL) * 35;
          const out = p > UCL || p < LCL;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={out ? '#FF5C5C' : '#3DDC84'} />
              {i > 0 && (
                <line
                  x1={30 + (i - 1) * 28}
                  y1={60 - (points[i - 1] - CL) * 35}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.3)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── 5. PERT Network Chart ───────────────────────────────────────────────────
export function PERTChart() {
  return (
    <div className="panel p-4 text-center">
      <p className="text-xs text-muted mb-2 font-medium">GRAFIK PERT / CPM JALUR KRITIS</p>
      <svg width="100%" height="100" viewBox="0 0 260 100">
        <circle cx="30" cy="50" r="14" fill="#1A2035" stroke="#F5A623" strokeWidth="2" />
        <text x="30" y="54" textAnchor="middle" fill="#F5A623" fontSize="10">A</text>

        <circle cx="100" cy="25" r="14" fill="#1A2035" stroke="#FF7A1A" strokeWidth="2" />
        <text x="100" y="29" textAnchor="middle" fill="#FF7A1A" fontSize="10">B</text>

        <circle cx="100" cy="75" r="14" fill="#1A2035" stroke="#37C8F0" strokeWidth="2" />
        <text x="100" y="79" textAnchor="middle" fill="#37C8F0" fontSize="10">C</text>

        <circle cx="180" cy="50" r="14" fill="#1A2035" stroke="#FF7A1A" strokeWidth="2" />
        <text x="180" y="54" textAnchor="middle" fill="#FF7A1A" fontSize="10">D</text>

        <line x1="44" y1="42" x2="86" y2="30" stroke="#FF7A1A" strokeWidth="2" />
        <line x1="44" y1="58" x2="86" y2="70" stroke="rgba(255,255,255,0.2)" />
        <line x1="114" y1="30" x2="166" y2="42" stroke="#FF7A1A" strokeWidth="2" />
        <line x1="114" y1="70" x2="166" y2="58" stroke="rgba(255,255,255,0.2)" />
      </svg>
      <p className="text-xs text-orange-400 font-mono">Jalur Kritis: A → B → D</p>
    </div>
  );
}

// ── 6. Derivative Tangent Chart ─────────────────────────────────────────────
export function DerivativeChart() {
  const [xVal, setXVal] = useState(1);
  const yVal = xVal * xVal;
  const slope = 2 * xVal;

  return (
    <div className="panel p-4">
      <p className="text-xs text-muted mb-2 font-medium">GARIS SINGGUNG TURUNAN f(x) = x²</p>
      <svg width="100%" height="120" viewBox="0 0 200 120">
        <path d="M 20 110 Q 100 110 180 10" fill="none" stroke="#37C8F0" strokeWidth="2" />
        <circle cx={40 + xVal * 30} cy={110 - yVal * 8} r="5" fill="#F5A623" />
      </svg>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-mono text-muted">x = {xVal}</span>
        <input type="range" min="-2" max="3" step="0.5" value={xVal} onChange={e => setXVal(parseFloat(e.target.value))} className="flex-1" />
        <span className="text-xs font-mono text-accent">f'(x) = {slope}</span>
      </div>
    </div>
  );
}

// ── 7. Riemann Sum Chart ────────────────────────────────────────────────────
export function RiemannChart() {
  const [n, setN] = useState(4);
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted mb-2 font-medium">PENJUMLAHAN RIEMANN (n = {n})</p>
      <svg width="100%" height="100" viewBox="0 0 200 100">
        {Array.from({ length: n }).map((_, i) => {
          const rw = 160 / n;
          const rx = 20 + i * rw;
          const rh = (i + 1) * (60 / n);
          return (
            <rect key={i} x={rx} y={90 - rh} width={rw - 1} height={rh} fill="rgba(245,166,35,0.3)" stroke="#F5A623" />
          );
        })}
      </svg>
      <input type="range" min="2" max="20" value={n} onChange={e => setN(parseInt(e.target.value))} className="w-full mt-2" />
    </div>
  );
}

// ── 8. Regression Chart ─────────────────────────────────────────────────────
export function RegressionChart() {
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted mb-2 font-medium">REGRESI LINEAR PASANGA DATA</p>
      <svg width="100%" height="100" viewBox="0 0 200 100">
        <line x1="20" y1="80" x2="180" y2="20" stroke="#3DDC84" strokeWidth="2" />
        <circle cx="30" cy="75" r="4" fill="#37C8F0" />
        <circle cx="60" cy="65" r="4" fill="#37C8F0" />
        <circle cx="90" cy="50" r="4" fill="#37C8F0" />
        <circle cx="120" cy="45" r="4" fill="#37C8F0" />
        <circle cx="150" cy="30" r="4" fill="#37C8F0" />
      </svg>
    </div>
  );
}

export function VisualRenderer({ spec }: { data?: any; spec?: any }) {
  if (!spec) return null;
  switch (spec.type) {
    case 'mm1-queue': return <MM1QueueChart data={spec.data} />;
    case 'eoq-chart': return <EOQChart data={spec.data} />;
    case 'lp-graph': return <LPGrafisChart data={spec.data} />;
    case 'control-chart': return <ControlChart />;
    case 'pert-graph': return <PERTChart />;
    case 'derivative-tangent': return <DerivativeChart />;
    case 'riemann': return <RiemannChart />;
    case 'regression': return <RegressionChart />;
    default: return null;
  }
}
