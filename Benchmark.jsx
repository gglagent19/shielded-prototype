// Benchmark.jsx — settlement benchmarking with box-plot

function Benchmark() {
  const c = DEMO.activeClaim;
  const comps = DEMO.benchmarks.comps;
  const fmt = n => '$' + (n/1000).toFixed(1) + 'k';
  const fmtFull = n => '$' + n.toLocaleString();
  const min = 25000, max = 60000;
  const xp = v => ((v - min) / (max - min)) * 100;

  // Quartiles
  const sorted = [...comps].map(x => x.payout).sort((a,b) => a-b);
  const q = (p) => sorted[Math.floor(sorted.length * p)];
  const q1 = q(0.25), q2 = q(0.5), q3 = q(0.75);

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Claim {c.id} · Benchmarking</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
            Is your offer fair?
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            Compared against {comps.length} NC restaurant fire claims closed in the last 18 months.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Filter size={13}/> Adjust filters</button>
          <button className="btn btn-primary"><Icons.Sparkle size={14}/> Draft rebuttal</button>
        </div>
      </div>

      {/* Headline */}
      <div className="card" style={{ padding: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <div>
          <div className="eyebrow">Insurer's offer</div>
          <div className="serif num-t" style={{ fontSize: 32, color: 'var(--red)', letterSpacing: '-0.015em' }}>
            {fmtFull(c.insurerOffer)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">received Apr 04</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20 }}>
          <div className="eyebrow">Fair range (P25–P75)</div>
          <div className="serif num-t" style={{ fontSize: 32, letterSpacing: '-0.015em' }}>
            {fmt(q1)}–{fmt(q3)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">midpoint {fmtFull(c.fairMid)}</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20 }}>
          <div className="eyebrow">Offer position</div>
          <div className="serif num-t" style={{ fontSize: 32, color: 'var(--amber)', letterSpacing: '-0.015em' }}>
            P{Math.round(comps.filter(x => x.payout < c.insurerOffer).length / comps.length * 100) || 3}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">below 95% of comps</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20 }}>
          <div className="eyebrow">Recoverable gap</div>
          <div className="serif num-t" style={{ fontSize: 32, color: 'var(--teal)', letterSpacing: '-0.015em' }}>
            +{fmt(c.delta)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">to fair midpoint</div>
        </div>
      </div>

      {/* Box plot */}
      <div className="card" style={{ padding: '24px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Settlement distribution</div>
            <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Box shows interquartile range; whiskers show min/max</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Box plot', 'Scatter', 'Histogram'].map((v, i) => (
              <button key={v} className="btn btn-ghost btn-sm" style={{
                borderColor: i === 0 ? 'var(--navy)' : 'var(--line)',
                background: i === 0 ? '#eef2fb' : 'transparent',
                color: i === 0 ? 'var(--navy)' : 'var(--ink-3)',
              }}>{v}</button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', height: 140, padding: '20px 40px' }}>
          {/* Axis */}
          <div style={{ position: 'absolute', left: 40, right: 40, top: 100, height: 1, background: 'var(--line-2)' }}/>
          {[30, 40, 50, 60].map(v => {
            const x = xp(v * 1000);
            return (
              <div key={v} style={{ position: 'absolute', left: `calc(40px + ${x}% * (100% - 80px) / 100)`, top: 100, height: 6, width: 1, background: 'var(--line-2)' }}>
                <div className="mono" style={{ position: 'absolute', top: 10, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--ink-4)' }}>
                  ${v}k
                </div>
              </div>
            );
          })}

          {/* Whisker line */}
          <div style={{
            position: 'absolute', top: 46,
            left: `calc(40px + ${xp(sorted[0])}% * (100% - 80px) / 100)`,
            width: `calc(${xp(sorted[sorted.length-1]) - xp(sorted[0])}% * (100% - 80px) / 100)`,
            height: 1, background: 'var(--ink-3)',
          }}/>
          {/* Whiskers caps */}
          {[sorted[0], sorted[sorted.length-1]].map((v, i) => (
            <div key={i} style={{
              position: 'absolute', left: `calc(40px + ${xp(v)}% * (100% - 80px) / 100)`,
              top: 40, width: 1, height: 12, background: 'var(--ink-3)',
            }}/>
          ))}

          {/* Box */}
          <div style={{
            position: 'absolute', top: 30,
            left: `calc(40px + ${xp(q1)}% * (100% - 80px) / 100)`,
            width: `calc(${xp(q3) - xp(q1)}% * (100% - 80px) / 100)`,
            height: 34, background: 'var(--teal-soft)', border: '1.5px solid var(--teal)', borderRadius: 3,
          }}>
            <div style={{ position: 'absolute', top: -18, left: 0, fontSize: 10, color: 'var(--teal)' }} className="mono">FAIR RANGE</div>
          </div>
          {/* Median */}
          <div style={{
            position: 'absolute', top: 30, height: 34,
            left: `calc(40px + ${xp(q2)}% * (100% - 80px) / 100)`,
            width: 2, background: 'var(--teal)',
          }}/>

          {/* Individual comp dots */}
          {comps.map((c, i) => (
            <div key={i} style={{
              position: 'absolute', top: 43,
              left: `calc(40px + ${xp(c.payout)}% * (100% - 80px) / 100)`,
              transform: 'translateX(-50%)',
              width: 8, height: 8, borderRadius: 99,
              background: 'var(--navy)', border: '2px solid var(--bg-card)',
            }}/>
          ))}

          {/* Insurer offer marker */}
          <div style={{
            position: 'absolute', top: 16, bottom: 30,
            left: `calc(40px + ${xp(c.insurerOffer)}% * (100% - 80px) / 100)`,
            width: 2, background: 'var(--red)',
          }}>
            <div style={{
              position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--red)', color: '#fff', padding: '3px 8px', borderRadius: 4,
              fontSize: 10, fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap',
            }}>
              OFFER ↓ {fmtFull(c.insurerOffer)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 11.5, color: 'var(--ink-3)' }}>
          <div><span className="dot" style={{ background: 'var(--navy)', marginRight: 6 }}/> Comparable claim</div>
          <div><span className="dot" style={{ background: 'var(--teal)', marginRight: 6 }}/> Fair range (IQR)</div>
          <div><span className="dot" style={{ background: 'var(--red)', marginRight: 6 }}/> Your insurer's offer</div>
          <div style={{ marginLeft: 'auto' }} className="mono">n = 7 · R² 0.78</div>
        </div>
      </div>

      {/* Comps table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Comparable claims</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Anonymized · matched on peril, size, and region</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><Icons.Filter size={12}/> Refine match</button>
            <button className="btn btn-ghost btn-sm"><Icons.Download size={12}/> Export</button>
          </div>
        </div>
        <div style={{
          padding: '10px 18px', display: 'grid',
          gridTemplateColumns: '1.2fr 2fr 1fr 1fr 80px',
          fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', fontFamily: 'var(--f-mono)',
        }}>
          <div>Business</div><div>Claim type</div><div>Payout</div><div>vs yours</div><div/>
        </div>
        {comps.map((cm, i) => {
          const diff = cm.payout - c.insurerOffer;
          return (
            <div key={i} style={{
              padding: '12px 18px', display: 'grid',
              gridTemplateColumns: '1.2fr 2fr 1fr 1fr 80px', gap: 12, alignItems: 'center',
              borderTop: '1px solid var(--line)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{cm.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{cm.type}</div>
              <div className="serif num-t" style={{ fontSize: 17 }}>{fmtFull(cm.payout)}</div>
              <div>
                <span className={`pill pill-${diff > 0 ? 'teal' : 'red'}`} style={{ fontFamily: 'var(--f-mono)' }}>
                  {diff > 0 ? '+' : ''}{fmt(diff)}
                </span>
              </div>
              <button className="btn btn-quiet btn-sm" style={{ justifySelf: 'end', padding: 4 }}>
                <Icons.ExternalLink size={12}/>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Benchmark });
