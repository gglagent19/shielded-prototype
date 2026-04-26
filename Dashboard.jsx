// Dashboard.jsx — main dashboard with all widgets

function StatCard({ eyebrow, value, delta, deltaKind, foot, tall }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minHeight: tall ? 124 : 'auto' }}>
      <div className="eyebrow">{eyebrow}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div className="serif num-t" style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {value}
        </div>
        {delta && (
          <span className={`pill pill-${deltaKind || 'neutral'}`} style={{ fontSize: 10.5 }}>
            {delta}
          </span>
        )}
      </div>
      {foot && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 'auto' }}>{foot}</div>}
    </div>
  );
}

function ActiveClaimHero({ variant = 'A' }) {
  const c = DEMO.activeClaim;
  const fmt = (n) => '$' + n.toLocaleString();
  const offerPct = ((c.insurerOffer - c.fairLow) / (c.fairHigh - c.fairLow)) * 100;

  if (variant === 'B') {
    // Variant B: horizontal, more editorial
    return (
      <div className="card" style={{ padding: 22, display: 'flex', gap: 28, alignItems: 'stretch' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pill pill-amber"><span className="dot" style={{ background: 'var(--amber)' }}/> Negotiating</span>
            <span className="eyebrow">{c.id} · Day {c.daysOpen}</span>
          </div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Your insurer is offering <em style={{ color: 'var(--red)', fontStyle: 'normal' }}>$19,400 less</em> than a fair settlement for this claim.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 520 }}>
            Based on 7 comparable NC restaurant fire claims and three clauses in your policy, we estimate a defensible range of <strong style={{ color: 'var(--ink)' }}>{fmt(c.fairLow)}–{fmt(c.fairHigh)}</strong>.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="btn btn-primary"><Icons.Sparkle size={14}/> Draft rebuttal with AI</button>
            <button className="btn btn-ghost">See the math</button>
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--line)' }}/>
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
          <div>
            <div className="eyebrow">Their offer</div>
            <div className="serif num-t" style={{ fontSize: 24, color: 'var(--red)' }}>{fmt(c.insurerOffer)}</div>
          </div>
          <div>
            <div className="eyebrow">Fair midpoint</div>
            <div className="serif num-t" style={{ fontSize: 24, color: 'var(--teal)' }}>{fmt(c.fairMid)}</div>
          </div>
          <div>
            <div className="eyebrow">Gap</div>
            <div className="serif num-t" style={{ fontSize: 24 }}>+{fmt(c.delta)}</div>
          </div>
        </div>
      </div>
    );
  }

  // Variant A: number-left, chart-right
  return (
    <div className="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pill pill-amber"><span className="dot" style={{ background: 'var(--amber)' }}/> Negotiating</span>
          <span className="eyebrow">{c.id} · {c.type}</span>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Estimated recovery gap</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div className="serif num-t" style={{ fontSize: 46, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              +${(c.delta/1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              vs insurer offer<br/>
              <span className="mono" style={{ color: 'var(--ink-4)' }}>95% conf. · 7 comps</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          GreatWest's offer of <strong>{fmt(c.insurerOffer)}</strong> sits below the fair range. Three policy clauses and comparable claims in NC support pushing back.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button className="btn btn-primary"><Icons.Sparkle size={14}/> Draft rebuttal</button>
          <button className="btn btn-ghost">View claim</button>
        </div>
      </div>
      <div style={{
        background: 'var(--bg-subtle)', borderRadius: 10, padding: '18px 20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18,
      }}>
        <div className="eyebrow">Settlement range · similar claims</div>
        {/* Box plot */}
        <div style={{ position: 'relative', height: 64 }}>
          {/* Range bar */}
          <div style={{
            position: 'absolute', left: '8%', right: '8%', top: 28, height: 8,
            background: 'linear-gradient(90deg, var(--amber-soft), var(--teal-soft), var(--amber-soft))',
            borderRadius: 4,
          }}/>
          {/* Center */}
          <div style={{
            position: 'absolute', left: '50%', top: 18, bottom: 18, width: 2,
            background: 'var(--teal)',
          }}/>
          {/* Insurer offer marker */}
          <div style={{ position: 'absolute', left: '8%', top: 14, textAlign: 'center' }}>
            <div style={{ width: 2, height: 36, background: 'var(--red)' }}/>
            <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 4, whiteSpace: 'nowrap', transform: 'translateX(-30%)' }} className="mono">
              {fmt(c.insurerOffer)} ▲
            </div>
          </div>
          {/* Fair mid */}
          <div style={{ position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--teal)' }} className="mono">
            fair mid
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>
          <span>{fmt(c.fairLow - 5000)}</span>
          <span>{fmt(c.fairMid)}</span>
          <span>{fmt(c.fairHigh + 3000)}</span>
        </div>
      </div>
    </div>
  );
}

function RiskAlerts() {
  const tone = { high: 'red', med: 'amber', low: 'neutral' };
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Policy risk alerts</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>From your latest policy analysis</div>
        </div>
        <button className="btn btn-quiet btn-sm">See all 7</button>
      </div>
      {DEMO.risks.map((r, i) => (
        <div key={i} style={{
          padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
          borderTop: i > 0 ? '1px solid var(--line)' : 'none',
        }}>
          <span className={`pill pill-${tone[r.level]}`} style={{ marginTop: 1 }}>
            {r.level === 'high' ? 'High' : r.level === 'med' ? 'Medium' : 'Low'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.45 }}>{r.detail}</div>
          </div>
          <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.ChevronR size={14}/></button>
        </div>
      ))}
    </div>
  );
}

function DeadlineList() {
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Deadlines</div>
        <button className="btn btn-quiet btn-sm">Timeline <Icons.Arrow size={12}/></button>
      </div>
      {DEMO.deadlines.map((d, i) => {
        const soon = d.day <= 7;
        return (
          <div key={i} style={{
            padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center',
            borderTop: i > 0 ? '1px solid var(--line)' : 'none',
          }}>
            <div style={{
              width: 40, textAlign: 'center', flex: 'none',
              color: soon ? 'var(--red)' : 'var(--ink-2)',
            }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase' }}>
                {d.date.split(' ')[0]}
              </div>
              <div className="serif num-t" style={{ fontSize: 22, lineHeight: 1 }}>{d.date.split(' ')[1]}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{d.kind}</div>
            </div>
            <span className={`pill pill-${soon ? 'red' : 'neutral'}`}>{d.day}d</span>
          </div>
        );
      })}
    </div>
  );
}

function NegotiationSuggestions() {
  const suggestions = [
    { title: 'Cite §4.2 — replacement cost clause', sub: 'Hood + oven undervalued by $9,200 as ACV', kind: 'clause' },
    { title: 'Include Raleigh + Durham comps', sub: 'Both paid above $38k for similar fires', kind: 'comp' },
    { title: 'Request itemized denial for smoke remediation', sub: 'Adjuster omitted HVAC cleaning', kind: 'procedural' },
  ];
  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--navy)' }}/>
            Next moves
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>3 strategies to recover the gap</div>
        </div>
        <button className="btn btn-ghost btn-sm">Generate letter</button>
      </div>
      {suggestions.map((s, i) => (
        <div key={i} style={{
          padding: 10, background: 'var(--bg-subtle)', borderRadius: 8,
          display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5, background: 'var(--bg-card)',
            border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            fontSize: 10, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)',
          }}>{i+1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{s.sub}</div>
          </div>
          <Icons.Plus size={14} style={{ color: 'var(--ink-4)', marginTop: 2 }}/>
        </div>
      ))}
    </div>
  );
}

function RecentDocs() {
  const kindColors = { Policy: 'navy', Evidence: 'amber', Photos: 'neutral', Inventory: 'teal', Estimate: 'red' };
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Recent documents</div>
        <button className="btn btn-quiet btn-sm"><Icons.Upload size={13}/> Upload</button>
      </div>
      {DEMO.recentDocs.map((d, i) => (
        <div key={i} style={{
          padding: '10px 16px', display: 'flex', gap: 12, alignItems: 'center',
          borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 34, border: '1px solid var(--line-2)', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            background: 'var(--bg-subtle)',
          }}>
            <Icons.FileText size={14} style={{ color: 'var(--ink-3)' }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{d.size} · {d.date}</div>
          </div>
          <span className={`pill pill-${kindColors[d.kind] || 'neutral'}`}>{d.kind}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ variant = 'A' }) {
  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      {/* Greeting + stats */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>April 23 · Thursday</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
            Good morning, Maya.
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
            Your claim is 43 days in. Two deadlines this week — and your insurer's offer is still 41% low.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Upload size={14}/> Upload doc</button>
          <button className="btn btn-primary"><Icons.Plus size={14}/> New claim</button>
        </div>
      </div>

      <ActiveClaimHero variant={variant} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard eyebrow="Active claims" value="1" foot="Fire · Mar 11" />
        <StatCard eyebrow="Coverage used" value="$28.4k" delta="of $620k" deltaKind="neutral" foot="Within limits" />
        <StatCard eyebrow="Days to next deadline" value="5" delta="urgent" deltaKind="red" foot="Proof of loss · Apr 28" />
        <StatCard eyebrow="Est. recovery remaining" value="+$19.4k" delta="fair gap" deltaKind="teal" foot="Based on 7 comps" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RiskAlerts />
          <RecentDocs />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <NegotiationSuggestions />
          <DeadlineList />
        </div>
      </div>
    </div>
  );
}

function DashboardEmpty() {
  const steps = [
    { n: 1, title: 'Upload your policy', sub: 'We read every page — exclusions, sub-limits, conditions.', done: false, cta: 'Upload policy', icon: 'Upload' },
    { n: 2, title: 'Review coverage gaps', sub: 'We flag anything that looks thin for a business like yours.', done: false, cta: null, icon: 'Shield' },
    { n: 3, title: 'File a claim if needed', sub: 'Step-by-step documentation, photo coach, deadline tracker.', done: false, cta: null, icon: 'Claim' },
  ];
  return (
    <div style={{ padding: '40px 48px 48px', display: 'flex', flexDirection: 'column', gap: 32, overflow: 'auto', flex: 1 }}>
      {/* Welcome */}
      <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto', paddingTop: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg-subtle)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShieldedMark size={34} color="var(--navy)" />
        </div>
        <h2 className="serif" style={{ margin: '0 0 8px', fontSize: 34, letterSpacing: '-0.02em' }}>Welcome to Shielded.</h2>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Start by uploading your commercial insurance policy. We'll analyze it in about 90 seconds and flag anything that could hurt you in a claim.
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto', width: '100%' }}>
        {steps.map((s, i) => {
          const I = Icons[s.icon];
          return (
            <div key={s.n} className="card" style={{ padding: 22, opacity: i === 0 ? 1 : 0.55 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? 'var(--navy)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I size={16} style={{ color: i === 0 ? '#fff' : 'var(--ink-4)' }}/>
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>Step {s.n}</div>
              </div>
              <div className="serif" style={{ fontSize: 18, letterSpacing: '-0.01em', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 16 }}>{s.sub}</div>
              {s.cta && (
                <button className="btn btn-primary btn-sm">
                  <I size={12}/> {s.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Social proof strip */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', maxWidth: 640, margin: '0 auto', width: '100%' }}>
        {[
          { v: '$14,200', l: 'avg. recovery uplift per claim' },
          { v: '2,400+',  l: 'small businesses protected' },
          { v: '68%',     l: 'settle after 1 rebuttal letter' },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, textAlign: 'center', padding: '16px 12px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
            <div className="serif num-t" style={{ fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{s.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 14 }}>
          <Icons.Upload size={14}/> Upload my first policy
        </button>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 10 }}>PDF · DOCX · up to 50 MB · analyzed in ~90 seconds</div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, DashboardEmpty });
