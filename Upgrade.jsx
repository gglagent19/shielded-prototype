// Upgrade.jsx — paywall modal + full upgrade page

const PLAN_FEATURES = {
  basic: {
    name: 'Basic', price: '$50', sub: '/month',
    features: [
      { label: 'Policy analysis + risk flags', included: true },
      { label: 'Claims guidance + documentation', included: true },
      { label: 'Deadline tracker + reminders', included: true },
      { label: 'Document vault', included: true },
      { label: 'Email support', included: true },
      { label: 'Settlement benchmarking', included: false },
      { label: 'AI negotiation drafts', included: false },
      { label: 'Clause-level rebuttal generator', included: false },
      { label: 'Comparable claims database', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  premium: {
    name: 'Premium', price: '$150', sub: '/month',
    features: [
      { label: 'Everything in Basic', included: true },
      { label: 'Settlement benchmarking', included: true },
      { label: 'AI negotiation drafts (unlimited)', included: true },
      { label: 'Clause-level rebuttal generator', included: true },
      { label: 'Comparable claims database', included: true },
      { label: 'Priority support', included: true },
    ],
  },
};

// ─── Paywall modal (shown inline when Basic user hits locked feature) ─
function PaywallModal() {
  const lockedFeature = 'Settlement benchmarking';
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-subtle)' }}>
      {/* Blurred background preview */}
      <div style={{ position: 'relative', maxWidth: 780, width: '100%' }}>
        {/* Blurred benchmark preview */}
        <div style={{ filter: 'blur(3px)', pointerEvents: 'none', opacity: 0.4, padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--line)' }}>
          <div style={{ height: 22, background: 'var(--bg-muted)', borderRadius: 4, width: '40%', marginBottom: 12 }}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 80, background: 'var(--bg-muted)', borderRadius: 8 }}/>)}
          </div>
          <div style={{ height: 120, background: 'var(--bg-muted)', borderRadius: 8, marginBottom: 12 }}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: 16, background: 'var(--bg-muted)', borderRadius: 3, width: `${85-i*10}%` }}/>)}
          </div>
        </div>

        {/* Overlay card */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="card" style={{ padding: 36, maxWidth: 440, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(20,24,31,0.15)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icons.Lock size={24} style={{ color: '#fff' }}/>
            </div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Premium feature</div>
            <h3 className="serif" style={{ margin: '0 0 10px', fontSize: 26, letterSpacing: '-0.015em' }}>
              {lockedFeature}
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Your current Basic plan includes policy analysis and claims guidance. Upgrade to Premium to access settlement benchmarking, AI negotiation drafts, and comparable claims data.
            </p>

            {/* Value proof */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
              {[
                { v: '$14,200', l: 'avg. uplift' },
                { v: '68%',     l: 'settle in 1 rebuttal' },
                { v: '7 comps', l: 'per claim' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div className="serif num-t" style={{ fontSize: 22, color: 'var(--navy)' }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, marginBottom: 10 }}>
              Upgrade to Premium · $150/mo <Icons.Arrow size={13}/>
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
              View all Premium features
            </button>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 10 }}>
              Cancel anytime · Upgrade takes effect immediately
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Full upgrade page ───────────────────────────────────────────
function UpgradePage() {
  const [billing, setBilling] = React.useState('monthly');
  const prices = { basic: { monthly: 50, annual: 42 }, premium: { monthly: 150, annual: 127 } };

  const FeatureRow = ({ label, basic, premium }) => (
    <tr style={{ borderBottom: '1px solid var(--line)' }}>
      <td style={{ padding: '11px 0', fontSize: 13, color: 'var(--ink-2)' }}>{label}</td>
      <td style={{ padding: '11px 16px', textAlign: 'center' }}>
        {basic === true ? <Icons.Check size={16} style={{ color: 'var(--teal)' }}/> :
         basic === false ? <Icons.X size={14} style={{ color: 'var(--line-2)' }}/> :
         <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{basic}</span>}
      </td>
      <td style={{ padding: '11px 16px', textAlign: 'center', background: 'rgba(26,42,74,0.03)' }}>
        {premium === true ? <Icons.Check size={16} style={{ color: 'var(--teal)' }}/> :
         premium === false ? <Icons.X size={14} style={{ color: 'var(--line-2)' }}/> :
         <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{premium}</span>}
      </td>
    </tr>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 48px 48px', display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Upgrade</div>
        <h2 className="serif" style={{ margin: '0 0 10px', fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Get the full negotiation toolkit.
        </h2>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Premium adds benchmarking, AI rebuttal drafts, and clause-level analysis — everything you need to recover the gap on an active claim.
        </div>
      </div>

      {/* Billing toggle */}
      <div style={{ display: 'flex', gap: 0, background: 'var(--bg-subtle)', borderRadius: 99, padding: 3, border: '1px solid var(--line)' }}>
        {[['monthly', 'Monthly'], ['annual', 'Annual · save 15%']].map(([id, label]) => (
          <button key={id} onClick={() => setBilling(id)} style={{
            border: 'none', cursor: 'pointer', padding: '7px 20px', borderRadius: 99, fontFamily: 'var(--f-sans)',
            fontSize: 13, fontWeight: billing === id ? 600 : 400,
            background: billing === id ? 'var(--bg-card)' : 'transparent',
            color: billing === id ? 'var(--ink)' : 'var(--ink-3)',
            boxShadow: billing === id ? 'var(--sh-sm)' : 'none',
            transition: 'all .15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 680, width: '100%' }}>
        {[
          { id: 'basic', name: 'Basic', pitch: 'Policy monitoring + claims guidance.', cta: 'Current plan', primary: false, current: true },
          { id: 'premium', name: 'Premium', pitch: 'Full advocacy toolkit for active claims.', cta: 'Upgrade now', primary: true, current: false },
        ].map(plan => (
          <div key={plan.id} className="card" style={{
            padding: 26, position: 'relative',
            borderColor: plan.primary ? 'var(--navy)' : 'var(--line)',
            borderWidth: plan.primary ? 1.5 : 1,
          }}>
            {plan.primary && (
              <div style={{ position: 'absolute', top: -10, left: 20, background: 'var(--navy)', color: '#fff', fontSize: 10, padding: '3px 10px', borderRadius: 99, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Most popular</div>
            )}
            {plan.current && (
              <div style={{ position: 'absolute', top: -10, left: 20, background: 'var(--bg-muted)', color: 'var(--ink-3)', fontSize: 10, padding: '3px 10px', borderRadius: 99, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current</div>
            )}
            <div className="serif" style={{ fontSize: 22, marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 14, minHeight: 38 }}>{plan.pitch}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
              <div className="serif num-t" style={{ fontSize: 42, letterSpacing: '-0.02em' }}>${prices[plan.id][billing]}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-4)' }}>/month{billing === 'annual' ? ' billed annually' : ''}</div>
            </div>
            <button className={`btn ${plan.primary ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center', padding: '11px', opacity: plan.current ? 0.5 : 1 }} disabled={plan.current}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ maxWidth: 680, width: '100%' }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 16 }}>Feature comparison</div>
        <div className="card" style={{ padding: '0 20px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '12px 0', textAlign: 'left', fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, width: '55%' }}>Feature</th>
                {['Basic', 'Premium'].map(p => (
                  <th key={p} style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, background: p === 'Premium' ? 'rgba(26,42,74,0.03)' : 'transparent' }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Policy analysis + risk flags', true, true],
                ['Claims documentation guidance', true, true],
                ['Deadline tracker', true, true],
                ['Document vault', true, true],
                ['Settlement benchmarking', false, true],
                ['AI negotiation drafts', false, 'Unlimited'],
                ['Comparable claims database', false, true],
                ['Clause-level rebuttal generator', false, true],
                ['Priority support', false, true],
                ['White-label reports (broker)', false, 'Enterprise'],
              ].map(([label, basic, premium]) => (
                <FeatureRow key={label} label={label} basic={basic} premium={premium}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { q: 'Can I upgrade mid-month?', a: 'Yes — you get immediate access and we prorate your first bill.' },
          { q: 'What if my claim settles before the month ends?', a: 'Cancel anytime. You keep access until the end of your billing cycle.' },
          { q: 'Is there a per-claim fee instead?', a: 'Yes — $299 per claim advocacy is available for one-time claims. Contact us.' },
        ].map((faq, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{faq.q}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PaywallModal, UpgradePage });
