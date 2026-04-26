// Auth.jsx — sign in, sign up, and forgot password screens

function AuthShell({ children, wide }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* Left panel — form */}
      <div style={{
        flex: wide ? '0 0 560px' : '0 0 480px',
        display: 'flex', flexDirection: 'column',
        padding: '48px 56px',
        borderRight: '1px solid var(--line)',
        overflow: 'auto',
      }}>
        <ShieldedLogo size={20} color="var(--ink)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.6 }}>
          Shielded is a policyholder advocacy tool. Not a law firm or licensed public adjuster.
          <br/>© 2026 Shielded, Inc. · <span style={{ color: 'var(--navy)', cursor: 'pointer' }}>Privacy</span> · <span style={{ color: 'var(--navy)', cursor: 'pointer' }}>Terms</span>
        </div>
      </div>

      {/* Right panel — proof */}
      <div style={{
        flex: 1, background: 'var(--bg-subtle)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '64px 56px',
        gap: 32,
      }}>
        {/* Claim outcome card */}
        <div className="card" style={{ padding: 28, maxWidth: 460 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span className="pill pill-red"><Icons.Alert size={9}/> Offer: $28,400</span>
            <Icons.Arrow size={14} style={{ color: 'var(--ink-4)', alignSelf: 'center' }}/>
            <span className="pill pill-teal"><Icons.Check size={9}/> Settled: $46,200</span>
          </div>
          <div className="serif" style={{ fontSize: 20, lineHeight: 1.4, color: 'var(--ink)' }}>
            "Three clauses I'd never have found myself. We recovered <strong style={{ color: 'var(--teal)' }}>$17,800</strong> more than the adjuster offered."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>MO</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Maya Okafor</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Lumen & Loaf · Asheville, NC</div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { v: '$14,200', l: 'avg. recovery uplift' },
            { v: '2,400+',  l: 'small businesses' },
            { v: '68%',     l: 'settle after 1 rebuttal' },
          ].map(s => (
            <div key={s.l}>
              <div className="serif num-t" style={{ fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{s.v}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-4)' }}>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.Lock size={13}/> SOC 2 Type II</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.Shield size={13}/> Never shared with insurers</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icons.CheckCircle size={13}/> AES-256 encrypted</span>
        </div>
      </div>
    </div>
  );
}

function SignIn() {
  return (
    <AuthShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 32 }}>
        <div className="eyebrow">Welcome back</div>
        <h1 className="serif" style={{ margin: 0, fontSize: 36, letterSpacing: '-0.02em' }}>Sign in to Shielded</h1>
        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
          Don't have an account? <span style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Start free →</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SSO */}
        <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '11px', fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Email</label>
          <input defaultValue="maya@lumenandloaf.com" style={{ width: '100%' }}/>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ fontSize: 12, color: 'var(--ink-3)' }}>Password</label>
            <span style={{ fontSize: 12, color: 'var(--navy)', cursor: 'pointer' }}>Forgot password?</span>
          </div>
          <input type="password" defaultValue="••••••••••••" style={{ width: '100%' }}/>
        </div>

        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px', fontSize: 13, marginTop: 4 }}>
          Sign in <Icons.Arrow size={13}/>
        </button>
      </div>
    </AuthShell>
  );
}

function SignUp() {
  const [plan, setPlan] = React.useState('premium');
  return (
    <AuthShell wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
        <div className="eyebrow">Free to start</div>
        <h1 className="serif" style={{ margin: 0, fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Protect your next claim<br/>before it starts.
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          Already have an account? <span style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Sign in →</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Business name</label>
            <input placeholder="e.g. Lumen & Loaf" style={{ width: '100%' }}/>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Business type</label>
            <input placeholder="e.g. Restaurant" style={{ width: '100%' }}/>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Work email</label>
          <input placeholder="you@yourbusiness.com" style={{ width: '100%' }}/>
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Password</label>
          <input type="password" placeholder="Min. 8 characters" style={{ width: '100%' }}/>
        </div>

        {/* Plan picker */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>Start with</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'basic',   label: 'Basic',   price: '$50/mo', note: 'Policy analysis + guidance' },
              { id: 'premium', label: 'Premium', price: '$150/mo', note: 'Full advocacy + AI drafts', popular: true },
            ].map(p => (
              <button key={p.id} onClick={() => setPlan(p.id)} style={{
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                border: plan === p.id ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                background: plan === p.id ? '#eef2fb' : 'var(--bg-card)',
                position: 'relative',
              }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: -8, right: 10, background: 'var(--navy)', color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 99, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: plan === p.id ? 'var(--navy)' : 'var(--ink)' }}>{p.label}</div>
                <div className="serif num-t" style={{ fontSize: 18, color: plan === p.id ? 'var(--navy)' : 'var(--ink)', marginTop: 2 }}>{p.price}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>{p.note}</div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', fontSize: 13, marginTop: 4 }}>
          Start {plan === 'premium' ? 'Premium' : 'Basic'} · free first policy analysis <Icons.Arrow size={13}/>
        </button>

        <div style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'center' }}>
          Cancel anytime. No card required for Basic.
        </div>
      </div>
    </AuthShell>
  );
}

function ForgotPassword() {
  const [sent, setSent] = React.useState(false);
  return (
    <AuthShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 32 }}>
        <div className="eyebrow">Account recovery</div>
        <h1 className="serif" style={{ margin: 0, fontSize: 34, letterSpacing: '-0.02em' }}>
          {sent ? 'Check your email' : 'Reset your password'}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          {sent ? 'We sent a reset link to maya@lumenandloaf.com. It expires in 15 minutes.' : 'We\'ll send a reset link to your registered email address.'}
        </div>
      </div>

      {!sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>Email</label>
            <input defaultValue="maya@lumenandloaf.com" style={{ width: '100%' }}/>
          </div>
          <button className="btn btn-primary" onClick={() => setSent(true)} style={{ justifyContent: 'center', padding: '11px', fontSize: 13 }}>
            Send reset link <Icons.Arrow size={13}/>
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 16, background: 'var(--teal-soft)', borderColor: 'var(--teal)', display: 'flex', gap: 12 }}>
            <Icons.CheckCircle size={18} style={{ color: 'var(--teal)', flex: 'none' }}/>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Email sent. Check your spam folder if it doesn't arrive within a minute.</div>
          </div>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>Resend email</button>
          <button className="btn btn-quiet" style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in
          </button>
        </div>
      )}
    </AuthShell>
  );
}

Object.assign(window, { SignIn, SignUp, ForgotPassword });
