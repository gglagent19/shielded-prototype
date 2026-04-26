// EmailTemplates.jsx — transactional email designs (deadline alert, offer received, weekly digest)

function EmailChrome({ children, subject, preview }) {
  return (
    <div style={{ background: '#f0ece6', minHeight: '100%', padding: '20px', fontFamily: 'var(--f-sans)' }}>
      {/* Email client chrome */}
      <div style={{ background: '#e8e4de', borderRadius: '8px 8px 0 0', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: 99, background: c }}/>
          ))}
        </div>
        <div style={{ flex: 1, background: '#ddd9d3', borderRadius: 4, padding: '3px 10px', fontSize: 11.5, color: '#666', textAlign: 'center' }}>
          {subject}
        </div>
      </div>
      {/* Email header row */}
      <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #e0dbd4', fontSize: 12, color: '#666', display: 'grid', gridTemplateColumns: '60px 1fr', gap: 4, rowGap: 2 }}>
        <span style={{ color: '#999' }}>From:</span><span>Shielded &lt;alerts@shielded.co&gt;</span>
        <span style={{ color: '#999' }}>To:</span><span>maya@lumenandloaf.com</span>
        <span style={{ color: '#999' }}>Subject:</span><span style={{ fontWeight: 600, color: '#333' }}>{subject}</span>
      </div>
      {/* Email body */}
      <div style={{ background: '#f9f7f4', padding: '0 0 20px' }}>
        {children}
      </div>
    </div>
  );
}

function EmailHeader({ tagline }) {
  return (
    <div style={{ background: '#1a2a4a', padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width="20" height="24" viewBox="0 0 22 26" fill="none">
        <path d="M11 1.5 L20.5 4.5 V13 C20.5 18.5 16.5 22.8 11 24.5 C5.5 22.8 1.5 18.5 1.5 13 V4.5 L11 1.5 Z" stroke="#fff" strokeWidth="1.3"/>
        <path d="M11 7.5 L16 9 V13.2 C16 15.8 13.8 18 11 19 C8.2 18 6 15.8 6 13.2 V9 L11 7.5 Z" fill="#fff" opacity="0.9"/>
        <path d="M8.5 13 L10.5 15 L14 11" stroke="#1a2a4a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ color: '#fff', fontSize: 18, fontFamily: '"Georgia", serif', letterSpacing: '-0.01em' }}>Shielded</span>
      {tagline && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginLeft: 8 }}>· {tagline}</span>}
    </div>
  );
}

function EmailFooter() {
  return (
    <div style={{ padding: '24px 40px', borderTop: '1px solid #e8e3da', textAlign: 'center', fontSize: 11.5, color: '#999', lineHeight: 1.7 }}>
      Shielded · 300 N Lamar Blvd, Austin TX 78703<br/>
      <span style={{ color: '#1a2a4a', cursor: 'pointer' }}>Manage notifications</span> · <span style={{ color: '#1a2a4a', cursor: 'pointer' }}>Unsubscribe</span> · <span style={{ color: '#1a2a4a', cursor: 'pointer' }}>View in browser</span><br/>
      <br/>Shielded is a policyholder advocacy tool. Not a law firm or licensed adjuster.
    </div>
  );
}

// ─── Email 1: Deadline Alert ─────────────────────────────────────
function EmailDeadlineAlert() {
  return (
    <EmailChrome subject="⚠ Action required: Proof of loss due in 5 days — CLM-2041">
      <EmailHeader tagline="Deadline alert"/>
      <div style={{ padding: '36px 40px', background: '#fff', margin: '0 0 2px' }}>
        <div style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: '#b8761f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          ● URGENT · 5 DAYS REMAINING
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: 26, fontFamily: '"Georgia", serif', color: '#14181f', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          Your proof of loss is due April 28.
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#5b6472', lineHeight: 1.65 }}>
          Claim CLM-2041 (Fire & Smoke · Lumen & Loaf) requires a sworn proof of loss by <strong style={{ color: '#14181f' }}>April 28, 2026</strong> per Policy §7B. Missing this deadline can void your right to dispute GreatWest's settlement offer.
        </p>

        {/* Urgency box */}
        <div style={{ background: '#f1dacf', border: '1px solid #a3321c', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#a3321c', marginBottom: 4 }}>Why this matters</div>
          <div style={{ fontSize: 13, color: '#2a3140', lineHeight: 1.6 }}>
            NC courts hold policyholders to written policy deadlines. GreatWest's current offer of <strong>$28,400</strong> is $19,400 below fair — you need your right to dispute intact.
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <a href="#" style={{ display: 'inline-block', background: '#1a2a4a', color: '#fff', padding: '13px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}>
            Review & sign proof of loss →
          </a>
          <div style={{ fontSize: 12, color: '#8a93a1', marginTop: 10 }}>Or log in at shielded.co/claims/CLM-2041</div>
        </div>

        {/* Upcoming deadlines mini list */}
        <div style={{ borderTop: '1px solid #e2ddd3', paddingTop: 20 }}>
          <div style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: '#8a93a1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Other upcoming deadlines · CLM-2041</div>
          {[
            { date: 'May 2',  label: 'Insurer 60-day response window closes', days: '9 days' },
            { date: 'May 10', label: 'Contents inventory supplement due',     days: '17 days' },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i === 0 ? '1px solid #f0ece6' : 'none', alignItems: 'center' }}>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 13, color: '#1a2a4a', width: 44, flex: 'none', fontWeight: 600 }}>{d.date}</div>
              <div style={{ flex: 1, fontSize: 13, color: '#2a3140' }}>{d.label}</div>
              <div style={{ fontSize: 11, color: '#8a93a1', fontFamily: '"Courier New", monospace' }}>{d.days}</div>
            </div>
          ))}
        </div>
      </div>
      <EmailFooter/>
    </EmailChrome>
  );
}

// ─── Email 2: Settlement Offer Received ─────────────────────────
function EmailSettlementOffer() {
  return (
    <EmailChrome subject="GreatWest Mutual sent a settlement offer for CLM-2041 — review now">
      <EmailHeader tagline="New offer"/>
      <div style={{ padding: '36px 40px', background: '#fff', margin: '0 0 2px' }}>
        <div style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: '#8a93a1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          CLAIM CLM-2041 · FIRE & SMOKE
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: 26, fontFamily: '"Georgia", serif', color: '#14181f', lineHeight: 1.2 }}>
          You have a settlement offer.
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#5b6472', lineHeight: 1.65 }}>
          GreatWest Mutual submitted a formal settlement offer on <strong style={{ color: '#14181f' }}>April 4, 2026</strong>. Shielded has already analyzed it against 7 comparable NC claims. Here's what we found.
        </p>

        {/* Settlement comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, borderRadius: 10, overflow: 'hidden', marginBottom: 24, background: '#e2ddd3' }}>
          {[
            { l: "Their offer",   v: "$28,400", color: '#a3321c', bg: '#fff' },
            { l: "Fair midpoint", v: "$47,800", color: '#0f7d6c', bg: '#f6f3ee' },
            { l: "Recovery gap",  v: "+$19,400", color: '#14181f', bg: '#fff' },
          ].map(s => (
            <div key={s.l} style={{ padding: '18px 16px', textAlign: 'center', background: s.bg }}>
              <div style={{ fontSize: 11, color: '#8a93a1', marginBottom: 6, fontFamily: '"Courier New", monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
              <div style={{ fontSize: 26, fontFamily: '"Georgia", serif', color: s.color, letterSpacing: '-0.02em' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Clause callouts */}
        <div style={{ background: '#f6f3ee', borderRadius: 8, padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2a4a', marginBottom: 12 }}>Shielded found 3 issues in this estimate</div>
          {[
            { ref: '§4.2', t: 'Replacement cost vs ACV', v: '+$9,200' },
            { ref: '§3.4', t: 'Smoke scope incomplete',  v: '+$4,400' },
            { ref: '§5.1', t: 'Income calc method',      v: '+$3,800' },
          ].map(c => (
            <div key={c.ref} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #e2ddd3', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 12, color: '#1a2a4a', fontWeight: 700, width: 36, flex: 'none' }}>{c.ref}</span>
              <span style={{ flex: 1, fontSize: 13, color: '#2a3140' }}>{c.t}</span>
              <span style={{ fontSize: 14, fontFamily: '"Georgia", serif', color: '#0f7d6c', fontWeight: 600 }}>{c.v}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <a href="#" style={{ display: 'inline-block', background: '#1a2a4a', color: '#fff', padding: '13px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Review offer & draft rebuttal →
          </a>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#8a93a1' }}>
          Rebuttal draft takes 60 seconds to generate
        </div>
      </div>
      <EmailFooter/>
    </EmailChrome>
  );
}

// ─── Email 3: Weekly Digest ──────────────────────────────────────
function EmailWeeklyDigest() {
  return (
    <EmailChrome subject="Your Shielded week: 1 active claim, 2 deadlines this week">
      <EmailHeader tagline="Weekly digest"/>
      <div style={{ padding: '36px 40px', background: '#fff', margin: '0 0 2px' }}>
        <div style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: '#8a93a1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          WEEK OF APRIL 21, 2026
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontFamily: '"Georgia", serif', color: '#14181f', lineHeight: 1.2 }}>
          Good morning, Maya.
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#5b6472' }}>
          Your claim is 43 days in. Two deadlines hit this week — here's your weekly snapshot.
        </p>

        {/* Active claim card */}
        <div style={{ border: '1px solid #e2ddd3', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ background: '#f6f3ee', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: '#8a93a1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Active claim · CLM-2041 · Day 43</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>Fire & Smoke Damage</div>
            </div>
            <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: '#f5e6c8', color: '#b8761f', fontWeight: 600, fontFamily: '"Courier New", monospace' }}>● NEGOTIATING</div>
          </div>
          <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { l: "Offer",    v: "$28,400",  c: '#a3321c' },
              { l: "Fair mid", v: "$47,800",  c: '#0f7d6c' },
              { l: "Gap",      v: "+$19,400", c: '#14181f' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#8a93a1', marginBottom: 4, fontFamily: '"Courier New", monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                <div style={{ fontSize: 20, fontFamily: '"Georgia", serif', color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* This week deadlines */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>This week's deadlines</div>
          {[
            { date: 'Apr 28', label: 'Sworn proof of loss', kind: 'Policy §7B · URGENT', urgent: true },
            { date: 'May 2',  label: '60-day response window closes', kind: 'NC §58-63', urgent: false },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid #f0ece6', alignItems: 'center' }}>
              <div style={{ width: 40, textAlign: 'center', flex: 'none' }}>
                <div style={{ fontSize: 10, color: '#8a93a1', fontFamily: '"Courier New", monospace' }}>{d.date.split(' ')[0].toUpperCase()}</div>
                <div style={{ fontSize: 22, fontFamily: '"Georgia", serif', color: d.urgent ? '#a3321c' : '#14181f', lineHeight: 1 }}>{d.date.split(' ')[1]}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: '#8a93a1' }}>{d.kind}</div>
              </div>
              {d.urgent && <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: '#f1dacf', color: '#a3321c', fontWeight: 600 }}>Urgent</div>}
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background: '#f6f3ee', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Suggested actions</div>
          {[
            '✓  Draft sworn proof of loss (AI takes 60 sec)',
            '✓  Cite §4.2 in your rebuttal — $9,200 lever',
            '✓  Upload walk-in cooler photos before May 10',
          ].map((a, i) => (
            <div key={i} style={{ fontSize: 13, color: '#2a3140', padding: '5px 0', lineHeight: 1.5 }}>{a}</div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="#" style={{ display: 'inline-block', background: '#1a2a4a', color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
            Go to my dashboard →
          </a>
        </div>
      </div>
      <EmailFooter/>
    </EmailChrome>
  );
}

Object.assign(window, { EmailDeadlineAlert, EmailSettlementOffer, EmailWeeklyDigest });
