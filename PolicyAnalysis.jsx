// PolicyAnalysis.jsx — results of the AI policy extraction

function CoverageRow({ c }) {
  const fmt = n => n > 0 ? '$' + n.toLocaleString() : 'Not covered';
  return (
    <div style={{
      padding: '14px 16px', display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 60px', gap: 16, alignItems: 'center',
      borderTop: '1px solid var(--line)',
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
        {c.note && <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.note}</div>}
      </div>
      <div className="serif num-t" style={{ fontSize: 17, color: c.covered ? 'var(--ink)' : 'var(--ink-4)' }}>
        {fmt(c.limit)}
      </div>
      <div>
        {c.flag
          ? <span className="pill pill-amber"><Icons.Alert size={10}/> {c.flag}</span>
          : c.covered
            ? <span className="pill pill-teal"><Icons.Check size={10}/> Covered</span>
            : <span className="pill pill-red"><Icons.X size={10}/> Excluded</span>}
      </div>
      <button className="btn btn-quiet btn-sm" style={{ padding: 4, justifySelf: 'end' }}>
        <Icons.ChevronR size={14}/>
      </button>
    </div>
  );
}

function PolicyAnalysis() {
  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Policy · {DEMO.business.policyNo}</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>{DEMO.business.policy}</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            {DEMO.business.premium} · renews {DEMO.business.renews} · 62 pages
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Download size={14}/> Export report</button>
          <button className="btn btn-primary"><Icons.Sparkle size={14}/> Ask AI</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow">Overall coverage score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <div className="serif num-t" style={{ fontSize: 34, lineHeight: 1, color: 'var(--amber)' }}>72</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }} className="mono">/ 100</div>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6 }}>
            Solid core, two notable gaps
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow">Total insured value</div>
          <div className="serif num-t" style={{ fontSize: 28, marginTop: 6 }}>$710k</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Across 7 sections</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow">Deductibles</div>
          <div className="serif num-t" style={{ fontSize: 28, marginTop: 6 }}>$5,000</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>AOP · wind/hail $10k</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow">Risk flags</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'baseline' }}>
            <div className="serif num-t" style={{ fontSize: 28, color: 'var(--red)' }}>1</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>high ·</div>
            <div className="serif num-t" style={{ fontSize: 18, color: 'var(--amber)' }}>1</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>med ·</div>
            <div className="serif num-t" style={{ fontSize: 18, color: 'var(--ink-3)' }}>1</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>low</div>
          </div>
        </div>
      </div>

      {/* Coverage breakdown */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Coverage breakdown</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Extracted from §2–§9 of your policy</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icons.Filter size={12}/> Filter</button>
          </div>
        </div>
        <div style={{
          padding: '10px 16px', display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 60px', gap: 16,
          fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', fontFamily: 'var(--f-mono)',
        }}>
          <div>Section</div><div>Limit</div><div>Status</div><div/>
        </div>
        {DEMO.coverage.map((c, i) => <CoverageRow key={i} c={c} />)}
      </div>

      {/* Side-by-side: risk flags + AI explainer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Risk flags to address</div>
          {DEMO.risks.map((r, i) => {
            const tone = r.level === 'high' ? 'red' : r.level === 'med' ? 'amber' : 'neutral';
            return (
              <div key={i} style={{
                padding: 12, background: 'var(--bg-subtle)', borderRadius: 8,
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span className={`pill pill-${tone}`} style={{ marginTop: 2 }}>
                  {r.level.toUpperCase()}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5, marginTop: 3 }}>{r.detail}</div>
                  <button className="btn btn-quiet btn-sm" style={{ marginTop: 6, padding: '3px 0', fontSize: 11.5, color: 'var(--navy)' }}>
                    Explore endorsements <Icons.Arrow size={11}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Sparkle size={16} style={{ color: 'var(--navy)' }}/>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Plain-English summary</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, fontFamily: 'var(--f-serif)', fontSize: 15.5 }}>
            Your policy is a <strong>Commercial Property</strong> form with solid building and contents coverage. Business income (12 months) is present but may fall short in a full shutdown.
            The biggest gap is <em>flood</em> — entirely excluded, and you sit close to a floodplain. Ordinance-or-law is sub-limited at $25k, which won't cover a full code-upgrade rebuild in Asheville.
          </div>
          <div style={{ padding: 10, background: 'var(--bg-subtle)', borderRadius: 8, fontSize: 12, color: 'var(--ink-3)' }}>
            <span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>Cited</span>
            §2.1 Building · §3.4 BPP · §5 Business Income · §7.1 Exclusions · Endorsement A-221
          </div>
          <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
            <Icons.Chat size={13}/> Ask a follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PolicyAnalysis });
