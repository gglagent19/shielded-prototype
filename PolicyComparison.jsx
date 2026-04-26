// PolicyComparison.jsx — side-by-side policy comparison for renewal

const COMPARE_ROWS = [
  { category: 'Coverage', label: 'Building',               a: '$420,000', b: '$450,000', winner: 'b' },
  { category: 'Coverage', label: 'Business Personal Property', a: '$85,000', b: '$100,000', winner: 'b' },
  { category: 'Coverage', label: 'Business Income (ALE)',   a: '12 months', b: '18 months', winner: 'b' },
  { category: 'Coverage', label: 'Equipment Breakdown',     a: '$50,000',  b: '$60,000',  winner: 'b' },
  { category: 'Coverage', label: 'Spoilage',               a: '$10,000',  b: '$12,000',  winner: 'b' },
  { category: 'Coverage', label: 'Flood endorsement',      a: 'Excluded', b: 'Included', winner: 'b', aRed: true },
  { category: 'Coverage', label: 'Ordinance or Law',       a: '$25,000',  b: '$50,000',  winner: 'b' },
  { category: 'Terms',    label: 'AOP deductible',         a: '$5,000',   b: '$2,500',   winner: 'b' },
  { category: 'Terms',    label: 'Valuation basis',        a: 'RCV',      b: 'RCV',      winner: 'tie' },
  { category: 'Terms',    label: 'Coinsurance',            a: '80%',      b: 'None',     winner: 'b' },
  { category: 'Terms',    label: 'Policy term',            a: '12 months',b: '12 months',winner: 'tie' },
  { category: 'Cost',     label: 'Annual premium',         a: '$4,820',   b: '$4,280',   winner: 'b' },
  { category: 'Cost',     label: 'Monthly (est.)',         a: '$402',     b: '$357',     winner: 'b' },
  { category: 'Score',    label: 'Shielded coverage score',a: '72',       b: '89',       winner: 'b' },
  { category: 'Score',    label: 'Risk flags',             a: '3 (1 high)',b: '0',        winner: 'b' },
];

const CATEGORIES = [...new Set(COMPARE_ROWS.map(r => r.category))];

function CompareCell({ value, winner, side, aRed }) {
  const isWinner = winner === side;
  const isTie = winner === 'tie';
  const isLoser = !isWinner && !isTie;
  const red = side === 'a' && aRed;
  return (
    <td style={{
      padding: '10px 16px', textAlign: 'center', fontSize: 13,
      background: isWinner ? 'rgba(15,125,108,0.06)' : 'transparent',
      color: red ? 'var(--red)' : isWinner ? 'var(--teal)' : isLoser ? 'var(--ink-3)' : 'var(--ink-2)',
      fontWeight: isWinner ? 600 : 400,
      position: 'relative',
      borderLeft: '1px solid var(--line)',
    }}>
      {isWinner && <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10 }}>✓</span>}
      {value}
    </td>
  );
}

function PolicyComparison() {
  const [selected, setSelected] = React.useState('b');
  const savings = 4820 - 4280;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Renewal · Policy comparison</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Compare policies</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            Current GreatWest policy vs. Meridian Commercial quote — renewing Feb 14, 2027
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icons.Download size={13}/> Export comparison</button>
          <button className="btn btn-primary" onClick={() => setSelected('b')}>
            <Icons.Check size={13}/> Choose Meridian
          </button>
        </div>
      </div>

      {/* Savings banner */}
      <div className="card" style={{ padding: '16px 20px', background: 'var(--teal-soft)', borderColor: 'var(--teal)', display: 'flex', gap: 20, alignItems: 'center' }}>
        <Icons.TrendDown size={22} style={{ color: 'var(--teal)', flex: 'none' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal)' }}>Switching to Meridian saves ${savings}/year — with better coverage across 11 of 15 categories</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Flood endorsement included · Deductible halved · ALE extended to 18 months · Score 89 vs 72</div>
        </div>
        <div className="serif num-t" style={{ fontSize: 32, color: 'var(--teal)', letterSpacing: '-0.02em' }}>+${savings}/yr</div>
      </div>

      {/* Column headers */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', width: '35%' }}>Coverage item</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', borderLeft: '1px solid var(--line)', background: selected === 'a' ? '#eef2fb' : 'var(--bg-subtle)' }}>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Current</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>GreatWest Mutual</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>CPP-48291-B · renewing</div>
                <div style={{ marginTop: 6 }}>
                  <span className="serif num-t" style={{ fontSize: 22, color: 'var(--amber)' }}>72</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-4)', marginLeft: 4 }}>/ 100</span>
                </div>
              </th>
              <th style={{ padding: '14px 16px', textAlign: 'center', borderLeft: '1px solid var(--line)', background: selected === 'b' ? 'rgba(15,125,108,0.06)' : 'var(--bg-subtle)', position: 'relative' }}>
                {selected === 'b' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--teal)', borderRadius: '0 0 0 0' }}/>
                )}
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Competitor quote</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: selected === 'b' ? 'var(--teal)' : 'var(--ink)' }}>Meridian Commercial</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>Quote valid until May 30, 2026</div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  <span className="serif num-t" style={{ fontSize: 22, color: 'var(--teal)' }}>89</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>/ 100</span>
                  {selected === 'b' && <span className="pill pill-teal" style={{ fontSize: 10 }}>Selected</span>}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(cat => (
              <React.Fragment key={cat}>
                <tr>
                  <td colSpan={3} style={{ padding: '10px 16px 4px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--line)' }}>
                    <span className="eyebrow">{cat}</span>
                  </td>
                </tr>
                {COMPARE_ROWS.filter(r => r.category === cat).map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--ink-2)', fontWeight: row.winner !== 'tie' ? 400 : 400 }}>{row.label}</td>
                    <CompareCell value={row.a} winner={row.winner} side="a" aRed={row.aRed}/>
                    <CompareCell value={row.b} winner={row.winner} side="b"/>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {/* Summary row */}
            <tr style={{ borderTop: '2px solid var(--line)', background: 'var(--bg-subtle)' }}>
              <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>Winner</td>
              <td style={{ padding: '14px 16px', textAlign: 'center', borderLeft: '1px solid var(--line)' }}>
                <span className="pill pill-neutral">2 / 15</span>
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'center', borderLeft: '1px solid var(--line)', background: 'rgba(15,125,108,0.06)' }}>
                <span className="pill pill-teal"><Icons.Check size={10} style={{ strokeWidth: 3 }}/> 11 / 15</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CTA strip */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-3)' }}>
          Shielded generated this comparison from your uploaded GreatWest policy and the Meridian quote PDF.
          <span style={{ color: 'var(--navy)', cursor: 'pointer', marginLeft: 6 }}>Upload another quote →</span>
        </div>
        <button className="btn btn-ghost">Request GreatWest counter-offer</button>
        <button className="btn btn-primary" onClick={() => setSelected('b')}>
          Switch to Meridian · save ${savings}/yr <Icons.Arrow size={12}/>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PolicyComparison });
