// Logo.jsx — Shielded wordmark + mark
function ShieldedMark({ size = 22, color }) {
  return (
    <svg width={size} height={size * 26 / 22} viewBox="0 0 22 26" fill="none" style={{ flex: 'none' }}>
      <path d="M11 1.5 L20.5 4.5 V13 C20.5 18.5 16.5 22.8 11 24.5 C5.5 22.8 1.5 18.5 1.5 13 V4.5 L11 1.5 Z"
        stroke={color || 'currentColor'} strokeWidth="1.3" fill="none" />
      <path d="M11 7.5 L16 9 V13.2 C16 15.8 13.8 18 11 19 C8.2 18 6 15.8 6 13.2 V9 L11 7.5 Z"
        fill={color || 'currentColor'} opacity="0.9" />
      <path d="M8.5 13 L10.5 15 L14 11" stroke="#f6f3ee" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ShieldedLogo({ color, size = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: color || 'var(--ink)' }}>
      <ShieldedMark size={size} color={color} />
      <span className="serif" style={{ fontSize: size * 1.15, letterSpacing: '-0.02em', lineHeight: 1 }}>
        Shielded
      </span>
    </div>
  );
}

Object.assign(window, { ShieldedMark, ShieldedLogo });
