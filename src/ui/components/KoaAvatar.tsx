// KOA — maskot SVG animated (fallback 2D, production-safe)
import { useEffect, useState } from 'react';
import type { KoaAnimState } from '../AppState';

interface KoaAvatarProps {
  state?: KoaAnimState;
  size?: number;
  mini?: boolean;
}

export function KoaAvatar({ state = 'idle', size = 120, mini = false }: KoaAvatarProps) {
  const [blink, setBlink] = useState(false);
  const [bobOffset, setBobOffset] = useState(0);

  // Bob animation
  useEffect(() => {
    if (state !== 'idle' && state !== 'focus') return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setBobOffset(Math.sin(frame * 0.08) * 4);
    }, 50);
    return () => clearInterval(id);
  }, [state]);

  // Blink
  useEffect(() => {
    const blink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    };
    const id = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  const rotation = state === 'oops' ? -15 : state === 'celebrate' ? 10 : 0;
  const scale = state === 'happy' ? 1.05 : state === 'celebrate' ? 1.1 : 1;

  // Colors
  const bodyColor = '#1A2035';
  const accentColor = '#F5A623';
  const eyeColor = blink ? bodyColor : (state === 'oops' ? '#FF5C5C' : '#37C8F0');
  const gearColor = state === 'focus' ? accentColor : '#2A3555';

  const actualSize = mini ? Math.min(size, 40) : size;
  const s = actualSize / 120;

  return (
    <svg
      width={actualSize}
      height={actualSize}
      viewBox="0 0 120 120"
      style={{
        transform: `translateY(${bobOffset}px) rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.3s ease',
        cursor: 'default',
        userSelect: 'none',
      }}
      aria-label="KOA maskot"
      role="img"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="28" ry="5" fill="rgba(0,0,0,0.3)" />

      {/* Body */}
      <rect x="30" y="55" width="60" height="50" rx="12" fill={bodyColor} />

      {/* Head */}
      <rect x="28" y="20" width="64" height="50" rx="14" fill={bodyColor} />
      <rect x="30" y="22" width="60" height="46" rx="12" fill="#202840" />

      {/* Gear decoration on head */}
      <g transform={`translate(60, 35) rotate(${state === 'focus' ? bobOffset * 10 : 0})`}>
        <circle r="10" fill={gearColor} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <rect
            key={i}
            x="-3"
            y="-13"
            width="6"
            height="7"
            rx="1.5"
            fill={gearColor}
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Core glow */}
        <circle r="5" fill={accentColor} opacity={state === 'oops' ? 0.3 : 0.9} />
      </g>

      {/* Eyes */}
      <rect x="38" y="48" width={blink ? 14 : 14} height={blink ? 2 : 10} rx="5" fill={eyeColor}
        style={{ transition: 'height 0.1s ease, fill 0.2s ease' }}
      />
      <rect x="68" y="48" width="14" height={blink ? 2 : 10} rx="5" fill={eyeColor}
        style={{ transition: 'height 0.1s ease' }}
      />

      {/* Mouth */}
      {state === 'happy' || state === 'celebrate' ? (
        <path d="M 48 70 Q 60 80 72 70" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : state === 'oops' ? (
        <path d="M 48 74 Q 60 65 72 74" stroke="#FF5C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="50" y="70" width="20" height="3" rx="1.5" fill={accentColor} opacity="0.6" />
      )}

      {/* Body antenna/details */}
      <rect x="43" y="68" width="34" height="20" rx="6" fill="#202840" />
      <circle cx="60" cy="78" r="6" fill={accentColor} opacity={state === 'oops' ? 0.3 : 0.7} />
      <circle cx="60" cy="78" r="3" fill={accentColor} opacity={state === 'oops' ? 0.2 : 1} />

      {/* Arms */}
      <rect x="14" y="60" width="16" height="8" rx="4" fill={bodyColor} />
      <rect x="90" y="60" width="16" height="8" rx="4" fill={bodyColor} />

      {/* Feet */}
      <rect x="36" y="100" width="18" height="10" rx="5" fill={bodyColor} />
      <rect x="66" y="100" width="18" height="10" rx="5" fill={bodyColor} />

      {/* Celebrate particles */}
      {state === 'celebrate' && (
        <g>
          <circle cx="20" cy="30" r="4" fill={accentColor} opacity="0.8" />
          <circle cx="100" cy="25" r="3" fill="#3DDC84" opacity="0.8" />
          <circle cx="15" cy="55" r="2" fill="#37C8F0" opacity="0.7" />
          <circle cx="105" cy="50" r="2.5" fill="#FF7A1A" opacity="0.7" />
        </g>
      )}

      {/* Scale indicator for mini */}
      {mini && <g opacity="0">{s}</g>}
    </svg>
  );
}
