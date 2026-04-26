// ClaimReport.jsx — shareable/printable claim summary document

function ReportSection({ title, children, noBorder }) {
  return (
    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: noBorder ? 'none' : '1px solid var(--line)' }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function ReportRow({ label, value, mono, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
      <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{label}</span>
      <span className={mono ? 'mono' : ''} style={{ fontSize: 13, fontWeight: highlight ? 600 : 400, color: highlight ? 'var(--ink)' : 'var(--ink-2)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ClaimReport() {
  const c = DEMO.activeClaim;
  const fmt = n => '$' + n.toLocaleString();
  const comps = DEMO.benchmarks.comps;
  const avgComp = Math.round(comps.reduce((a, x) => a + x.payout, 0) / comps.length);
  const min = Math.min(...comps.map(x => x.payout));
  const max = Math.max(...comps.map(x => x.payout));
  const xp = v => Math.round(((v - 25000) / 35000) * 100);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', overflow: 'auto' }}>
      {/* Floating action bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(246,243,238,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line)', padding: '10px 40px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <ShieldedLogo size={16} color="var(--navy)" />
        <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-3)' }}>
          Claim report · {c.id} · generated Apr 23, 2026
        </div>
        <button className="btn btn-ghost btn-sm"><Icons.Copy size={12}/> Copy link</button>
        <button className="btn btn-ghost btn-sm"><Icons.Download size={12}/> Download PDF</button>
        <button className="btn btn-primary btn-sm"><Icons.Mail size={12}/> Send to adjuster</button>
      </div>

      {/* Document body */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '52px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Settlement analysis report</div>
              <h1 className="serif" style={{ margin: 0, fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {c.type}
              </h1>
              <div style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 6 }}>
                {DEMO.business.name} · {DEMO.business.location} · {c.date}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 4 }}>Claim ID</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: 'var(--navy)' }}>{c.id}</div>
              <span className="pill pill-amber" style={{ marginTop: 8, display: 'inline-flex' }}>
                <span className="dot" style={{ background: 'var(--amber)' }}/> {c.status}
              </span>
            </div>
          </div>

          {/* Key numbers banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
            {[
              { l: "Insurer's offer",    v: fmt(c.insurerOffer), note: 'Received Apr 04', color: 'var(--red)' },
              { l: 'Fair value (est.)',  v: fmt(c.fairMid),      note: fmt(c.fairLow) + '–' + fmt(c.fairHigh) + ' range', color: 'var(--teal)' },
              { l: 'Recovery gap',       v: '+' + fmt(c.delta),  note: 'Based on 7 comparable claims', color: 'var(--ink)' },
            ].map(s => (
              <div key={s.l} style={{ padding: '22px 24px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>{s.l}</div>
                <div className="serif num-t" style={{ fontSize: 34, letterSpacing: '-0.02em', color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim details */}
        <ReportSection title="Claim details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            {[
              ['Policy number',  DEMO.business.policyNo],
              ['Insurer',        DEMO.business.policy.split('—')[0].trim()],
              ['Date of loss',   c.date],
              ['Days open',      c.daysOpen + ' days'],
              ['Business',       DEMO.business.name],
              ['Business type',  DEMO.business.type],
              ['Location',       DEMO.business.location],
              ['Report prepared','Apr 23, 2026 · Shielded'],
            ].map(([l, v]) => <ReportRow key={l} label={l} value={v} mono={l.includes('number') || l.includes('date') || l.includes('Date') || l.includes('Days')}/>)}
          </div>
        </ReportSection>

        {/* Settlement range chart */}
        <ReportSection title="Settlement benchmarking — 7 comparable NC claims (2025–2026)">
          <div style={{ marginBottom: 20 }}>
            {/* Box plot */}
            <div style={{ position: 'relative', height: 80, marginBottom: 12 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 36, height: 1, background: 'var(--line-2)' }}/>
              {/* IQR box */}
              <div style={{
                position: 'absolute',
                left: xp(DEMO.activeClaim.fairLow) + '%',
                width: (xp(DEMO.activeClaim.fairHigh) - xp(DEMO.activeClaim.fairLow)) + '%',
                top: 24, height: 24,
                background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 4,
              }}/>
              {/* Median */}
              <div style={{ position: 'absolute', left: xp(c.fairMid) + '%', top: 18, bottom: 26, width: 2, background: 'var(--teal)' }}/>
              {/* Offer marker */}
              <div style={{ position: 'absolute', left: xp(c.insurerOffer) + '%', top: 10, bottom: 20 }}>
                <div style={{ width: 2, height: '100%', background: 'var(--red)' }}/>
                <div className="mono" style={{ position: 'absolute', bottom: -18, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--red)', whiteSpace: 'nowrap' }}>Offer</div>
              </div>
              {/* Tick marks */}
              {[25, 35, 45, 55, 60].map(v => (
                <div key={v} style={{ position: 'absolute', left: xp(v * 1000) + '%', top: 34 }}>
                  <div style={{ width: 1, height: 6, background: 'var(--line-2)' }}/>
                  <div className="mono" style={{ position: 'absolute', top: 8, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--ink-4)' }}>${v}k</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-3)', marginTop: 24 }}>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 12, height: 3, background: 'var(--red)', borderRadius: 1 }}/> Insurer offer: {fmt(c.insurerOffer)}</span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 12, height: 12, background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 2 }}/> Fair range: {fmt(c.fairLow)}–{fmt(c.fairHigh)}</span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><div style={{ width: 2, height: 12, background: 'var(--teal)' }}/> Fair midpoint: {fmt(c.fairMid)}</span>
            </div>
          </div>

          {/* Comparable claims table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px', gap: 12 }}>
              {['Business / location', 'Loss type', 'Settlement'].map(h => (
                <span key={h} className="eyebrow" style={{ fontSize: 9.5 }}>{h}</span>
              ))}
            </div>
            {comps.map((comp, i) => (
              <div key={i} style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                <span style={{ fontSize: 12.5 }}>{comp.label}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{comp.type}</span>
                <span className="serif num-t" style={{ fontSize: 14, color: 'var(--teal)' }}>{fmt(comp.payout)}</span>
              </div>
            ))}
            <div style={{ padding: '11px 14px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Average (7 comps)</span>
              <span/>
              <span className="serif num-t" style={{ fontSize: 14, fontWeight: 600 }}>{fmt(avgComp)}</span>
            </div>
          </div>
        </ReportSection>

        {/* Policy clause basis */}
        <ReportSection title="Policy basis for revised figure">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { ref: '§4.2', title: 'Replacement cost valuation — commercial kitchen equipment', gap: '+$9,200', detail: 'The adjuster applied actual-cash-value depreciation to the commercial hood and convection oven. Policy §4.2 "Equipment — Replacement Cost Endorsement" explicitly requires replacement cost valuation for equipment in active commercial use. The ACV deduction of $9,200 is unsupported.' },
              { ref: '§3.4', title: 'Smoke remediation scope — HVAC and soft goods', gap: '+$4,400', detail: 'The adjuster\'s estimate omits HVAC duct cleaning ($2,800) and soft goods deodorization ($1,600). Policy §3.4 "Covered Perils — Smoke" includes remediation of all surfaces and mechanical systems reached by smoke, including HVAC.' },
              { ref: '§5.1', title: 'Business income — trailing average calculation method', gap: '+$3,800', detail: 'The adjuster calculated business income loss using a single flat-rate month. Policy §5.1 specifies the "12-month trailing average" method for restaurants with seasonal variation. Using the correct method adds $3,800 to the recoverable income loss.' },
            ].map(clause => (
              <div key={clause.ref} className="card" style={{ padding: 18, display: 'flex', gap: 16 }}>
                <div className="mono" style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600, width: 36, flex: 'none', paddingTop: 2 }}>{clause.ref}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{clause.title}</div>
                    <div className="serif num-t" style={{ fontSize: 18, color: 'var(--teal)', flex: 'none', marginLeft: 16 }}>{clause.gap}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{clause.detail}</div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, padding: '14px 18px', background: 'var(--bg-subtle)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Current offer</div>
              <div className="serif num-t" style={{ fontSize: 18, color: 'var(--red)' }}>{fmt(c.insurerOffer)}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>+ Identified gap</div>
              <div className="serif num-t" style={{ fontSize: 18, color: 'var(--teal)' }}>+{fmt(c.delta)}</div>
              <div style={{ width: 1, background: 'var(--line)' }}/>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Revised request</div>
              <div className="serif num-t" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>{fmt(c.insurerOffer + c.delta)}</div>
            </div>
          </div>
        </ReportSection>

        {/* Upcoming deadlines */}
        <ReportSection title="Regulatory deadlines — NC §58-63">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO.deadlines.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '10px 14px', background: i === 0 ? 'var(--red-soft)' : 'var(--bg-card)', border: '1px solid', borderColor: i === 0 ? 'var(--red)' : 'var(--line)', borderRadius: 8 }}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? 'var(--red)' : 'var(--ink)', width: 54, flex: 'none' }}>{d.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{d.kind}</div>
                </div>
                {d.day <= 7 && <span className="pill pill-red" style={{ fontSize: 10 }}>Due in {d.day}d</span>}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Footer */}
        <div style={{ paddingTop: 16, fontSize: 11.5, color: 'var(--ink-4)', lineHeight: 1.7, borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <ShieldedLogo size={14} color="var(--ink-4)" />
            <span className="mono" style={{ fontSize: 10 }}>Generated Apr 23, 2026 · {c.id} · Confidential</span>
          </div>
          This report was prepared by Shielded on behalf of the policyholder. Shielded is a policyholder advocacy tool and is not a law firm or licensed public adjuster. Settlement estimates are based on comparable claim data and policy analysis; actual outcomes may differ. This document does not constitute legal advice.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClaimReport });
