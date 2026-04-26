// Analytics.jsx — claims analytics & portfolio insights (data-rich view)

const MONTHLY_DATA = [
  { month: 'Oct', claims: 0, recovered: 0,    offered: 0 },
  { month: 'Nov', claims: 0, recovered: 0,    offered: 0 },
  { month: 'Dec', claims: 1, recovered: 0,    offered: 4400,  settled: 4400 },
  { month: 'Jan', claims: 0, recovered: 0,    offered: 0 },
  { month: 'Feb', claims: 0, recovered: 0,    offered: 0 },
  { month: 'Mar', claims: 1, recovered: 0,    offered: 12800, settled: 15200 },
  { month: 'Apr', claims: 1, recovered: 19400,offered: 28400 },
];

const CLAIM_TYPES = [
  { label: 'Fire & smoke',  count: 1, pct: 33, color: 'var(--red)' },
  { label: 'Water damage',  count: 1, pct: 33, color: 'var(--navy)' },
  { label: 'Theft',         count: 1, pct: 33, color: 'var(--amber)' },
];

// SVG bar chart
function BarChart({ data, height = 140 }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.offered || 0, d.settled || 0, d.recovered || 0)));
  const w = 52, gap = 8, padL = 40;

  return (
    <svg width="100%" height={height + 40} viewBox={`0 0 ${(w + gap) * data.length + padL} ${height + 40}`} style={{ overflow: 'visible' }}>
      {/* Y axis gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
        const y = height - tick * height;
        const val = Math.round(tick * maxVal / 1000);
        return (
          <g key={i}>
            <line x1={padL} x2={(w + gap) * data.length + padL} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray={tick > 0 ? "3,3" : "0"}/>
            {tick > 0 && <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--ink-4)" fontFamily="monospace">${val}k</text>}
          </g>
        );
      })}

      {data.map((d, i) => {
        const x = padL + i * (w + gap);
        const oh = maxVal > 0 ? (d.offered || 0) / maxVal * height : 0;
        const sh = maxVal > 0 ? (d.settled || 0) / maxVal * height : 0;
        const rh = maxVal > 0 ? (d.recovered || 0) / maxVal * height : 0;

        return (
          <g key={d.month}>
            {/* Offer bar */}
            {oh > 0 && <rect x={x} y={height - oh} width={w * 0.35} height={oh} fill="var(--red)" opacity="0.3" rx="2"/>}
            {/* Settled bar */}
            {sh > 0 && <rect x={x + w * 0.38} y={height - sh} width={w * 0.35} height={sh} fill="var(--teal)" opacity="0.7" rx="2"/>}
            {/* Recovery gap indicator */}
            {rh > 0 && (
              <>
                <rect x={x} y={height - oh} width={w * 0.35} height={oh} fill="var(--red)" opacity="0.15" rx="2"/>
                <rect x={x} y={height - oh - rh} width={w * 0.35} height={rh} fill="var(--teal)" opacity="0.5" rx="2"/>
              </>
            )}
            {/* Month label */}
            <text x={x + w / 2} y={height + 16} textAnchor="middle" fontSize="10" fill="var(--ink-4)" fontFamily="monospace">{d.month}</text>
            {/* Claim dot */}
            {d.claims > 0 && <circle cx={x + w / 2} cy={height + 28} r="3" fill={d.recovered > 0 ? 'var(--amber)' : d.settled ? 'var(--teal)' : 'var(--ink-4)'}/>}
          </g>
        );
      })}
    </svg>
  );
}

// Donut chart
function DonutChart({ segments, size = 100 }) {
  const r = 36, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="12"/>
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="12"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"/>
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// Mini sparkline
function Sparkline({ values, color = 'var(--teal)', width = 80, height = 28 }) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * width},${height - (v / max) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(values.length - 1) / (values.length - 1) * width} cy={height - (values[values.length - 1] / max) * height} r="2.5" fill={color}/>
    </svg>
  );
}

function Analytics() {
  const [period, setPeriod] = React.useState('12mo');
  const fmt = n => '$' + n.toLocaleString();

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow">Portfolio</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Analytics</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Lumen & Loaf · All claims and policies</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['3mo','6mo','12mo','All'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className="btn btn-ghost btn-sm" style={{
              borderColor: period === p ? 'var(--navy)' : 'var(--line)',
              background: period === p ? '#eef2fb' : 'transparent',
              color: period === p ? 'var(--navy)' : 'var(--ink-3)',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { l: 'Total claims',      v: '3',       spark: [0,0,1,0,0,1,1],  color: 'var(--navy)',   sub: '+1 this quarter' },
          { l: 'Total recovered',   v: '$17.8k',  spark: [0,0,4.4,0,0,2.4,17.8], color: 'var(--teal)', sub: 'Across 2 settled' },
          { l: 'Avg. gap found',    v: '$13.9k',  spark: [4.4,0,2.4,0,0,0,19.4], color: 'var(--amber)', sub: 'Per claim filed' },
          { l: 'Coverage score',    v: '72',      spark: [65,68,70,70,72,72,72], color: 'var(--ink)',   sub: '+7 since upload' },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: '14px 16px' }}>
            <div className="eyebrow">{s.l}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 6 }}>
              <div className="serif num-t" style={{ fontSize: 28, lineHeight: 1, color: 'var(--ink)' }}>{s.v}</div>
              <div style={{ marginBottom: 2 }}><Sparkline values={s.spark} color={s.color}/></div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 16 }}>
        {/* Monthly recovery chart */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Recovery vs. insurer offer</div>
              <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>Monthly · last 7 months</div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-4)' }}>
              <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div style={{ width: 10, height: 4, background: 'var(--red)', opacity: 0.4, borderRadius: 1 }}/>Offer</span>
              <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div style={{ width: 10, height: 4, background: 'var(--teal)', opacity: 0.7, borderRadius: 1 }}/>Settled</span>
              <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><circle/><span>● Open</span></span>
            </div>
          </div>
          <BarChart data={MONTHLY_DATA} height={130}/>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            {[
              { l: 'CLM-1644 · Theft', v: '$0 gap', note: 'Settled at offer', kind: 'neutral' },
              { l: 'CLM-1887 · Water', v: '+$2.4k', note: 'Above offer', kind: 'teal' },
              { l: 'CLM-2041 · Fire',  v: '+$19.4k', note: 'Negotiating', kind: 'amber' },
            ].map(c => (
              <div key={c.l} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 4 }}>{c.l}</div>
                <div className="serif num-t" style={{ fontSize: 18, color: `var(--${c.kind === 'neutral' ? 'ink-3' : c.kind})` }}>{c.v}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{c.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Claim type donut */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Claims by peril type</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <DonutChart segments={CLAIM_TYPES} size={96}/>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CLAIM_TYPES.map(t => (
                  <div key={t.label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 99, background: t.color, flex: 'none' }}/>
                    <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>{t.label}</div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coverage score timeline */}
          <div className="card" style={{ padding: 20, flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>Policy coverage score</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 14 }}>Since upload · CPP-48291-B</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <Sparkline values={[65,68,70,70,72,72,72]} color="var(--amber)" width={200} height={48}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-4)' }}>
              <span>65 · upload</span>
              <span className="serif num-t" style={{ fontSize: 18, color: 'var(--amber)' }}>72</span>
              <span>today</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
              Score improved +7 after Shielded flagged 3 issues now tracked for next renewal.
            </div>
          </div>
        </div>
      </div>

      {/* Outcome table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Claim outcomes</div>
          <button className="btn btn-ghost btn-sm"><Icons.Download size={12}/> Export CSV</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}>
              {['Claim', 'Type', 'Opened', 'Duration', 'Offer', 'Settled / Fair', 'Gap', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 14px', fontSize: 10, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-4)', fontWeight: 500, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id:'CLM-2041', type:'Fire & Smoke',  date:'Mar 11', dur:'43d open', offer:28400, fair: 47800,  gap:19400, status:'Negotiating', statusKind:'amber' },
              { id:'CLM-1887', type:'Water Damage',  date:'Oct 3',  dur:'94 days',  offer:12800, settled:15200,gap:2400,  status:'Settled',     statusKind:'teal' },
              { id:'CLM-1644', type:'Theft',         date:'May 19', dur:'31 days',  offer:4400,  settled:4400, gap:0,     status:'Closed',      statusKind:'neutral' },
            ].map((c,i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding:'11px 14px' }}><span className="mono" style={{ fontSize:12, fontWeight:600, color:'var(--navy)' }}>{c.id}</span></td>
                <td style={{ padding:'11px 14px', fontSize:13 }}>{c.type}</td>
                <td style={{ padding:'11px 14px', fontSize:12, color:'var(--ink-3)' }} className="mono">{c.date}</td>
                <td style={{ padding:'11px 14px', fontSize:12, color:'var(--ink-3)' }} className="mono">{c.dur}</td>
                <td style={{ padding:'11px 14px', fontSize:13, color:'var(--red)' }} className="serif num-t">${(c.offer/1000).toFixed(1)}k</td>
                <td style={{ padding:'11px 14px', fontSize:13, color:'var(--teal)' }} className="serif num-t">${((c.settled||c.fair)/1000).toFixed(1)}k{!c.settled?' est.':''}</td>
                <td style={{ padding:'11px 14px' }}>
                  {c.gap > 0
                    ? <span className={`pill pill-${c.status==='Settled'?'teal':'red'}`} style={{fontSize:10.5}}>{c.status==='Settled'?'+':'~+'}${(c.gap/1000).toFixed(1)}k</span>
                    : <span className="pill pill-neutral" style={{fontSize:10.5}}>Fair</span>}
                </td>
                <td style={{ padding:'11px 14px' }}>
                  <span className={`pill pill-${c.statusKind}`} style={{fontSize:10.5}}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { Analytics });
