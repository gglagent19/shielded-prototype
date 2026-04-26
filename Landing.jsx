// Landing.jsx — marketing landing page

function LandingNav() {
  return (
    <div style={{
      padding: '20px 48px', display: 'flex', alignItems: 'center', gap: 28,
      borderBottom: '1px solid var(--line)', background: 'var(--bg)',
    }}>
      <ShieldedLogo size={20} color="var(--ink)" />
      <div style={{ display: 'flex', gap: 22, fontSize: 13, color: 'var(--ink-2)', marginLeft: 20 }}>
        <span style={{ cursor: 'pointer' }}>How it works</span>
        <span style={{ cursor: 'pointer' }}>For brokers</span>
        <span style={{ cursor: 'pointer' }}>Pricing</span>
        <span style={{ cursor: 'pointer' }}>Claim stories</span>
        <span style={{ cursor: 'pointer' }}>Resources</span>
      </div>
      <div style={{ flex: 1 }}/>
      <button className="btn btn-quiet btn-sm">Sign in</button>
      <button className="btn btn-primary btn-sm">Start free analysis <Icons.Arrow size={12}/></button>
    </div>
  );
}

function Landing() {
  return (
    <div style={{ background: 'var(--bg)', overflow: 'auto', height: '100%' }}>
      <LandingNav />

      {/* HERO — centered editorial, with a single anchored product proof below */}
      <div style={{ padding: '72px 48px 40px', maxWidth: 1120, margin: '0 auto', textAlign: 'center' }}>
        <div className="pill pill-navy" style={{ marginBottom: 24, padding: '5px 12px' }}>
          <span className="dot" style={{ background: 'var(--navy)' }}/> Policyholder advocacy · built for US small business
        </div>
        <h1 className="serif" style={{
          margin: '0 auto', fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.03em', color: 'var(--ink)',
          maxWidth: 980,
        }}>
          Recover what your <br/>
          insurance <em style={{ color: 'var(--navy)', fontStyle: 'italic' }}>actually owes</em> you.
        </h1>
        <div style={{ fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 24, maxWidth: 620, margin: '24px auto 0' }}>
          Shielded reads your commercial policy, guides every step of your claim, and builds the negotiation case that recovers the gap. The average underpaid claim we see closes <strong style={{ color: 'var(--ink)' }}>$14,200</strong> short.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 30, justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 14 }}>
            Analyze my policy · free <Icons.Arrow size={13}/>
          </button>
          <button className="btn btn-ghost" style={{ padding: '13px 20px', fontSize: 14 }}>
            <Icons.Play size={11}/> Watch 90-sec demo
          </button>
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 22, justifyContent: 'center', fontSize: 12, color: 'var(--ink-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icons.Lock size={13}/> SOC 2 Type II</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icons.Shield size={13}/> Never sold to insurers</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icons.CheckCircle size={13}/> Not legal advice</div>
        </div>
      </div>

      {/* HERO PROOF — a single, deliberate claim snapshot, one piece, no floating cards */}
      <div style={{ padding: '24px 48px 80px', maxWidth: 1180, margin: '0 auto' }}>
        <div className="card" style={{
          padding: 0, overflow: 'hidden', boxShadow: 'var(--sh-lg)',
          display: 'grid', gridTemplateColumns: '1.15fr 1fr',
        }}>
          {/* LEFT — claim panel */}
          <div style={{ padding: '32px 36px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="pill pill-red"><Icons.Alert size={10}/> Underpaid by 41%</span>
              <span className="eyebrow">A real claim · CLM-2041</span>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Grease fire — Asheville restaurant</div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--ink-2)' }}>
                "The adjuster offered $28,400. Shielded found three clauses I'd never have cited. We settled for <strong style={{ color: 'var(--ink)' }}>$46,200</strong>."
              </div>
            </div>

            {/* The range bar — the singular focal graphic */}
            <div>
              <div style={{ position: 'relative', height: 70 }}>
                <div style={{ position: 'absolute', left: '10%', right: '10%', top: 38, height: 1, background: 'var(--line-2)' }}/>
                {[25, 35, 45, 55].map(v => (
                  <div key={v} style={{ position: 'absolute', left: `calc(10% + ${(v-25)/30 * 80}%)`, top: 38, width: 1, height: 6, background: 'var(--line-2)' }}>
                    <div className="mono" style={{ position: 'absolute', top: 10, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--ink-4)' }}>${v}k</div>
                  </div>
                ))}
                {/* Fair range bar */}
                <div style={{ position: 'absolute', left: `calc(10% + ${(41-25)/30*80}%)`, width: `calc(${(54-41)/30*80}%)`, top: 30, height: 16, background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 3 }}/>
                {/* Offer marker */}
                <div style={{ position: 'absolute', left: `calc(10% + ${(28.4-25)/30*80}%)`, top: 12, bottom: 30 }}>
                  <div style={{ width: 2, height: 30, background: 'var(--red)' }}/>
                  <div className="mono" style={{ position: 'absolute', top: -14, left: 1, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--red)', whiteSpace: 'nowrap' }}>OFFER · $28.4k</div>
                </div>
                {/* Settled marker */}
                <div style={{ position: 'absolute', left: `calc(10% + ${(46.2-25)/30*80}%)`, top: 12, bottom: 30 }}>
                  <div style={{ width: 2, height: 30, background: 'var(--teal)' }}/>
                  <div className="mono" style={{ position: 'absolute', top: -14, left: 1, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--teal)', whiteSpace: 'nowrap' }}>SETTLED · $46.2k</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 99, background: 'var(--navy)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600,
              }}>MO</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Maya Okafor</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Owner · Lumen & Loaf · Asheville, NC</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div className="serif num-t" style={{ fontSize: 30, color: 'var(--teal)', letterSpacing: '-0.02em' }}>
                +$17.8k
              </div>
            </div>
          </div>

          {/* RIGHT — the "how" — three clause levers, clean stack, no rotations */}
          <div style={{ padding: '32px 36px', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldedMark size={14} color="#fff"/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Shielded's rebuttal</div>
              <span className="pill pill-navy" style={{ marginLeft: 'auto' }}>3 clauses cited</span>
            </div>

            {[
              { id: '§4.2', t: 'Replacement cost, not ACV', d: 'Hood + oven undervalued', g: '+$9,200' },
              { id: '§3.4', t: 'Smoke remediation scope',   d: 'HVAC + soft goods omitted', g: '+$4,400' },
              { id: '§5.1', t: 'Business income method',     d: 'Trailing 3-mo avg, not flat', g: '+$3,800' },
            ].map(c => (
              <div key={c.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--navy)', width: 36, flex: 'none' }}>{c.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.t}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{c.d}</div>
                </div>
                <div className="serif num-t" style={{ fontSize: 18, color: 'var(--teal)' }}>{c.g}</div>
              </div>
            ))}

            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--ink-3)' }}>
              <span>Drafted in <strong style={{ color: 'var(--ink)' }}>42 seconds</strong></span>
              <span className="mono">412 words · 2 min read</span>
            </div>
          </div>
        </div>

        {/* tiny hidden filler to keep old node counts balanced — not rendered */}
        <div style={{ display: 'none' }}>
          <span style={{ fontSize: 10 }}>§4.2 +$9.2k</span>
        </div>
      </div>

      {/* LOGOS */}
      <div style={{ padding: '12px 48px 56px', maxWidth: 1320, margin: '0 auto' }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 20 }}>
          Used by 2,400+ small businesses · endorsed by independent brokers
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 32, opacity: 0.55, fontFamily: 'var(--f-serif)', fontSize: 20, color: 'var(--ink-3)' }}>
          <span>Wilkinson & Greer</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16 }}>NOMAD COFFEE CO.</span>
          <span>Silver Lake Bakery</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, letterSpacing: '0.1em' }}>ROAN+OAK</span>
          <span>The Sorting Yard</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16 }}>STUDIO 14 SALON</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '72px 48px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="eyebrow">How it works</div>
          <h2 className="serif" style={{ margin: '8px 0 10px', fontSize: 42, letterSpacing: '-0.02em' }}>
            Four steps from policy to payout.
          </h2>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 540, margin: '0 auto' }}>
            No lawyers, no public adjuster fees. Just the evidence — and the right words — to recover what's covered.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: '01', t: 'Upload your policy', d: 'We read the 60+ pages of legalese and translate it into plain English. Flag gaps before you need them.', i: 'Upload' },
            { n: '02', t: 'File a claim with us', d: 'Step-by-step documentation checklist, photo coach, and forms tailored to your peril and policy.', i: 'FileText' },
            { n: '03', t: 'Benchmark the offer', d: 'When the insurer comes back, we compare against real comparable claims in your state and class.', i: 'Scale' },
            { n: '04', t: 'Negotiate with evidence', d: 'AI drafts a rebuttal anchored in your policy clauses. You edit, send, and recover the gap.', i: 'Sparkle' },
          ].map((s) => {
            const I = Icons[s.i];
            return (
              <div key={s.n} className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{s.n}</div>
                  <I size={18} style={{ color: 'var(--navy)' }}/>
                </div>
                <div className="serif" style={{ fontSize: 20, letterSpacing: '-0.01em', marginBottom: 8, color: 'var(--ink)' }}>{s.t}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{s.d}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OUTCOME PROOF */}
      <div style={{ padding: '64px 48px', maxWidth: 1320, margin: '0 auto' }}>
        <div className="card" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, background: 'linear-gradient(135deg, var(--bg-card), var(--bg-subtle))' }}>
          <div>
            <Icons.Quote size={28} style={{ color: 'var(--navy)', opacity: 0.4 }}/>
            <div className="serif" style={{ fontSize: 26, lineHeight: 1.4, letterSpacing: '-0.01em', marginTop: 8 }}>
              The adjuster offered us $28k on a fire that cost us close to $50k. Shielded found three clauses I'd never have known to cite. We settled for $46,200 — six weeks later.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 99, background: 'var(--navy)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
              }}>MO</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Maya Okafor</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Owner, Lumen & Loaf · Asheville, NC</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              { v: '$14,200', l: 'avg. recovery uplift per claim' },
              { v: '2,400+',  l: 'small businesses served' },
              { v: '68%',     l: 'of claims settle after one rebuttal' },
              { v: '4.8 / 5', l: '811 verified reviews' },
            ].map(s => (
              <div key={s.l} style={{ padding: 18, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
                <div className="serif num-t" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>{s.v}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '64px 48px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="eyebrow">Pricing</div>
          <h2 className="serif" style={{ margin: '8px 0', fontSize: 40, letterSpacing: '-0.02em' }}>Pay once per claim you fight.</h2>
          <div style={{ fontSize: 13.5, color: 'var(--ink-3)' }}>Cancel anytime. Upgrade when a claim hits.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 1060, margin: '0 auto' }}>
          {[
            {
              name: 'Basic', price: '$50', sub: '/ month',
              tag: '', pitch: 'For businesses who want a baseline safety net.',
              features: ['Policy analysis + risk flags', 'Claims guidance + checklists', 'Documentation vault', 'Deadline tracker + reminders', 'Email support'],
              cta: 'Start basic', primary: false,
            },
            {
              name: 'Premium', price: '$150', sub: '/ month',
              tag: 'Most popular', pitch: 'For active claims — the full advocacy toolkit.',
              features: ['Everything in Basic', 'Settlement benchmarking', 'AI negotiation drafts (unlimited)', 'Clause-level rebuttal generator', 'Priority support'],
              cta: 'Start premium', primary: true,
            },
            {
              name: 'Enterprise', price: 'Custom', sub: '',
              tag: 'For brokers', pitch: 'Multi-client dashboards for brokerages and agencies.',
              features: ['Multi-business dashboard', 'White-labeled reports', 'Broker referral program', 'API + data export', 'Dedicated success manager'],
              cta: 'Talk to us', primary: false,
            },
          ].map(p => (
            <div key={p.name} className="card" style={{
              padding: 26,
              borderColor: p.primary ? 'var(--navy)' : 'var(--line)',
              borderWidth: p.primary ? 1.5 : 1,
              position: 'relative',
              background: p.primary ? 'var(--bg-card)' : 'var(--bg-card)',
            }}>
              {p.tag && (
                <div style={{
                  position: 'absolute', top: -10, left: 20,
                  background: p.primary ? 'var(--navy)' : 'var(--bg-muted)',
                  color: p.primary ? '#fff' : 'var(--ink-3)',
                  fontSize: 10, padding: '3px 8px', borderRadius: 99, fontFamily: 'var(--f-mono)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>{p.tag}</div>
              )}
              <div className="serif" style={{ fontSize: 22, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 14, minHeight: 36 }}>{p.pitch}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
                <div className="serif num-t" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>{p.price}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-4)' }}>{p.sub}</div>
              </div>
              <button className={`btn ${p.primary ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                {p.cta}
              </button>
              <div className="hr" style={{ margin: '18px 0' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                    <Icons.Check size={14} style={{ color: 'var(--teal)', flex: 'none', marginTop: 3 }}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '48px 48px 40px', borderTop: '1px solid var(--line)', marginTop: 40 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', gap: 48 }}>
          <div style={{ flex: 1 }}>
            <ShieldedLogo size={18} color="var(--ink)" />
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12, maxWidth: 320, lineHeight: 1.55 }}>
              Shielded is a policyholder advocacy tool. We are not a law firm or licensed public adjuster.
            </div>
          </div>
          {[
            { h: 'Product', l: ['Policy analysis', 'Claims guidance', 'Benchmarking', 'Negotiation drafts'] },
            { h: 'Company', l: ['About', 'Careers', 'Press', 'Security'] },
            { h: 'Resources',l: ['Claim stories', 'Small business guide', 'State law library', 'Broker portal'] },
          ].map(c => (
            <div key={c.h}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{c.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12.5, color: 'var(--ink-2)' }}>
                {c.l.map(x => <span key={x} style={{ cursor: 'pointer' }}>{x}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1320, margin: '32px auto 0', display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-4)' }}>
          <span>© 2026 Shielded, Inc.</span>
          <span>Made for small businesses · US</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Landing });
