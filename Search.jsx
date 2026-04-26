// Search.jsx — global search across claims, policies, documents, AI

const SEARCH_RESULTS = {
  claims: [
    { id: 'CLM-2041', title: 'Fire & Smoke Damage', sub: 'Mar 11, 2026 · Negotiating · $28.4k offer', match: 'fire' },
    { id: 'CLM-1887', title: 'Water Damage — Burst Pipe', sub: 'Oct 3, 2025 · Settled · $15,200', match: 'water' },
  ],
  policies: [
    { id: 'CPP-48291-B', title: 'Commercial Property — GreatWest', sub: 'Score 72 · 3 flags · renews Feb 2027', match: 'replacement cost' },
    { id: 'GL-33021-A',  title: 'General Liability — GreatWest',   sub: 'Score 88 · renews Mar 2027', match: null },
  ],
  documents: [
    { name: "Adjuster's estimate — GreatWest.pdf", kind: 'Estimate', date: 'Apr 4', match: 'ACV kitchen equipment', size: '640 KB' },
    { name: 'Fire marshal report.pdf',              kind: 'Evidence', date: 'Mar 14', match: 'grease fire flat-top', size: '1.1 MB' },
    { name: 'Contents inventory v2.xlsx',           kind: 'Inventory', date: 'Mar 22', match: 'replacement cost value', size: '88 KB' },
  ],
  ai: [
    { q: 'What is replacement cost vs ACV?', sub: 'Explains §4.2 and why ACV undervalues your equipment' },
    { q: 'How do I dispute a smoke remediation estimate?', sub: 'Covers §3.4 scope and HVAC deodorization rights' },
  ],
};

const RECENT = [
  { type: 'claim',    label: 'CLM-2041 · Fire & Smoke',      icon: 'Claim',   time: '2h ago' },
  { type: 'doc',      label: "Adjuster's estimate.pdf",       icon: 'FileText', time: '4h ago' },
  { type: 'policy',   label: 'CPP-48291-B · Policy analysis', icon: 'Shield',  time: 'Yesterday' },
  { type: 'doc',      label: 'Negotiation draft — CLM-2041',  icon: 'Sparkle', time: '2 days ago' },
];

const KIND_COLOR = { Estimate: 'red', Evidence: 'amber', Inventory: 'teal', Policy: 'navy', Photos: 'neutral' };

function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: 'var(--amber-soft)', color: 'var(--amber)', borderRadius: 2, padding: '0 2px' }}>{p}</mark>
          : p
      )}
    </>
  );
}

function SearchResultGroup({ title, count, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div className="eyebrow">{title}</div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{count}</span>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function GlobalSearch() {
  const [query, setQuery] = React.useState('replacement cost');
  const [tab, setTab] = React.useState('all');
  const hasQuery = query.trim().length > 0;

  const totalResults = SEARCH_RESULTS.claims.length + SEARCH_RESULTS.policies.length + SEARCH_RESULTS.documents.length;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }} className="shielded-root">
      <Sidebar active="dashboard"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Search bar header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line)', flex: 'none', background: 'var(--bg)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 680 }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Icons.Search size={16} style={{ position: 'absolute', left: 14, color: 'var(--ink-4)', pointerEvents: 'none' }}/>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search claims, policies, documents…"
                autoFocus
                style={{ width: '100%', paddingLeft: 42, paddingRight: 14, fontSize: 15, padding: '11px 14px 11px 42px', borderRadius: 10, border: '1.5px solid var(--navy)', boxShadow: '0 0 0 3px color-mix(in oklab, var(--navy) 12%, transparent)' }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', padding: 4 }}>
                  <Icons.X size={14}/>
                </button>
              )}
            </div>
            <div className="kbd" style={{ fontSize: 11 }}>⌘K</div>
          </div>

          {hasQuery && (
            <div style={{ display: 'flex', gap: 0, marginTop: 14 }}>
              {[['all', 'All', totalResults], ['claims', 'Claims', SEARCH_RESULTS.claims.length], ['policies', 'Policies', SEARCH_RESULTS.policies.length], ['docs', 'Documents', SEARCH_RESULTS.documents.length], ['ai', 'Ask AI', SEARCH_RESULTS.ai.length]].map(([id, label, count]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--f-sans)',
                  padding: '6px 14px', fontSize: 12.5,
                  fontWeight: tab === id ? 600 : 400,
                  color: tab === id ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom: tab === id ? '2px solid var(--navy)' : '2px solid transparent',
                  marginBottom: -1, display: 'flex', gap: 6, alignItems: 'center',
                }}>
                  {label}
                  {count > 0 && <span className="mono" style={{ fontSize: 10, padding: '1px 5px', borderRadius: 99, background: tab === id ? 'var(--navy)' : 'var(--bg-subtle)', color: tab === id ? '#fff' : 'var(--ink-4)' }}>{count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
          {!hasQuery ? (
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Recently viewed</div>
              <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: 600 }}>
                {RECENT.map((r, i) => {
                  const I = Icons[r.icon];
                  return (
                    <div key={i} style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                        <I size={14} style={{ color: 'var(--ink-3)' }}/>
                      </div>
                      <div style={{ flex: 1, fontSize: 13 }}>{r.label}</div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{r.time}</span>
                      <Icons.ChevronR size={13} style={{ color: 'var(--ink-4)' }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>
                {totalResults} results for <strong style={{ color: 'var(--ink)' }}>"{query}"</strong>
              </div>

              {(tab === 'all' || tab === 'ai') && (
                <SearchResultGroup title="Ask AI" count={SEARCH_RESULTS.ai.length}>
                  {SEARCH_RESULTS.ai.map((r, i) => (
                    <div key={i} style={{ padding: '13px 16px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                        <ShieldedMark size={16} color="#fff"/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}><Highlight text={r.q} query={query}/></div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.sub}</div>
                      </div>
                      <span className="pill pill-navy" style={{ fontSize: 10 }}>Ask</span>
                      <Icons.Arrow size={13} style={{ color: 'var(--navy)' }}/>
                    </div>
                  ))}
                </SearchResultGroup>
              )}

              {(tab === 'all' || tab === 'claims') && (
                <SearchResultGroup title="Claims" count={SEARCH_RESULTS.claims.length}>
                  {SEARCH_RESULTS.claims.map((r, i) => (
                    <div key={i} style={{ padding: '13px 16px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                      <Icons.Claim size={16} style={{ color: 'var(--ink-4)', flex: 'none' }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                          <span className="mono" style={{ fontSize: 11, color: 'var(--navy)', fontWeight: 600 }}>{r.id}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.sub}</div>
                      </div>
                      <Icons.ChevronR size={13} style={{ color: 'var(--ink-4)' }}/>
                    </div>
                  ))}
                </SearchResultGroup>
              )}

              {(tab === 'all' || tab === 'policies') && (
                <SearchResultGroup title="Policies" count={SEARCH_RESULTS.policies.length}>
                  {SEARCH_RESULTS.policies.map((r, i) => (
                    <div key={i} style={{ padding: '13px 16px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                      <Icons.Shield size={16} style={{ color: 'var(--ink-4)', flex: 'none' }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.sub}</div>
                        {r.match && <div style={{ fontSize: 11, marginTop: 4, color: 'var(--ink-4)' }}>Found in: <Highlight text={r.match} query={query}/></div>}
                      </div>
                      <Icons.ChevronR size={13} style={{ color: 'var(--ink-4)' }}/>
                    </div>
                  ))}
                </SearchResultGroup>
              )}

              {(tab === 'all' || tab === 'docs') && (
                <SearchResultGroup title="Documents" count={SEARCH_RESULTS.documents.length}>
                  {SEARCH_RESULTS.documents.map((d, i) => (
                    <div key={i} style={{ padding: '13px 16px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }}>
                      <Icons.FileText size={16} style={{ color: 'var(--ink-4)', flex: 'none' }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                          <span className={`pill pill-${KIND_COLOR[d.kind] || 'neutral'}`} style={{ fontSize: 10, marginRight: 8 }}>{d.kind}</span>
                          {d.date} · {d.size}
                        </div>
                        {d.match && <div style={{ fontSize: 11, marginTop: 4, padding: '3px 8px', background: 'var(--amber-soft)', borderRadius: 4, color: 'var(--ink-3)', display: 'inline-block' }}>"…<Highlight text={d.match} query={query}/>…"</div>}
                      </div>
                      <Icons.ChevronR size={13} style={{ color: 'var(--ink-4)' }}/>
                    </div>
                  ))}
                </SearchResultGroup>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GlobalSearch });
