// PolicyRenewal.jsx — policy renewal reminder and coverage review

const RENEWAL_DATE = 'Feb 14, 2027';
const DAYS_TO_RENEWAL = 296;
const MARKET_COMPS = [
  { name: 'Similar NC restaurant A', premium: 4100, coverage: '700k', score: 'B+' },
  { name: 'Similar NC restaurant B', premium: 3850, coverage: '650k', score: 'A-' },
  { name: 'Similar NC restaurant C', premium: 5200, coverage: '750k', score: 'B' },
];

function RenewalTimeline() {
  const actions = [
    { label: 'Start renewal review',    when: 'Now · 296 days out',   done: false, active: true,  note: 'Start here — review gaps before shopping' },
    { label: 'Request competing quotes', when: '180 days out · Aug 18', done: false, active: false, note: 'Start 6 months early to negotiate leverage' },
    { label: 'Compare & decide',         when: '60 days out · Dec 15',  done: false, active: false, note: 'Lock in new policy before the old one lapses' },
    { label: 'Upload renewed policy',    when: '30 days out · Jan 14',  done: false, active: false, note: 'Shielded re-analyzes after renewal' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {actions.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 99, flex: 'none',
              background: a.active ? 'var(--navy)' : a.done ? 'var(--teal)' : 'var(--bg-muted)',
              border: a.active ? '3px solid var(--navy)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: a.active || a.done ? '#fff' : 'var(--ink-4)', fontSize: 11, fontWeight: 600,
              boxShadow: a.active ? '0 0 0 3px color-mix(in oklab, var(--navy) 18%, transparent)' : 'none',
            }}>{a.done ? <Icons.Check size={13} style={{strokeWidth:3}}/> : i+1}</div>
            {i < actions.length-1 && <div style={{ width: 2, height: 40, background: 'var(--line)', marginTop: 2 }}/>}
          </div>
          <div style={{ paddingTop: 4, paddingBottom: i < actions.length-1 ? 28 : 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: a.active ? 600 : 400, color: a.active ? 'var(--ink)' : 'var(--ink-3)' }}>{a.label}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', margin: '2px 0 4px' }}>{a.when}</div>
            {a.note && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PolicyRenewal() {
  const daysUrgency = DAYS_TO_RENEWAL < 60 ? 'red' : DAYS_TO_RENEWAL < 120 ? 'amber' : 'teal';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Renewal planning</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Policy renewal</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            CPP-48291-B · GreatWest Mutual · renews {RENEWAL_DATE}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icons.Download size={13}/> Export summary</button>
          <button className="btn btn-primary"><Icons.Search size={13}/> Get competing quotes</button>
        </div>
      </div>

      {/* Countdown + score strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
        {[
          { l: 'Days to renewal', v: DAYS_TO_RENEWAL, sub: RENEWAL_DATE, color: daysUrgency, serif: true },
          { l: 'Current premium',  v: '$4,820',  sub: '/ year · $401/mo',    color: 'neutral', serif: true },
          { l: 'Market median',    v: '$4,383',  sub: 'NC restaurants · similar sq ft', color: 'neutral', serif: true },
          { l: 'Coverage score',   v: '72/100',  sub: '3 gaps to fix before renewal', color: 'amber', serif: true },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: '14px 16px' }}>
            <div className="eyebrow">{s.l}</div>
            <div className={s.serif ? 'serif num-t' : ''} style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4, color: s.color !== 'neutral' ? `var(--${s.color})` : 'var(--ink)' }}>{s.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Coverage gaps to fix */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Fix these at renewal</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1 }}>3 coverage gaps identified from your current policy analysis</div>
              </div>
            </div>

            {[
              {
                level: 'high', color: 'red',
                title: 'Add flood endorsement',
                detail: 'Your basement prep kitchen is near the Swannanoa floodplain. Flood damage is currently excluded. A commercial flood endorsement costs $320–480/yr.',
                action: 'Request endorsement',
                impact: 'Adds ~$80–150k in coverage',
              },
              {
                level: 'med', color: 'amber',
                title: 'Increase business income limit',
                detail: 'Current 12-month ALE limit ($120k) covers only 68% of projected loss at $1.4M revenue. Request a 24-month limit or a higher dollar cap.',
                action: 'Adjust limit',
                impact: 'Covers full shutdown risk',
              },
              {
                level: 'low', color: 'neutral',
                title: 'Negotiate deductible down',
                detail: 'Your AOP deductible ($5k) is double the NC market median for similar restaurants ($2.5k). Use the claims history as leverage.',
                action: 'Request reduction',
                impact: 'Saves ~$2,500 per claim',
              },
            ].map((g, i) => (
              <div key={i} style={{ padding: '14px 18px', display: 'flex', gap: 12, borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
                <span className={`pill pill-${g.color}`} style={{ flex: 'none', marginTop: 2, fontSize: 10 }}>{g.level === 'high' ? 'High' : g.level === 'med' ? 'Med' : 'Low'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 8 }}>{g.detail}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>{g.action} <Icons.Arrow size={10}/></button>
                    <span style={{ fontSize: 11.5, color: 'var(--teal)' }}>{g.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market comparison */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Market rate comparison</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1 }}>Similar NC restaurants · 2025–2026 renewals</div>
            </div>
            <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 60px', gap: 8 }}>
              {['Business', 'Premium', 'Coverage', 'Grade'].map(h => (
                <span key={h} className="eyebrow" style={{ fontSize: 9.5 }}>{h}</span>
              ))}
            </div>
            {/* Your policy row */}
            <div style={{ padding: '10px 18px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 60px', gap: 8, alignItems: 'center', background: '#eef2fb', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)' }}>Lumen & Loaf (yours)</div>
              <span className="mono" style={{ fontSize: 12, color: 'var(--amber)' }}>$4,820</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>$710k</span>
              <span className="pill pill-amber" style={{ fontSize: 10 }}>72</span>
            </div>
            {MARKET_COMPS.map((c, i) => (
              <div key={i} style={{ padding: '10px 18px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 60px', gap: 8, alignItems: 'center', borderTop: '1px solid var(--line)' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 12, color: c.premium < 4820 ? 'var(--teal)' : 'var(--ink-3)' }}>${c.premium.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.coverage}</span>
                <span className="pill pill-neutral" style={{ fontSize: 10 }}>{c.score}</span>
              </div>
            ))}
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--line)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>You're paying <strong style={{ color: 'var(--amber)' }}>10% above</strong> market median for similar coverage</span>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Get 3 quotes <Icons.Arrow size={10}/></button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Renewal timeline */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 18 }}>Renewal action plan</div>
            <RenewalTimeline />
          </div>

          {/* Premium savings estimate */}
          <div className="card" style={{ padding: 18, background: 'var(--teal-soft)', borderColor: 'var(--teal)' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Icons.TrendDown size={18} style={{ color: 'var(--teal)', flex: 'none', marginTop: 2 }}/>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--teal)' }}>Estimated savings at renewal</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Negotiate AOP deductible', '-$180/yr'],
                ['Bundle with GL policy', '-$240/yr'],
                ['Claims-free discount', '-$120/yr'],
              ].map(([label, savings]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--ink-2)' }}>{label}</span>
                  <span className="serif num-t" style={{ color: 'var(--teal)', fontWeight: 600 }}>{savings}</span>
                </div>
              ))}
              <div className="hr" style={{ margin: '4px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600 }}>
                <span>Total potential savings</span>
                <span className="serif num-t" style={{ color: 'var(--teal)' }}>~$540/yr</span>
              </div>
            </div>
          </div>

          {/* Insurer note */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--ink-2)' }}>About GreatWest Mutual</div>
              GreatWest rates NC commercial property at 7.2% above the state average for this risk class. Their claims handling score (4.1/5) is above average. Consider requesting a loyalty discount given your 3-year tenure with no prior major claims before CLM-2041.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PolicyRenewal });
