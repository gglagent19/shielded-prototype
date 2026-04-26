// DocumentViewer.jsx — AI-annotated PDF viewer (the core "reading" moment)

const ANNOTATIONS = [
  {
    id: 'A1', page: 3, kind: 'issue', severity: 'high',
    title: 'ACV applied instead of replacement cost',
    clause: '§4.2 Replacement Cost Endorsement',
    quote: 'Equipment valued at actual cash value less depreciation...',
    finding: 'Your policy §4.2 explicitly endorses replacement cost for commercial kitchen equipment. The adjuster applied ACV depreciation ($9,200), which contradicts the endorsement.',
    impact: '+$9,200',
  },
  {
    id: 'A2', page: 4, kind: 'issue', severity: 'high',
    title: 'Smoke remediation scope is incomplete',
    clause: '§3.4 Smoke Damage Coverage',
    quote: 'Smoke remediation limited to surfaces in direct contact with smoke...',
    finding: 'Policy §3.4 includes HVAC systems and soft goods. The estimate omits $2,800 HVAC duct cleaning and $1,600 soft goods deodorization.',
    impact: '+$4,400',
  },
  {
    id: 'A3', page: 6, kind: 'issue', severity: 'med',
    title: 'Business income calculated at flat rate',
    clause: '§5.1 Business Income Calculation',
    quote: 'Income loss computed at $4,200 per week based on prior month...',
    finding: 'Policy §5.1 specifies a 12-month trailing average for seasonal businesses. The prior single month was below-season, understating loss by ~$3,800.',
    impact: '+$3,800',
  },
  {
    id: 'A4', page: 2, kind: 'info', severity: 'low',
    title: 'Deductible correctly applied',
    clause: '§2.1 All Other Perils Deductible',
    quote: 'Subject to $5,000 AOP deductible per occurrence...',
    finding: 'The $5,000 AOP deductible is correctly applied to this fire claim. No dispute on this line.',
    impact: null,
  },
];

// Simulated PDF pages (rendered as styled document content)
function DocPage({ page, annotations }) {
  const pageAnnots = annotations.filter(a => a.page === page);

  const highlight = (text, annot) => (
    <span key={annot.id} style={{
      background: annot.severity === 'high' ? 'rgba(163,50,28,0.12)' : annot.severity === 'med' ? 'rgba(184,118,31,0.12)' : 'rgba(15,125,108,0.08)',
      borderBottom: `2px solid ${annot.severity === 'high' ? 'var(--red)' : annot.severity === 'med' ? 'var(--amber)' : 'var(--teal)'}`,
      borderRadius: 2, padding: '1px 0', cursor: 'pointer', position: 'relative',
    }} title={annot.title}>{text}</span>
  );

  const pages = {
    1: (
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: 'Georgia, serif' }}>PROPERTY DAMAGE ESTIMATE</div>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Claim: CLM-2041 · Date of Loss: March 11, 2026</div>
        <div style={{ fontSize: 12, marginBottom: 16 }}>Insured: Lumen & Loaf · Policy: CPP-48291-B</div>
        <div className="hr" style={{ margin: '12px 0' }}/>
        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
          <div><strong>Adjuster:</strong> J. Halloran · GreatWest Mutual</div>
          <div><strong>Inspection date:</strong> April 2, 2026</div>
          <div><strong>Report date:</strong> April 4, 2026</div>
          <div style={{ marginTop: 12 }}>This estimate represents GreatWest Mutual's assessment of covered losses arising from the fire and smoke damage event at 248 Lexington Ave, Asheville NC on March 11, 2026. All values are subject to policy terms, conditions, and applicable deductibles.</div>
        </div>
      </div>
    ),
    2: (
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Georgia, serif' }}>SUMMARY OF COVERED LOSSES</div>
        <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #333' }}>
              {['Line item', 'RCV', 'Depreciation', 'ACV'].map(h => (
                <th key={h} style={{ textAlign: h === 'Line item' ? 'left' : 'right', padding: '4px 6px', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace' }}>
            {[
              ['Kitchen hood system', '14,200', '4,100', '10,100'],
              ['Convection oven', '8,900', '5,000', '3,900'],
              ['Walk-in refrigerator', '11,400', '2,200', '9,200'],
              ['Prep line equipment', '6,800', '1,400', '5,400'],
              ['Smoke remediation', '4,600', '—', '4,600'],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '5px 6px', textAlign: j === 0 ? 'left' : 'right' }}>{cell}</td>
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: '1.5px solid #333', fontWeight: 700 }}>
              <td style={{ padding: '6px 6px' }}>TOTAL</td>
              <td style={{ padding: '6px 6px', textAlign: 'right' }}>45,900</td>
              <td style={{ padding: '6px 6px', textAlign: 'right' }}>12,700</td>
              <td style={{ padding: '6px 6px', textAlign: 'right' }}>33,200</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 14, fontSize: 11, lineHeight: 1.6 }}>
          Less AOP deductible: {highlight('$5,000', ANNOTATIONS[3])} per policy §2.1. <strong>Net payment: $28,400</strong> pending proof of loss.
        </div>
      </div>
    ),
    3: (
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Georgia, serif' }}>EQUIPMENT VALUATION BASIS</div>
        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 10 }}>
            {highlight('Equipment valued at actual cash value less depreciation per standard industry schedules. Kitchen equipment depreciated at 8–12% annually based on age and condition at time of loss.', ANNOTATIONS[0])}
          </div>
          <div style={{ marginBottom: 10 }}>Hood system (Captive-Aire Model NC-2): 7 years old. Applied 56% accumulated depreciation. RCV $14,200, depreciation $7,952, ACV $6,248. Note: unit was operable prior to loss.</div>
          <div style={{ marginBottom: 10 }}>Convection oven (Blodgett MARK V): 5 years old. Applied 40% accumulated depreciation. RCV $8,900, depreciation $3,560, ACV $5,340.</div>
          <div>All equipment depreciation schedules are on file and available for review upon written request.</div>
        </div>
      </div>
    ),
    4: (
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Georgia, serif' }}>SMOKE REMEDIATION SCOPE</div>
        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 10 }}>
            {highlight('Smoke remediation limited to surfaces in direct contact with smoke residue. Estimate includes: surface cleaning of kitchen walls, floor, and ceiling ($3,200); hood and exhaust duct interior cleaning ($1,200); total $4,400.', ANNOTATIONS[1])}
          </div>
          <div style={{ marginBottom: 10 }}>HVAC system: Smoke penetration to HVAC supply ducts noted but excluded from this estimate pending further inspection. Soft goods (upholstered seating, linens) are not included in property coverage.</div>
          <div>Building structural elements show no smoke infiltration beyond the kitchen. Dining room surfaces tested negative for soot contamination per ASTM standards.</div>
        </div>
      </div>
    ),
    5: (
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Georgia, serif' }}>BUSINESS INCOME LOSS</div>
        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 10 }}>
            {highlight('Income loss computed at $4,200 per week based on prior month (February 2026) net revenue. Estimated closure period: 6 weeks. Total business income: $25,200 less ordinary continuing expenses.', ANNOTATIONS[2])}
          </div>
          <div style={{ marginBottom: 10 }}>Period of restoration: March 11, 2026 to April 22, 2026 (estimated). Business income calculation subject to 30-day waiting period per policy endorsement.</div>
        </div>
      </div>
    ),
    6: (
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Georgia, serif' }}>PAYMENT SUMMARY &amp; CONDITIONS</div>
        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 8 }}>This offer represents GreatWest Mutual's final assessed value of covered losses. Payment is conditioned upon receipt of a sworn proof of loss within 60 days of this estimate (due by June 3, 2026).</div>
          <div style={{ marginBottom: 8 }}>The insured retains the right to dispute this estimate within 60 days. Disputes must be submitted in writing to the claims department with supporting documentation.</div>
          <div style={{ fontWeight: 700 }}>Net settlement offered: $28,400</div>
        </div>
      </div>
    ),
  };

  return (
    <div style={{ fontFamily: '-apple-system, system-ui, sans-serif', fontSize: 12, color: '#1a1a1a', lineHeight: 1.6 }}>
      {pages[page] || <div style={{ color: '#999' }}>Page {page}</div>}
    </div>
  );
}

function DocumentViewer() {
  const [page, setPage] = React.useState(2);
  const [selected, setSelected] = React.useState(0);
  const totalPages = 6;
  const issues = ANNOTATIONS.filter(a => a.kind === 'issue');
  const selectedAnnot = ANNOTATIONS[selected];

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Left: PDF viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--line)' }}>
        {/* Toolbar */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--bg-subtle)', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
            <div style={{ width: 28, height: 34, borderRadius: 4, background: '#d94f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <span style={{ fontSize: 9, fontFamily: 'var(--f-mono)', color: '#fff', fontWeight: 700 }}>PDF</span>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Adjuster's estimate — GreatWest.pdf</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>640 KB · {totalPages} pages · CLM-2041</div>
            </div>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><Icons.Download size={12}/> Download</button>
            <button className="btn btn-ghost btn-sm"><Icons.Copy size={12}/> Copy link</button>
          </div>
        </div>

        {/* Page navigation */}
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-card)', flex: 'none' }}>
          <button className="btn btn-quiet btn-sm" style={{ padding: '4px 8px' }} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
            <Icons.ChevronL size={13}/>
          </button>
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>Page {page} of {totalPages}</span>
          <button className="btn btn-quiet btn-sm" style={{ padding: '4px 8px' }} onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
            <Icons.ChevronR size={13}/>
          </button>
          <div style={{ flex: 1 }}/>
          {/* Jump to annotated pages */}
          <div style={{ display: 'flex', gap: 4 }}>
            {ANNOTATIONS.filter((a,i,arr) => arr.findIndex(b=>b.page===a.page)===i).map(a => (
              <button key={a.id} onClick={() => setPage(a.page)} className="btn btn-ghost btn-sm" style={{
                padding: '2px 7px', fontSize: 10.5, fontFamily: 'var(--f-mono)',
                borderColor: page === a.page ? 'var(--navy)' : 'var(--line)',
                background: page === a.page ? '#eef2fb' : 'transparent',
                color: a.severity === 'high' ? 'var(--red)' : a.severity === 'med' ? 'var(--amber)' : 'var(--teal)',
              }}>p{a.page}</button>
            ))}
          </div>
        </div>

        {/* Document page */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 48px', background: '#f8f8f8' }}>
          <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', padding: '48px 52px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 2, minHeight: 480 }}>
            <DocPage page={page} annotations={ANNOTATIONS}/>
          </div>
        </div>
      </div>

      {/* Right: AI annotations panel */}
      <div style={{ width: 360, flex: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Panel header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center', flex: 'none', background: 'var(--bg-subtle)' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldedMark size={14} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Shielded analysis</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>3 issues · {issues.reduce((a,x) => a + parseInt(x.impact), 0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})} recovery gap</div>
          </div>
          <div style={{ flex: 1 }}/>
          <span className="pill pill-red" style={{ fontSize: 10 }}>Review</span>
        </div>

        {/* Annotation list */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {ANNOTATIONS.map((a, i) => {
            const on = i === selected;
            const color = a.severity === 'high' ? 'red' : a.severity === 'med' ? 'amber' : 'teal';
            return (
              <div key={a.id} onClick={() => { setSelected(i); setPage(a.page); }} style={{
                padding: '14px 18px', cursor: 'pointer',
                background: on ? '#eef2fb' : 'transparent',
                borderLeft: `3px solid ${on ? 'var(--navy)' : 'transparent'}`,
                borderBottom: '1px solid var(--line)',
                transition: 'background .1s',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                  <span className={`pill pill-${color}`} style={{ fontSize: 9.5, flex: 'none', marginTop: 1 }}>
                    {a.kind === 'issue' ? (a.severity === 'high' ? 'High' : 'Med') : 'OK'}
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: 500, flex: 1, lineHeight: 1.35 }}>{a.title}</div>
                  {a.impact && <div className="serif num-t" style={{ fontSize: 14, color: 'var(--teal)', flex: 'none', fontWeight: 600 }}>{a.impact}</div>}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginBottom: 4 }}>p{a.page} · {a.clause}</div>
                {on && (
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                    <div style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginBottom: 6, fontSize: 11.5, padding: '6px 10px', background: 'var(--bg-subtle)', borderRadius: 4, borderLeft: `2px solid var(--${color})` }}>"{a.quote}"</div>
                    {a.finding}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chat input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', background: 'var(--bg)', flex: 'none' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px' }}>
            <input placeholder="Ask about this document…" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 12.5, outline: 'none', boxShadow: 'none', padding: 0 }}/>
            <button className="btn btn-primary btn-sm" style={{ padding: '5px 9px' }}><Icons.ArrowUp size={13}/></button>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
            {['What is ACV?', 'How do I dispute this?', 'Show §4.2'].map(s => (
              <button key={s} className="btn btn-quiet btn-sm" style={{ fontSize: 10.5, padding: '2px 7px', color: 'var(--ink-3)' }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DocumentViewer });
