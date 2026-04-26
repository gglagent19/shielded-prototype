// PoliciesList.jsx — policy portfolio overview

const POLICIES_DATA = [
  {
    id: 'CPP-48291-B',
    name: 'Commercial Property',
    insurer: 'GreatWest Mutual',
    type: 'Commercial Property',
    premium: '$4,820 / yr',
    renews: 'Feb 14, 2027',
    daysToRenew: 296,
    coverage: '$710k total insured',
    score: 72,
    scoreLabel: 'Solid core, 2 gaps',
    risks: { high: 1, med: 1, low: 1 },
    claims: 3,
    active: true,
    analyzed: 'Apr 11, 2026',
  },
  {
    id: 'GL-33021-A',
    name: 'General Liability',
    insurer: 'GreatWest Mutual',
    type: 'General Liability',
    premium: '$2,160 / yr',
    renews: 'Mar 1, 2027',
    daysToRenew: 311,
    coverage: '$1M per occurrence',
    score: 88,
    scoreLabel: 'Good coverage',
    risks: { high: 0, med: 1, low: 0 },
    claims: 0,
    active: true,
    analyzed: 'Mar 15, 2026',
  },
];

function ScoreRing({ score }) {
  const r = 20, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? 'var(--teal)' : score >= 60 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ position: 'relative', width: 52, height: 52, flex: 'none' }}>
      <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--line)" strokeWidth="4"/>
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color,
      }}>{score}</div>
    </div>
  );
}

function PolicyCard({ p, selected, onClick }) {
  const riskColor = p.risks.high > 0 ? 'red' : p.risks.med > 0 ? 'amber' : 'teal';
  const totalRisks = p.risks.high + p.risks.med + p.risks.low;
  return (
    <div onClick={onClick} className="card" style={{
      padding: 0, overflow: 'hidden', cursor: 'pointer',
      borderColor: selected ? 'var(--navy)' : 'var(--line)',
      borderWidth: selected ? 1.5 : 1,
      transition: 'border-color .1s',
    }}>
      {/* Card header */}
      <div style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start', borderBottom: '1px solid var(--line)' }}>
        <ScoreRing score={p.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
            {p.active && <span className="pill pill-teal" style={{ fontSize: 10 }}>Active</span>}
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{p.id} · {p.insurer}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{p.coverage}</div>
        </div>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.Dots size={14}/></button>
      </div>

      {/* Stat row */}
      <div style={{ padding: '12px 18px', display: 'flex', gap: 20 }}>
        <div>
          <div className="eyebrow">Premium</div>
          <div className="mono" style={{ fontSize: 12.5, marginTop: 2 }}>{p.premium}</div>
        </div>
        <div>
          <div className="eyebrow">Renews</div>
          <div className="mono" style={{ fontSize: 12.5, marginTop: 2 }}>{p.renews} <span style={{ color: 'var(--ink-4)' }}>({p.daysToRenew}d)</span></div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div className="eyebrow">Risk flags</div>
          <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
            {p.risks.high > 0 && <span className="pill pill-red" style={{ fontSize: 10 }}>{p.risks.high} High</span>}
            {p.risks.med > 0 && <span className="pill pill-amber" style={{ fontSize: 10 }}>{p.risks.med} Med</span>}
            {p.risks.low > 0 && <span className="pill pill-neutral" style={{ fontSize: 10 }}>{p.risks.low} Low</span>}
            {totalRisks === 0 && <span className="pill pill-teal" style={{ fontSize: 10 }}>Clean</span>}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '10px 18px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>Analyzed {p.analyzed}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· {p.claims} claim{p.claims !== 1 ? 's' : ''}</span>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-quiet btn-sm" style={{ fontSize: 11.5 }}><Icons.FileText size={12}/> View analysis</button>
        <button className="btn btn-quiet btn-sm" style={{ fontSize: 11.5 }}><Icons.Sparkle size={12}/> Ask AI</button>
      </div>
    </div>
  );
}

function PoliciesList() {
  const [selected, setSelected] = React.useState(0);

  const totalClaims = POLICIES_DATA.reduce((a, p) => a + p.claims, 0);
  const avgScore = Math.round(POLICIES_DATA.reduce((a, p) => a + p.score, 0) / POLICIES_DATA.length);
  const highRisks = POLICIES_DATA.reduce((a, p) => a + p.risks.high, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '22px 28px 32px', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow">Insurance portfolio</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Policies</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            {POLICIES_DATA.length} active policies · avg. score {avgScore} · {highRisks} high-risk flag{highRisks !== 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icons.Download size={13}/> Export</button>
          <button className="btn btn-primary"><Icons.Upload size={13}/> Add policy</button>
        </div>
      </div>

      {/* Portfolio health strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Policies',          v: POLICIES_DATA.length, sub: 'All active', icon: 'Shield' },
          { l: 'Avg. coverage score',v: avgScore + '/100',   sub: 'Weighted',   icon: 'Target' },
          { l: 'High-risk flags',   v: highRisks,            sub: 'Need review', icon: 'Alert', red: highRisks > 0 },
          { l: 'Total claims',      v: totalClaims,          sub: 'All time',    icon: 'Claim' },
        ].map(s => {
          const I = Icons[s.icon];
          return (
            <div key={s.l} className="card" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flex: 'none',
                background: s.red ? 'var(--red-soft)' : 'var(--bg-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I size={16} style={{ color: s.red ? 'var(--red)' : 'var(--ink-3)' }}/>
              </div>
              <div>
                <div className="eyebrow">{s.l}</div>
                <div className="serif num-t" style={{ fontSize: 22, lineHeight: 1.1, color: s.red ? 'var(--red)' : 'var(--ink)' }}>{s.v}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy cards grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {POLICIES_DATA.map((p, i) => (
          <PolicyCard key={p.id} p={p} selected={i === selected} onClick={() => setSelected(i)} />
        ))}
      </div>

      {/* Add policy CTA */}
      <div style={{
        padding: '20px 24px', border: '1.5px dashed var(--line-2)', borderRadius: 12,
        background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.Upload size={18} style={{ color: 'var(--navy)' }}/>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Add another policy</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Upload a PDF — we'll extract coverage, exclusions, and flag gaps in ~90 seconds.</div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Upload <Icons.Arrow size={11}/></button>
      </div>
    </div>
  );
}

Object.assign(window, { PoliciesList });
