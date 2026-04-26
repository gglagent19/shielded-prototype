// PolicyUpload.jsx — upload + AI analysis

function PolicyUpload() {
  const [phase, setPhase] = React.useState('idle'); // idle | uploading | analyzing | done
  const [progress, setProgress] = React.useState(0);

  const run = () => {
    setPhase('uploading'); setProgress(0);
    let p = 0;
    const int1 = setInterval(() => {
      p += 7; setProgress(Math.min(100, p));
      if (p >= 100) { clearInterval(int1); setPhase('analyzing'); setTimeout(() => setPhase('done'), 1800); }
    }, 90);
  };

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div>
        <div className="eyebrow">Step 1 of 2</div>
        <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Upload your policy</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, maxWidth: 560 }}>
          We'll extract coverage limits, exclusions, deductibles, and flag anything that looks thin for a business like yours. Takes about 90 seconds.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          {phase === 'idle' && (
            <div onClick={run} style={{
              border: '1.5px dashed var(--line-2)', borderRadius: 12, padding: '50px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              cursor: 'pointer', background: 'var(--bg-subtle)',
              transition: 'border-color .15s, background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.background = '#eef2fb'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12, background: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)',
              }}>
                <Icons.Upload size={22} style={{ color: 'var(--navy)' }}/>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Drop policy PDF or click to upload</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }} className="mono">
                  PDF · DOCX · up to 50 MB · encrypted in transit
                </div>
              </div>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); run(); }}>
                <Icons.Upload size={14}/> Choose file
              </button>
            </div>
          )}

          {(phase === 'uploading' || phase === 'analyzing' || phase === 'done') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 54, border: '1px solid var(--line-2)', borderRadius: 6,
                  background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                }}>
                  <Icons.FileText size={20} style={{ color: 'var(--navy)' }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>GreatWest_Commercial_Property_2026.pdf</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }} className="mono">2.4 MB · 62 pages</div>
                </div>
                {phase === 'done' && <span className="pill pill-teal"><Icons.Check size={10}/> Analyzed</span>}
              </div>

              <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: phase === 'uploading' ? `${progress}%` : '100%',
                  height: '100%', background: phase === 'done' ? 'var(--teal)' : 'var(--navy)',
                  transition: 'width .12s',
                }}/>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                {[
                  { label: 'Uploading encrypted', done: progress >= 100 || phase === 'analyzing' || phase === 'done', active: phase === 'uploading' && progress < 100 },
                  { label: 'Extracting policy structure', done: phase === 'done', active: phase === 'analyzing' },
                  { label: 'Cross-referencing with NC small business benchmarks', done: phase === 'done', active: phase === 'analyzing' },
                  { label: 'Flagging gaps and risks', done: phase === 'done', active: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: s.done ? 'var(--ink)' : s.active ? 'var(--ink-2)' : 'var(--ink-4)' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 99, flex: 'none',
                      border: s.done ? 'none' : '1.5px solid var(--line-2)',
                      background: s.done ? 'var(--teal)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.done && <Icons.Check size={10} style={{ color: '#fff', strokeWidth: 3 }}/>}
                      {s.active && <span className="dot pulse" style={{ background: 'var(--navy)', width: 6, height: 6 }}/>}
                    </div>
                    <span>{s.label}</span>
                    {s.active && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginLeft: 'auto' }}>in progress</span>}
                  </div>
                ))}
              </div>

              {phase === 'done' && (
                <div className="fade-in" style={{ marginTop: 8, padding: 14, background: 'var(--bg-subtle)', borderRadius: 8, display: 'flex', gap: 12 }}>
                  <Icons.Sparkle size={18} style={{ color: 'var(--navy)', flex: 'none', marginTop: 2 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Analysis complete — 3 risk flags found</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                      Your building and BPP limits look solid. Flood exclusion and ordinance-or-law sub-limit are worth a look.
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">See results <Icons.Arrow size={12}/></button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="eyebrow">What we extract</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Your policy, decoded</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Coverage limits', 'By section, with sub-limits'],
              ['Exclusions', 'Including easy-to-miss endorsements'],
              ['Deductibles', 'Per peril, with AOP flags'],
              ['Claim conditions', 'Notice, proof of loss, cooperation'],
              ['Payout triggers', 'Actual cash value vs replacement'],
            ].map(([a, b]) => (
              <div key={a} style={{ fontSize: 12.5 }}>
                <div style={{ fontWeight: 500 }}>{a}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{b}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 10, background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', gap: 8 }}>
            <Icons.Lock size={14} style={{ flex: 'none', color: 'var(--ink-3)' }}/>
            <span>Policies stay encrypted at rest. Never sold or shared.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PolicyUpload });
