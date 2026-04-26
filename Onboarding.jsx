// Onboarding.jsx — first-run wizard after sign-up

function OnboardingStep({ n, label, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 24, height: 24, borderRadius: 99, flex: 'none',
        background: done ? 'var(--teal)' : n === 'active' ? 'var(--navy)' : 'var(--bg-muted)',
        border: done || n === 'active' ? 'none' : '1.5px solid var(--line-2)',
        color: done || n === 'active' ? '#fff' : 'var(--ink-4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600,
      }}>
        {done ? <Icons.Check size={12} style={{ strokeWidth: 3 }}/> : typeof n === 'number' ? n : ''}
      </div>
      <span style={{ fontSize: 13, color: done ? 'var(--ink-3)' : n === 'active' ? 'var(--ink)' : 'var(--ink-4)', fontWeight: n === 'active' ? 500 : 400, textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
    </div>
  );
}

function OnboardingShell({ step, children }) {
  const steps = ['Upload your policy', 'Review coverage', 'You\'re protected'];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Left: narrow step rail */}
      <div style={{
        width: 280, flex: 'none', borderRight: '1px solid var(--line)',
        background: 'var(--bg-card)', padding: '40px 32px',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        <ShieldedLogo size={18} color="var(--navy)" />
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 99, flex: 'none',
                    background: done ? 'var(--teal)' : active ? 'var(--navy)' : 'var(--bg-muted)',
                    border: done || active ? 'none' : '1.5px solid var(--line-2)',
                    color: done || active ? '#fff' : 'var(--ink-4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {done ? <Icons.Check size={12} style={{ strokeWidth: 3 }}/> : n}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    color: done ? 'var(--ink-4)' : active ? 'var(--ink)' : 'var(--ink-4)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 1, height: 24, background: done ? 'var(--teal)' : 'var(--line)', marginLeft: 12, marginTop: 2, marginBottom: 2 }}/>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 500, color: 'var(--ink-2)', marginBottom: 4 }}>Lumen & Loaf</div>
          maya@lumenandloaf.com<br/>Premium plan
        </div>
      </div>

      {/* Right: main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Step 1: Upload policy ────────────────────────────────────────
function OnboardingUpload() {
  const [phase, setPhase] = React.useState('idle');
  const [progress, setProgress] = React.useState(0);

  const run = () => {
    setPhase('uploading'); setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 9; setProgress(Math.min(100, p));
      if (p >= 100) { clearInterval(t); setPhase('analyzing'); setTimeout(() => setPhase('done'), 1600); }
    }, 80);
  };

  return (
    <OnboardingShell step={1}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', gap: 28 }}>
        <div>
          <div className="eyebrow">Step 1 of 3</div>
          <h2 className="serif" style={{ margin: '6px 0 0', fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Upload your commercial<br/>insurance policy.
          </h2>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10, maxWidth: 520 }}>
            We'll read every page — exclusions, deductibles, sub-limits, conditions. Takes about 90 seconds. Nothing is shared with your insurer.
          </div>
        </div>

        <div className="card" style={{ padding: 28, maxWidth: 560 }}>
          {phase === 'idle' && (
            <div onClick={run} style={{
              border: '1.5px dashed var(--line-2)', borderRadius: 12, padding: '52px 32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              cursor: 'pointer', background: 'var(--bg-subtle)', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.background = '#eef2fb'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Upload size={24} style={{ color: 'var(--navy)' }}/>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Drop your policy PDF here</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 3 }}>or click to browse · PDF · DOCX · up to 50 MB</div>
              </div>
              <button className="btn btn-primary" onClick={e => { e.stopPropagation(); run(); }}>
                <Icons.Upload size={14}/> Choose file
              </button>
            </div>
          )}

          {(phase === 'uploading' || phase === 'analyzing' || phase === 'done') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 54, border: '1px solid var(--line-2)', borderRadius: 6, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <Icons.FileText size={20} style={{ color: 'var(--ink-4)' }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Policy — CPP-48291-B.pdf</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>2.4 MB · GreatWest Mutual</div>
                </div>
                {phase === 'done' && <Icons.CheckCircle size={20} style={{ color: 'var(--teal)' }}/>}
              </div>

              {phase !== 'done' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>
                    <span>{phase === 'uploading' ? 'Uploading…' : 'Reading policy · extracting coverage…'}</span>
                    <span className="mono">{phase === 'uploading' ? progress + '%' : 'AI'}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, transition: 'width .1s',
                      width: phase === 'analyzing' ? '100%' : progress + '%',
                      background: phase === 'analyzing' ? 'linear-gradient(90deg, var(--navy), var(--teal))' : 'var(--navy)',
                    }}/>
                  </div>
                </div>
              )}

              {phase === 'done' && (
                <div className="card" style={{ padding: 14, background: 'var(--teal-soft)', borderColor: 'var(--teal)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Icons.Sparkle size={16} style={{ color: 'var(--teal)', flex: 'none' }}/>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                      Analysis complete — <strong>62 pages</strong> read. Found <strong style={{ color: 'var(--amber)' }}>3 coverage flags</strong> and 1 high-risk exclusion.
                    </div>
                  </div>
                </div>
              )}

              {phase === 'done' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1 }}/>
                  <button className="btn btn-ghost">Upload another</button>
                  <button className="btn btn-primary">Review results <Icons.Arrow size={12}/></button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-4)' }}>
          {[['Lock', 'AES-256 encrypted'], ['Shield', 'Never shared with insurers'], ['CheckCircle', 'Delete anytime']].map(([icon, label]) => {
            const I = Icons[icon];
            return <span key={label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><I size={13}/> {label}</span>;
          })}
        </div>
      </div>
    </OnboardingShell>
  );
}

// ─── Step 2: Review coverage ──────────────────────────────────────
function OnboardingReview() {
  return (
    <OnboardingShell step={2}>
      <div style={{ flex: 1, overflow: 'auto', padding: '40px 64px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div className="eyebrow">Step 2 of 3 · Analysis complete</div>
          <h2 className="serif" style={{ margin: '6px 0 0', fontSize: 34, letterSpacing: '-0.02em' }}>
            Here's what we found in your policy.
          </h2>
          <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 8 }}>
            GreatWest Mutual CPP-48291-B · 62 pages · Commercial Property
          </div>
        </div>

        {/* Score */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center' }}>
            <div className="eyebrow">Coverage score</div>
            <div className="serif num-t" style={{ fontSize: 56, color: 'var(--amber)', lineHeight: 1, letterSpacing: '-0.02em' }}>72</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 160 }}>Solid core coverage with two notable gaps that need attention.</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { level: 'high', color: 'red',    title: 'Flood exclusion on primary policy', detail: 'Your basement prep kitchen sits near the Swannanoa River floodplain. No flood endorsement is in place.' },
              { level: 'med',  color: 'amber',  title: 'Business income sub-limit may be short', detail: 'At $1.4M revenue, the 12-month ALE only covers ~68% of projected loss in a full shutdown.' },
              { level: 'low',  color: 'neutral',title: 'Deductible is above the market median', detail: '$5k vs. $2.5k median for similar NC restaurants. Consider requesting a lower AOP deductible.' },
            ].map(r => (
              <div key={r.title} className="card" style={{ padding: 14, display: 'flex', gap: 12 }}>
                <span className={`pill pill-${r.color}`} style={{ flex: 'none', alignSelf: 'flex-start', marginTop: 1 }}>{r.level === 'high' ? 'High' : r.level === 'med' ? 'Med' : 'Low'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.5 }}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage table preview */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Coverage breakdown</div>
            <span className="eyebrow">7 sections extracted</span>
          </div>
          {[
            { label: 'Building',                  limit: '$420,000', status: 'teal' },
            { label: 'Business Personal Property', limit: '$85,000',  status: 'teal' },
            { label: 'Business Income Loss',       limit: '$120,000', status: 'amber' },
            { label: 'Equipment Breakdown',        limit: '$50,000',  status: 'teal' },
            { label: 'Flood',                      limit: 'Excluded', status: 'red' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 16, borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ flex: 1, fontSize: 13 }}>{r.label}</span>
              <span className="serif num-t" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{r.limit}</span>
              <span className={`pill pill-${r.status}`} style={{ fontSize: 10 }}>
                {r.status === 'teal' ? <><Icons.Check size={9} style={{ strokeWidth: 3 }}/> Covered</> : r.status === 'red' ? <><Icons.X size={9}/> Excluded</> : <><Icons.Alert size={9}/> Flag</>}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          <button className="btn btn-ghost"><Icons.ChevronL size={12}/> Back</button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-ghost"><Icons.Download size={13}/> Save report</button>
          <button className="btn btn-primary">Go to my dashboard <Icons.Arrow size={13}/></button>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ─── Step 3: Done / dashboard preview ────────────────────────────
function OnboardingDone() {
  return (
    <OnboardingShell step={3}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 64px', gap: 28, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(15,125,108,0.3)' }}>
          <Icons.Shield size={36} style={{ color: '#fff' }}/>
        </div>

        <div>
          <div className="eyebrow">You're all set</div>
          <h2 className="serif" style={{ margin: '8px 0 0', fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Lumen & Loaf is<br/>
            <em style={{ color: 'var(--teal)' }}>protected.</em>
          </h2>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 12, maxWidth: 460, lineHeight: 1.6 }}>
            We're watching for policy lapses, tracking your deadlines, and ready to build your case the moment a claim happens.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {[
            { icon: 'Clock',    label: 'Deadline alerts', sub: 'We\'ll email you 30, 7, and 1 day before any policy deadline.' },
            { icon: 'Sparkle', label: 'Claim ready',      sub: 'If you ever need to file, we\'ll guide every step.' },
            { icon: 'Shield',  label: 'Policy on file',   sub: 'Score: 72/100 · 3 flags to review at your leisure.' },
          ].map(item => {
            const I = Icons[item.icon];
            return (
              <div key={item.label} className="card" style={{ padding: 20, maxWidth: 200, textAlign: 'left' }}>
                <I size={20} style={{ color: 'var(--navy)', marginBottom: 10 }}/>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 14 }}>
          Go to my dashboard <Icons.Arrow size={14}/>
        </button>
        <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
          You can upload additional policies or adjust notifications anytime in Settings.
        </div>
      </div>
    </OnboardingShell>
  );
}

Object.assign(window, { OnboardingUpload, OnboardingReview, OnboardingDone });
