// Negotiate.jsx — AI negotiation generator

function Negotiate() {
  const [tone, setTone] = React.useState('firm');
  const [typing, setTyping] = React.useState(false);
  const tones = [
    { id: 'diplomatic', label: 'Diplomatic', sub: 'Soft open, firm close' },
    { id: 'firm',       label: 'Firm',       sub: 'Professional, evidence-led' },
    { id: 'assertive',  label: 'Assertive',  sub: 'Hints at representation' },
  ];

  const drafts = {
    diplomatic: `Dear Mr. Halloran,

Thank you for the settlement offer of $28,400 dated April 4 for claim CLM-2041. I appreciate GreatWest Mutual's prompt response.

After reviewing the offer against the terms of policy CPP-48291-B and comparable regional claims, I believe several items warrant reconsideration before I can accept.`,
    firm: `Dear Mr. Halloran,

I am writing in response to GreatWest Mutual's April 4 settlement offer of $28,400 for claim CLM-2041 (fire and smoke damage, March 11, 2026). The offer does not reflect the full extent of covered loss under policy CPP-48291-B, and I am requesting a revised settlement of $47,800, consistent with the fair-market recovery range for comparable claims.

Three issues require correction:

1.  Replacement-cost basis (Policy §4.2). Your adjuster's valuation of the commercial hood and convection oven applied actual-cash-value depreciation despite the policy's replacement-cost endorsement. This under-counts recovery by approximately $9,200.

2.  Smoke-remediation scope. The estimate omits HVAC duct cleaning and soft-goods deodorization, which are standard scope for commercial smoke losses and covered under §3.4.

3.  Business-income continuation. Lost income during the 19-day shutdown was calculated at a flat rate rather than the actual trailing 3-month average per §5.1, reducing the covered amount by approximately $3,800.

I've enclosed an itemized comparison and three comparable NC restaurant fire settlements (Raleigh $38,200 · Charlotte $52,500 · Durham $44,800).

I'd appreciate a written response within 10 business days.

Sincerely,
Maya Okafor
Owner, Lumen & Loaf`,
    assertive: `Mr. Halloran,

GreatWest Mutual's April 4 offer of $28,400 for claim CLM-2041 is materially below the recoverable value under policy CPP-48291-B, and I am formally requesting a revised offer of $47,800 — within the documented fair range for comparable NC restaurant fire claims (P25 $40,900, P75 $51,000).`,
  };

  const draft = drafts[tone] || drafts.firm;

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Claim {DEMO.activeClaim.id}</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
            Negotiation generator
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, maxWidth: 600 }}>
            A rebuttal email anchored in your policy clauses and comparable claim data. Edit anything before you send.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Copy size={13}/> Copy</button>
          <button className="btn btn-primary"><Icons.Mail size={13}/> Send via Shielded</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 20 }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Tone</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tones.map(t => {
                const on = t.id === tone;
                return (
                  <button key={t.id} onClick={() => { setTyping(true); setTone(t.id); setTimeout(() => setTyping(false), 700); }} style={{
                    textAlign: 'left', padding: 10, borderRadius: 8, cursor: 'pointer',
                    background: on ? '#eef2fb' : 'var(--bg-card)',
                    border: on ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: on ? 500 : 400, color: on ? 'var(--navy)' : 'var(--ink)' }}>{t.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{t.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Evidence attached</div>
            {[
              { on: true,  label: 'Policy §4.2 · replacement cost',  sub: 'Single-strongest lever' },
              { on: true,  label: 'Policy §3.4 · smoke remediation', sub: '' },
              { on: true,  label: 'Policy §5.1 · business income',   sub: '' },
              { on: true,  label: '3 comparable NC claims',           sub: 'Raleigh · Charlotte · Durham' },
              { on: false, label: 'Fire marshal report',              sub: 'Include as attachment' },
              { on: false, label: 'Photo set (34 images)',            sub: 'Only if requested' },
            ].map((e, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', cursor: 'pointer' }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flex: 'none', marginTop: 2,
                  background: e.on ? 'var(--navy)' : 'transparent',
                  border: e.on ? 'none' : '1.5px solid var(--line-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {e.on && <Icons.Check size={10} style={{ color: '#fff', strokeWidth: 3 }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{e.label}</div>
                  {e.sub && <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{e.sub}</div>}
                </div>
              </label>
            ))}
          </div>

          <div className="card" style={{ padding: 16, background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Icons.Info size={15} style={{ flex: 'none', color: 'var(--ink-3)', marginTop: 1 }}/>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                Shielded drafts negotiation letters but is not a law firm or licensed adjuster. For complex disputes, consider retaining a public adjuster or attorney.
              </div>
            </div>
          </div>
        </div>

        {/* Email draft */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="pill pill-navy">Draft</span>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }} className="mono">to: j.halloran@greatwestmutual.com</div>
              <div style={{ flex: 1 }}/>
              {typing
                ? <div className="mono" style={{ fontSize: 11, color: 'var(--navy)' }}><span className="dot pulse" style={{ background: 'var(--navy)', marginRight: 4 }}/> regenerating</div>
                : <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>saved · 2s ago</div>}
            </div>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
              <div style={{ color: 'var(--ink-4)', fontSize: 11 }}>Subject</div>
              <div style={{ fontWeight: 500 }}>Settlement reconsideration — Claim CLM-2041 (Lumen & Loaf, 3/11/2026 fire)</div>
            </div>
            <div style={{
              padding: '20px 24px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink)',
              whiteSpace: 'pre-wrap', minHeight: 360, fontFamily: 'var(--f-serif)', fontSize: 15,
              opacity: typing ? 0.55 : 1, transition: 'opacity .2s',
            }}>
              {draft}
              <span style={{ color: 'var(--navy)' }} className={typing ? 'caret' : ''}/>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-subtle)' }}>
              <button className="btn btn-quiet btn-sm"><Icons.Sparkle size={12}/> Make shorter</button>
              <button className="btn btn-quiet btn-sm"><Icons.Sparkle size={12}/> Cite more clauses</button>
              <button className="btn btn-quiet btn-sm"><Icons.Sparkle size={12}/> Add ask for inspection</button>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">412 words · ~2 min read</span>
            </div>
          </div>

          {/* Clause panel */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Clauses referenced</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: '§4.2', title: 'Replacement Cost Valuation', text: '"Covered Property will be valued at replacement cost … without deduction for depreciation, provided repairs are completed within 24 months."', gap: '+$9,200' },
                { id: '§3.4', title: 'Scope of Smoke Damage',       text: '"Direct physical loss caused by smoke includes cleaning, deodorization, and removal of residue from HVAC systems and soft surfaces."', gap: '+$4,400' },
                { id: '§5.1', title: 'Business Income Method',     text: '"Actual loss of business income sustained based on the experience of the business during the 12 months immediately preceding the date of direct physical loss."', gap: '+$3,800' },
              ].map(c => (
                <div key={c.id} style={{ padding: 12, borderLeft: '2px solid var(--navy)', background: 'var(--bg-subtle)', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 12.5 }}><span className="mono" style={{ color: 'var(--navy)', marginRight: 6 }}>{c.id}</span><strong>{c.title}</strong></div>
                    <span className="pill pill-teal">{c.gap}</span>
                  </div>
                  <div className="serif" style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Negotiate });
