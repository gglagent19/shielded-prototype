// Correspondence.jsx — adjuster communication thread for a claim

const THREAD = [
  {
    id: 1, dir: 'out', date: 'Mar 11, 2026 · 3:14 PM',
    from: 'Maya Okafor',  to: 'GreatWest Claims',
    subject: 'Notice of Loss — Policy CPP-48291-B',
    preview: 'I am writing to provide formal notice of loss pursuant to Policy No. CPP-48291-B…',
    tag: 'Notice of loss', tagKind: 'navy', via: 'Shielded',
  },
  {
    id: 2, dir: 'in', date: 'Mar 12, 2026 · 9:04 AM',
    from: 'GreatWest Claims', to: 'Maya Okafor',
    subject: 'RE: Notice of Loss — Claim CLM-2041 Assigned',
    preview: 'Thank you for your notice. Claim CLM-2041 has been opened and assigned to adjuster J. Halloran. Please expect an inspection request within 5–7 business days…',
    tag: 'Acknowledgment', tagKind: 'neutral',
  },
  {
    id: 3, dir: 'in', date: 'Mar 28, 2026 · 2:33 PM',
    from: 'J. Halloran · GreatWest', to: 'Maya Okafor',
    subject: 'Inspection Scheduled — CLM-2041',
    preview: 'We have scheduled an on-site inspection for April 2, 2026. Please ensure a representative is available. We will assess all claimed areas including kitchen, dining room, and HVAC…',
    tag: 'Inspection notice', tagKind: 'amber',
  },
  {
    id: 4, dir: 'out', date: 'Mar 29, 2026 · 11:17 AM',
    from: 'Maya Okafor', to: 'J. Halloran · GreatWest',
    subject: 'RE: Inspection Scheduled — Documentation Available',
    preview: 'Thank you. We confirm April 2 at 10:00 AM. I will also share our contents inventory, fire marshal report, and photo log prior to the inspection for your review…',
    tag: 'Confirmation', tagKind: 'neutral', via: 'Shielded',
  },
  {
    id: 5, dir: 'in', date: 'Apr 4, 2026 · 4:51 PM',
    from: 'J. Halloran · GreatWest', to: 'Maya Okafor',
    subject: 'Settlement Offer — CLM-2041',
    preview: 'Following our inspection and review of submitted documentation, GreatWest Mutual is prepared to offer a settlement of $28,400 for claim CLM-2041 subject to receipt of sworn proof of loss…',
    tag: 'Settlement offer', tagKind: 'red', important: true,
  },
  {
    id: 6, dir: 'out', date: 'Apr 23, 2026 · 10:30 AM',
    from: 'Maya Okafor', to: 'J. Halloran · GreatWest',
    subject: 'Settlement Reconsideration — CLM-2041 (Lumen & Loaf, 3/11/2026 fire)',
    preview: "I am writing to formally dispute GreatWest Mutual's April 4 settlement offer of $28,400 for claim CLM-2041. Three issues require correction: §4.2 replacement cost, §3.4 smoke scope, §5.1 income method…",
    tag: 'Rebuttal', tagKind: 'navy', via: 'Shielded', draft: false,
  },
];

function ThreadItem({ msg, selected, onClick }) {
  const isOut = msg.dir === 'out';
  return (
    <div onClick={onClick} style={{
      padding: '14px 20px', cursor: 'pointer',
      background: selected ? '#eef2fb' : 'transparent',
      borderLeft: `3px solid ${selected ? 'var(--navy)' : isOut ? 'var(--navy-soft)' : 'transparent'}`,
      borderBottom: '1px solid var(--line)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      transition: 'background .1s',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flex: 'none',
        background: isOut ? 'var(--navy)' : 'var(--bg-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, color: isOut ? '#fff' : 'var(--ink-3)',
      }}>
        {isOut ? 'MO' : 'GW'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: isOut ? 'var(--navy)' : 'var(--ink)' }}>
            {isOut ? 'You (via Shielded)' : msg.from}
          </span>
          <span className={`pill pill-${msg.tagKind}`} style={{ fontSize: 10 }}>{msg.tag}</span>
          {msg.important && <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 600 }}>!</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.subject}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 4 }}>{msg.date}</div>
      </div>
    </div>
  );
}

function Correspondence() {
  const [selected, setSelected] = React.useState(5);
  const msg = THREAD[selected];
  const isOut = msg?.dir === 'out';

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }} className="shielded-root">
      <Sidebar active="claims"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title="Correspondence" subtitle="CLM-2041 · Fire & Smoke · 6 messages"
          crumbs={['Claims', 'CLM-2041', 'Correspondence']}
          right={<button className="btn btn-primary btn-sm"><Icons.Sparkle size={12}/> Draft next response</button>}/>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Thread list */}
          <div style={{ width: 340, flex: 'none', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg-subtle)', display: 'flex', gap: 8, alignItems: 'center', flex: 'none' }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, flex: 1 }}>CLM-2041 thread</div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{THREAD.length} messages</span>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {THREAD.map((m, i) => (
                <ThreadItem key={m.id} msg={m} selected={i === selected} onClick={() => setSelected(i)}/>
              ))}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--bg-subtle)' }}>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <Icons.Sparkle size={12}/> Draft response with AI
              </button>
            </div>
          </div>

          {/* Message detail */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {msg && (
              <>
                {/* Message header */}
                <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line)', flex: 'none', background: isOut ? '#f8f9ff' : 'var(--bg)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isOut ? 'var(--navy)' : 'var(--bg-subtle)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 13, fontWeight: 600, color: isOut ? '#fff' : 'var(--ink-3)' }}>
                      {isOut ? 'MO' : 'GW'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{msg.subject}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                        <span><strong style={{ color: 'var(--ink-2)' }}>From:</strong> {isOut ? 'Maya Okafor · Lumen & Loaf' : msg.from}</span>
                        <span><strong style={{ color: 'var(--ink-2)' }}>To:</strong> {isOut ? 'J. Halloran · GreatWest Mutual' : 'Maya Okafor'}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 3 }}>{msg.date}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={`pill pill-${msg.tagKind}`}>{msg.tag}</span>
                      {isOut && <span className="pill pill-teal" style={{ fontSize: 10 }}><Icons.Check size={9} style={{ strokeWidth: 3 }}/> Sent</span>}
                    </div>
                  </div>

                  {isOut && msg.via && (
                    <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: '#eef2fb', borderRadius: 8, alignItems: 'center', fontSize: 12, color: 'var(--navy)' }}>
                      <ShieldedMark size={14} color="var(--navy)"/>
                      <span>Drafted and sent via <strong>Shielded</strong> · Clause references: §4.2, §3.4, §5.1</span>
                    </div>
                  )}
                </div>

                {/* Message body */}
                <div style={{ flex: 1, overflow: 'auto', padding: '28px 28px 20px' }}>
                  <div style={{ maxWidth: 620, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 14, lineHeight: 1.8, color: '#1a1a1a' }}>
                    {selected === 5 ? (
                      <>
                        <p>Dear Mr. Halloran,</p>
                        <p>I am writing to formally dispute GreatWest Mutual's April 4 settlement offer of $28,400 for claim CLM-2041, the fire and smoke damage event at Lumen & Loaf on March 11, 2026. Three issues in the adjustment require correction.</p>
                        <p><strong>1. Replacement cost basis (§4.2)</strong><br/>Your adjuster applied actual-cash-value depreciation to the commercial hood system and convection oven. Policy §4.2 "Equipment — Replacement Cost Endorsement" explicitly requires replacement cost valuation for all commercial kitchen equipment in active use. The ACV deduction amounts to $9,200 in under-recovery.</p>
                        <p><strong>2. Smoke remediation scope (§3.4)</strong><br/>The estimate excludes HVAC duct cleaning ($2,800) and soft goods deodorization ($1,600). Policy §3.4 covers remediation of all surfaces and mechanical systems reached by smoke. Both items fall within covered scope.</p>
                        <p><strong>3. Business income calculation (§5.1)</strong><br/>Income loss was calculated using February 2026 as the base month. Policy §5.1 requires a 12-month trailing average for seasonal operations. The trailing average method adds $3,800 to the recoverable income figure.</p>
                        <p>Based on the above, I am requesting a revised offer of <strong>$47,800</strong>, consistent with the fair-settlement midpoint supported by seven comparable NC restaurant fire claims (2025–2026).</p>
                        <p>I am happy to provide additional supporting documentation for any of the above items. Please respond within 10 business days per NC §58-63-15.</p>
                        <p>Sincerely,<br/>Maya Okafor<br/>Owner, Lumen & Loaf</p>
                      </>
                    ) : (
                      <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--f-sans)', fontSize: 13.5, lineHeight: 1.7 }}>{msg.preview}</p>
                    )}
                  </div>
                </div>

                {/* Reply bar */}
                <div style={{ padding: '14px 28px', borderTop: '1px solid var(--line)', background: 'var(--bg-subtle)', display: 'flex', gap: 10, alignItems: 'center', flex: 'none' }}>
                  <button className="btn btn-primary"><Icons.Sparkle size={13}/> Draft reply with AI</button>
                  <button className="btn btn-ghost"><Icons.Copy size={13}/> Copy message</button>
                  <button className="btn btn-ghost"><Icons.Download size={13}/> Save as PDF</button>
                  <div style={{ flex: 1 }}/>
                  <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>CLM-2041 · Claim thread</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Correspondence });
