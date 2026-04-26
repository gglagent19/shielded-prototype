// PublicStatus.jsx — public shareable claim status tracker (no auth required)

const STATUS_STEPS = [
  { id: 'filed',       label: 'Filed',        date: 'Mar 11',  done: true  },
  { id: 'documented',  label: 'Documented',   date: 'Mar 22',  done: true  },
  { id: 'offered',     label: 'Offer received',date: 'Apr 4',  done: true  },
  { id: 'negotiating', label: 'Negotiating',  date: 'Apr 23',  done: false, active: true },
  { id: 'settled',     label: 'Settled',      date: null,      done: false },
];

function StatusTimeline({ steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', minWidth: 90 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 99,
                background: s.done ? 'var(--teal)' : s.active ? 'var(--navy)' : 'var(--bg-muted)',
                border: s.active ? '3px solid var(--navy)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.done || s.active ? '#fff' : 'var(--ink-4)',
                boxShadow: s.active ? '0 0 0 4px color-mix(in oklab, var(--navy) 15%, transparent)' : 'none',
              }}>
                {s.done
                  ? <Icons.Check size={16} style={{ strokeWidth: 2.5 }}/>
                  : s.active
                    ? <span className="dot pulse" style={{ width: 10, height: 10, background: '#fff' }}/>
                    : <div style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--line-2)' }}/>}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: s.active ? 600 : s.done ? 400 : 400, color: s.active ? 'var(--ink)' : s.done ? 'var(--ink-2)' : 'var(--ink-4)', marginTop: 8, textAlign: 'center' }}>{s.label}</div>
              {s.date && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>{s.date}</div>}
            </div>
            {!isLast && (
              <div style={{ flex: 1, height: 3, marginTop: 16, background: s.done ? 'var(--teal)' : 'var(--line)', borderRadius: 99 }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PublicStatus() {
  const c = DEMO.activeClaim;
  const fmt = n => '$' + n.toLocaleString();

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)', overflow: 'auto' }} className="shielded-root">
      {/* Minimal header */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-card)' }}>
        <ShieldedLogo size={17} color="var(--navy)" />
        <div style={{ width: 1, height: 20, background: 'var(--line)' }}/>
        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Claim status · shared view</div>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-ghost btn-sm"><Icons.Lock size={12}/> Policyholder access</button>
      </div>

      {/* Hero status */}
      <div style={{ background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--line)', padding: '52px 40px 44px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <span className="pill pill-amber" style={{ marginBottom: 12, display: 'inline-flex' }}>
                <span className="dot pulse" style={{ background: 'var(--amber)' }}/> Negotiating — Day 43
              </span>
              <h1 className="serif" style={{ margin: 0, fontSize: 38, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {c.type}
              </h1>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 8 }}>
                {DEMO.business.name} · {DEMO.business.location} · Policy {DEMO.business.policyNo}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Claim ID</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{c.id}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4 }}>Opened {c.date}</div>
            </div>
          </div>
          <StatusTimeline steps={STATUS_STEPS} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '36px 40px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Current status card */}
        <div className="card" style={{ padding: 24, borderLeft: '4px solid var(--amber)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--amber-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icons.Scale size={20} style={{ color: 'var(--amber)' }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Active: settlement negotiation</div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                A formal settlement offer of <strong>{fmt(c.insurerOffer)}</strong> was received on Apr 4. Shielded's analysis estimates a fair settlement of <strong style={{ color: 'var(--teal)' }}>{fmt(c.fairMid)}</strong>, giving a recovery gap of <strong style={{ color: 'var(--red)' }}>+{fmt(c.delta)}</strong>. A negotiation rebuttal citing three policy clauses is in review.
              </div>
            </div>
          </div>
        </div>

        {/* Settlement comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { l: "Insurer's offer",  v: fmt(c.insurerOffer), color: 'var(--red)',  note: 'Received Apr 4' },
            { l: 'Fair range',        v: fmt(c.fairLow) + '–' + fmt(c.fairHigh), color: 'var(--teal)', note: '7 NC comparable claims' },
            { l: 'Recovery gap',      v: '+' + fmt(c.delta), color: 'var(--ink)', note: 'Open · being negotiated' },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{s.l}</div>
              <div className="serif num-t" style={{ fontSize: 26, letterSpacing: '-0.02em', color: s.color, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 6 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Timeline of events */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Claim timeline</div>
            <div className="eyebrow">Day {c.daysOpen}</div>
          </div>
          {[
            { date: 'Mar 11', label: 'Date of loss — kitchen fire reported', kind: 'event' },
            { date: 'Mar 11', label: 'Notice of loss sent to GreatWest Mutual', kind: 'done' },
            { date: 'Mar 14', label: 'Fire marshal site clearance obtained', kind: 'done' },
            { date: 'Mar 22', label: 'Contents inventory submitted (v2)', kind: 'done' },
            { date: 'Apr 4',  label: 'Adjuster inspection completed', kind: 'done' },
            { date: 'Apr 4',  label: 'Settlement offer received: $28,400', kind: 'milestone' },
            { date: 'Apr 23', label: 'Negotiation rebuttal under review', kind: 'active' },
            { date: 'Apr 28', label: 'Sworn proof of loss due', kind: 'upcoming' },
          ].map((ev, i) => (
            <div key={i} style={{ padding: '11px 20px', display: 'flex', gap: 16, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', background: ev.kind === 'active' ? '#fdf7ea' : ev.kind === 'upcoming' ? 'var(--red-soft)' : 'transparent' }}>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-4)', width: 46, flex: 'none' }}>{ev.date}</div>
              <div style={{ flex: 1, fontSize: 13 }}>{ev.label}</div>
              {ev.kind === 'done' && <Icons.CheckCircle size={15} style={{ color: 'var(--teal)', flex: 'none' }}/>}
              {ev.kind === 'milestone' && <span className="pill pill-amber" style={{ fontSize: 10 }}>Milestone</span>}
              {ev.kind === 'active' && <span className="pill pill-amber" style={{ fontSize: 10 }}>In progress</span>}
              {ev.kind === 'upcoming' && <span className="pill pill-red" style={{ fontSize: 10 }}>Due in 5d</span>}
            </div>
          ))}
        </div>

        {/* Upcoming deadlines */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Upcoming deadlines</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DEMO.deadlines.slice(0, 3).map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 14px', background: i === 0 ? 'var(--red-soft)' : 'var(--bg-subtle)', borderRadius: 8, border: '1px solid', borderColor: i === 0 ? 'var(--red)' : 'var(--line)' }}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? 'var(--red)' : 'var(--ink)', width: 50, flex: 'none' }}>{d.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{d.kind}</div>
                </div>
                <span className={`pill pill-${i === 0 ? 'red' : 'neutral'}`} style={{ fontSize: 10 }}>{d.day} days</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share / copy */}
        <div className="card" style={{ padding: 20, background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Share this status page</div>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 3 }}>shielded.co/status/CLM-2041-x7k9p</div>
            </div>
            <button className="btn btn-ghost btn-sm"><Icons.Copy size={12}/> Copy link</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 40px', borderTop: '1px solid var(--line)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ShieldedLogo size={14} color="var(--ink-4)" />
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>
          This page is shared by the policyholder. Shielded is not a law firm or licensed adjuster.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PublicStatus });
