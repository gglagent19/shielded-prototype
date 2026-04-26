// BrokerLanding.jsx — "For brokers" marketing landing page

const BROKER_FEATURES = [
  {
    icon: 'Building', title: 'Multi-client dashboard',
    body: 'See every client\'s active claims, coverage scores, and open recovery gaps in one view. No spreadsheets.',
  },
  {
    icon: 'FileText', title: 'White-label reports',
    body: 'Send clients a branded claim analysis PDF. Looks like it came from your brokerage — because it did.',
  },
  {
    icon: 'TrendUp',  title: 'Benchmark database access',
    body: 'Compare any settlement against real, comparable claims in your state. Sourced from restoration contractors.',
  },
  {
    icon: 'Sparkle',  title: 'AI negotiation drafts',
    body: 'Draft a rebuttal for any client in 60 seconds. Anchored in their specific policy language and clause citations.',
  },
  {
    icon: 'Bell',     title: 'Deadline alerts for every client',
    body: 'Never miss a proof-of-loss or response-window deadline again. Alerts go to you and your client simultaneously.',
  },
  {
    icon: 'User',     title: 'Referral revenue program',
    body: 'Earn 20% recurring revenue for every client you bring to Shielded. Paid monthly. No cap.',
  },
];

const BROKER_TESTIMONIALS = [
  {
    name: 'James Wilkinson', firm: 'Wilkinson & Greer', initials: 'JW', location: 'Cary, NC',
    quote: 'Before Shielded, we\'d get a call from a client who\'d already accepted a low settlement. Now we catch the gap before they sign anything.',
    stat: '14 clients', statSub: 'across 3 states',
  },
  {
    name: 'Sandra Torres', firm: 'Torres Commercial', initials: 'ST', location: 'Charlotte, NC',
    quote: 'The white-label reports are the best client deliverable I\'ve ever had. My clients think I built this myself.',
    stat: '$340k', statSub: 'recovered for clients this year',
  },
];

function BrokerLanding() {
  return (
    <div style={{ background: 'var(--bg)', overflow: 'auto', height: '100%' }}>
      {/* Nav */}
      <div style={{ padding: '18px 48px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 28, background: 'var(--bg-card)' }}>
        <ShieldedLogo size={18} color="var(--ink)"/>
        <div style={{ display: 'flex', gap: 22, fontSize: 13, color: 'var(--ink-2)', marginLeft: 12 }}>
          {['How it works', 'For brokers', 'Pricing', 'Claim stories', 'Resources'].map(item => (
            <span key={item} style={{ cursor: 'pointer', fontWeight: item === 'For brokers' ? 600 : 400, color: item === 'For brokers' ? 'var(--ink)' : 'var(--ink-2)' }}>{item}</span>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-quiet btn-sm">Sign in</button>
        <button className="btn btn-primary btn-sm">Book a demo <Icons.Arrow size={11}/></button>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 48px' }}>
        {/* Hero */}
        <div style={{ padding: '72px 0 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="pill pill-navy" style={{ marginBottom: 20, display: 'inline-flex' }}>
              <span className="dot" style={{ background: 'var(--navy)' }}/> Built for independent brokers
            </div>
            <h1 className="serif" style={{ margin: '0 0 18px', fontSize: 54, lineHeight: 1.0, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
              Your clients deserve what their policy <em style={{ color: 'var(--navy)', fontStyle: 'italic' }}>actually owes.</em>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.65, margin: '0 0 28px', maxWidth: 460 }}>
              Shielded gives independent brokerages the tools to catch underpaid claims, generate negotiation-ready rebuttals, and deliver branded reports — without a public adjuster license.
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <button className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 14 }}>
                Book a demo <Icons.Arrow size={13}/>
              </button>
              <button className="btn btn-ghost" style={{ padding: '13px 20px', fontSize: 14 }}>
                See pricing
              </button>
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: 'var(--ink-4)' }}>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.CheckCircle size={13} style={{ color: 'var(--teal)' }}/> No adjuster license needed</span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.CheckCircle size={13} style={{ color: 'var(--teal)' }}/> White-label ready</span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.CheckCircle size={13} style={{ color: 'var(--teal)' }}/> 20% referral revenue</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--sh-lg)' }}>
            {/* Mini broker dashboard */}
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <ShieldedMark size={14} color="var(--navy)"/>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Wilkinson & Greer · 14 clients</span>
              <span className="mono" style={{ fontSize: 10, padding: '2px 6px', background: 'var(--navy)', color: '#fff', borderRadius: 99, marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Broker</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                {[['Active claims','3','amber'],['Total gap','$47k','red'],['Clients','14','neutral']].map(([l,v,c])=>(
                  <div key={l} style={{ padding:'10px 12px', background:'var(--bg-card)', borderRadius:8, border:'1px solid var(--line)', textAlign:'center' }}>
                    <div className="eyebrow" style={{ fontSize:9, marginBottom:4 }}>{l}</div>
                    <div className="serif num-t" style={{ fontSize:20, color:`var(--${c==='neutral'?'ink':c})` }}>{v}</div>
                  </div>
                ))}
              </div>
              {[
                { name:'Lumen & Loaf',       flag:'Negotiating', gap:'+$19.4k', kind:'amber' },
                { name:'Nomad Coffee Co.',   flag:'In review',   gap:'+$8.2k',  kind:'navy' },
                { name:'Silver Lake Bakery', flag:'—',           gap:'—',       kind:'neutral' },
              ].map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 10px', background:'var(--bg-subtle)', borderRadius:6, marginBottom:4, fontSize:12.5 }}>
                  <span style={{ flex:1, fontWeight:500 }}>{r.name}</span>
                  <span className={`pill pill-${r.kind}`} style={{ fontSize:10 }}>{r.flag}</span>
                  <span className="serif num-t" style={{ fontSize:14, color:`var(--${r.kind==='neutral'?'ink-4':r.kind})` }}>{r.gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ padding: '56px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Enterprise tools</div>
            <h2 className="serif" style={{ margin: '0 0 10px', fontSize: 38, letterSpacing: '-0.02em' }}>
              Everything your brokerage needs.
            </h2>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 480, margin: '0 auto' }}>
              Built on the same analysis engine that powers individual policies — expanded for multi-client operations.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {BROKER_FEATURES.map(f => {
              const I = Icons[f.icon];
              return (
                <div key={f.title} className="card" style={{ padding: 22 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <I size={18} style={{ color: 'var(--navy)' }}/>
                  </div>
                  <div className="serif" style={{ fontSize: 18, letterSpacing: '-0.01em', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{f.body}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ padding: '48px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {BROKER_TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: 28 }}>
                <Icons.Quote size={24} style={{ color: 'var(--navy)', opacity: 0.3, marginBottom: 12 }}/>
                <div className="serif" style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ink)', marginBottom: 18 }}>
                  {t.quote}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{t.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{t.firm} · {t.location}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="serif num-t" style={{ fontSize: 22, color: 'var(--teal)' }}>{t.stat}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{t.statSub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing callout */}
        <div className="card" style={{ padding: '40px 48px', marginBottom: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-subtle))' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Enterprise pricing</div>
            <h2 className="serif" style={{ margin: '0 0 12px', fontSize: 32, letterSpacing: '-0.015em' }}>Custom pricing for brokerages.</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, margin: '0 0 22px' }}>
              Enterprise plans start at 5 clients and scale to unlimited. Includes white-label reports, API access, dedicated success manager, and referral revenue share.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ padding: '12px 20px' }}>Book a demo <Icons.Arrow size={12}/></button>
              <button className="btn btn-ghost" style={{ padding: '12px 20px' }}>Talk to sales</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['5 clients', 'from $299/mo'],
              ['25 clients', 'from $699/mo'],
              ['Unlimited', 'Custom — contact us'],
            ].map(([tier, price]) => (
              <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--line)', fontSize: 13.5 }}>
                <span style={{ fontWeight: 500 }}>{tier}</span>
                <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 12.5 }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BrokerLanding });
