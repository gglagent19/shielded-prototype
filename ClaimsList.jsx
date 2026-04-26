// ClaimsList.jsx — all claims overview with status and gap tracking

const CLAIMS_DATA = [
  {
    id: 'CLM-2041', type: 'Fire & Smoke Damage', peril: 'fire',
    date: 'Mar 11, 2026', daysOpen: 43, status: 'Negotiating',
    policy: 'CPP-48291-B', insurer: 'GreatWest Mutual',
    offer: 28400, fairMid: 47800, gap: 19400,
    progress: 55, hot: true,
  },
  {
    id: 'CLM-1887', type: 'Water Damage — Burst Pipe', peril: 'water',
    date: 'Oct 3, 2025', daysOpen: 94, status: 'Settled',
    policy: 'CPP-48291-B', insurer: 'GreatWest Mutual',
    offer: 12800, fairMid: 15600, gap: 0, settled: 15200,
    progress: 100,
  },
  {
    id: 'CLM-1644', type: 'Theft — Walk-in Equipment', peril: 'theft',
    date: 'May 19, 2025', daysOpen: 31, status: 'Closed',
    policy: 'CPP-48291-B', insurer: 'GreatWest Mutual',
    offer: 4400, fairMid: 4400, gap: 0, settled: 4400,
    progress: 100,
  },
];

const PERIL_ICON = { fire: 'Alert', water: 'Info', theft: 'Lock', wind: 'TrendUp', liab: 'Scale' };
const STATUS_KIND = { Negotiating: 'amber', Settled: 'teal', Closed: 'neutral', 'In review': 'navy' };

function GapBar({ offer, fairMid, fairLow, fairHigh, settled }) {
  const min = 0, max = 60000;
  const pct = v => Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));
  const lo = pct(fairLow || fairMid * 0.85);
  const hi = pct(fairHigh || fairMid * 1.15);
  const offerPct = pct(offer);
  const settledPct = settled ? pct(settled) : null;
  return (
    <div style={{ position: 'relative', height: 20, width: 160, flex: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 4, background: 'var(--line)', borderRadius: 99 }}/>
      <div style={{ position: 'absolute', left: lo + '%', width: (hi - lo) + '%', top: 8, height: 4, background: 'var(--teal-soft)', border: '1px solid var(--teal)', borderRadius: 99 }}/>
      <div style={{ position: 'absolute', left: offerPct + '%', top: 2, width: 2, height: 16, background: settled ? 'var(--ink-4)' : 'var(--red)', borderRadius: 1 }}/>
      {settledPct && (
        <div style={{ position: 'absolute', left: settledPct + '%', top: 2, width: 2, height: 16, background: 'var(--teal)', borderRadius: 1 }}/>
      )}
    </div>
  );
}

function ClaimRow({ c, on, onClick }) {
  const I = Icons[PERIL_ICON[c.peril] || 'Claim'];
  const fmt = n => '$' + n.toLocaleString();
  const isActive = c.status === 'Negotiating' || c.status === 'In review';
  return (
    <div onClick={onClick} style={{
      padding: '16px 20px', display: 'grid',
      gridTemplateColumns: '28px 1fr 110px 100px 100px 160px 88px 36px',
      gap: 12, alignItems: 'center',
      borderTop: '1px solid var(--line)',
      background: on ? '#eef2fb' : isActive ? 'linear-gradient(90deg, #fdf7ea 0%, transparent 30%)' : 'transparent',
      cursor: 'pointer', transition: 'background .1s',
    }}>
      {/* Peril icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: isActive ? 'var(--amber-soft)' : 'var(--bg-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I size={14} style={{ color: isActive ? 'var(--amber)' : 'var(--ink-4)' }}/>
      </div>

      {/* Claim info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: on ? 'var(--navy)' : 'var(--ink)' }}>{c.id}</span>
          {c.hot && <span className="dot" style={{ background: 'var(--amber)', flexShrink: 0 }}/>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>{c.type}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{c.date} · {c.daysOpen}d open</div>
      </div>

      {/* Status */}
      <span className={`pill pill-${STATUS_KIND[c.status]}`}>{c.status}</span>

      {/* Offer */}
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>Offer</div>
        <div className="serif num-t" style={{ fontSize: 15, color: c.gap > 0 ? 'var(--red)' : 'var(--ink-2)' }}>{fmt(c.offer)}</div>
      </div>

      {/* Settled or fair mid */}
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.settled ? 'Settled' : 'Fair mid'}</div>
        <div className="serif num-t" style={{ fontSize: 15, color: c.settled ? 'var(--teal)' : 'var(--ink-2)' }}>
          {fmt(c.settled || c.fairMid)}
        </div>
      </div>

      {/* Gap bar */}
      <GapBar offer={c.offer} fairMid={c.fairMid}
        fairLow={c.fairMid * 0.85} fairHigh={c.fairMid * 1.15}
        settled={c.settled} />

      {/* Gap delta */}
      <div style={{ textAlign: 'right' }}>
        {c.gap > 0 ? (
          <span className="pill pill-red" style={{ fontSize: 11 }}>+{fmt(c.gap)}</span>
        ) : c.settled ? (
          <span className="pill pill-teal" style={{ fontSize: 11 }}>+{fmt(c.settled - c.offer)}</span>
        ) : (
          <span className="pill pill-neutral" style={{ fontSize: 11 }}>Fair</span>
        )}
      </div>

      {/* Arrow */}
      <Icons.ChevronR size={14} style={{ color: 'var(--ink-4)', justifySelf: 'end' }}/>
    </div>
  );
}

function ClaimsList() {
  const [filter, setFilter] = React.useState('All');
  const [selected, setSelected] = React.useState(0);
  const FILTERS = ['All', 'Negotiating', 'Settled', 'Closed'];

  const visible = filter === 'All' ? CLAIMS_DATA : CLAIMS_DATA.filter(c => c.status === filter);
  const totalGap = CLAIMS_DATA.filter(c => c.gap > 0).reduce((a, c) => a + c.gap, 0);
  const totalRecovered = CLAIMS_DATA.filter(c => c.settled).reduce((a, c) => a + (c.settled - c.offer), 0);
  const fmt = n => '$' + n.toLocaleString();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '22px 28px 0', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Claim history</div>
            <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Claims</h2>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
              {CLAIMS_DATA.length} total · 1 active · {fmt(totalGap)} recovery gap open
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icons.Filter size={13}/> Filter</button>
            <button className="btn btn-primary"><Icons.Plus size={13}/> New claim</button>
          </div>
        </div>

        {/* Summary stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
          {[
            { l: 'Active claims',      v: '1',          sub: 'In negotiation',      kind: 'amber' },
            { l: 'Open gap',           v: fmt(totalGap), sub: 'vs fair settlement',  kind: 'red'   },
            { l: 'Total recovered',    v: fmt(totalRecovered), sub: 'across settled claims', kind: 'teal' },
            { l: 'Avg. claim duration',v: '56 days',    sub: '2 settled claims',    kind: 'neutral'},
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: '12px 16px' }}>
              <div className="eyebrow">{s.l}</div>
              <div className="serif num-t" style={{ fontSize: 22, marginTop: 4, color: 'var(--ink)' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
          {FILTERS.map(f => {
            const count = f === 'All' ? CLAIMS_DATA.length : CLAIMS_DATA.filter(c => c.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                padding: '8px 14px', fontSize: 12.5, fontFamily: 'var(--f-sans)',
                fontWeight: filter === f ? 600 : 400,
                color: filter === f ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: filter === f ? '2px solid var(--navy)' : '2px solid transparent',
                marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {f}
                <span className="mono" style={{
                  fontSize: 10, padding: '1px 5px', borderRadius: 99,
                  background: filter === f ? 'var(--navy)' : 'var(--bg-subtle)',
                  color: filter === f ? '#fff' : 'var(--ink-4)',
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 28px 28px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Column headers */}
          <div style={{
            padding: '10px 20px', display: 'grid',
            gridTemplateColumns: '28px 1fr 110px 100px 100px 160px 88px 36px',
            gap: 12, background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)',
          }}>
            {['', 'Claim', 'Status', 'Offer', 'Fair / Settled', 'Range', 'Gap', ''].map((h, i) => (
              <span key={i} className="eyebrow" style={{ fontSize: 9.5, textAlign: i >= 3 && i <= 5 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>

          {visible.map((c, i) => (
            <ClaimRow key={c.id} c={c} on={i === selected} onClick={() => setSelected(i)} />
          ))}
        </div>

        {/* Empty CTA if filtered to empty */}
        {visible.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
            No {filter.toLowerCase()} claims.
          </div>
        )}

        {/* Start a claim CTA */}
        <div className="card" style={{ marginTop: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Plus size={16} style={{ color: 'var(--navy)' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Start a new claim</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>We'll build a documentation checklist tailored to your peril and policy.</div>
          </div>
          <button className="btn btn-ghost btn-sm">Start <Icons.Arrow size={11}/></button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClaimsList });
