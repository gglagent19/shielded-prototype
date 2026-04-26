// Documents.jsx — document vault: policies, evidence, correspondence

const ALL_DOCS = [
  { name: 'Policy — CPP-48291-B.pdf',           kind: 'Policy',         size: '2.4 MB',  date: 'Feb 14', claim: null,       status: 'verified', pages: 62 },
  { name: 'Declarations page.pdf',              kind: 'Policy',         size: '480 KB',  date: 'Feb 14', claim: null,       status: 'verified', pages: 4 },
  { name: 'Fire marshal report.pdf',            kind: 'Evidence',       size: '1.1 MB',  date: 'Mar 14', claim: 'CLM-2041', status: 'verified', pages: 8 },
  { name: 'Witness statement — S. Nguyen.pdf',  kind: 'Evidence',       size: '210 KB',  date: 'Mar 16', claim: 'CLM-2041', status: 'pending',  pages: 3 },
  { name: 'Kitchen damage — 34 photos.zip',     kind: 'Photos',         size: '142 MB',  date: 'Mar 12', claim: 'CLM-2041', status: 'verified', pages: null },
  { name: 'Hood close-ups — 8 photos.zip',      kind: 'Photos',         size: '21 MB',   date: 'Mar 13', claim: 'CLM-2041', status: 'verified', pages: null },
  { name: 'Contents inventory v2.xlsx',         kind: 'Inventory',      size: '88 KB',   date: 'Mar 22', claim: 'CLM-2041', status: 'pending',  pages: null },
  { name: 'Equipment list + RCV estimates.xlsx',kind: 'Inventory',      size: '44 KB',   date: 'Mar 25', claim: 'CLM-2041', status: 'pending',  pages: null },
  { name: "Adjuster's estimate — GreatWest.pdf",kind: 'Estimate',       size: '640 KB',  date: 'Apr 04', claim: 'CLM-2041', status: 'verified', pages: 12 },
  { name: 'Vendor estimate — Apex Restore.pdf', kind: 'Estimate',       size: '305 KB',  date: 'Mar 28', claim: 'CLM-2041', status: 'verified', pages: 6 },
  { name: 'Notice of loss — Mar 11.pdf',        kind: 'Correspondence', size: '95 KB',   date: 'Mar 11', claim: 'CLM-2041', status: 'verified', pages: 2 },
  { name: 'GreatWest settlement offer.pdf',     kind: 'Correspondence', size: '420 KB',  date: 'Apr 04', claim: 'CLM-2041', status: 'verified', pages: 5 },
];

const KIND_COLOR = {
  Policy: 'navy', Evidence: 'amber', Photos: 'neutral',
  Inventory: 'teal', Estimate: 'red', Correspondence: 'neutral',
};

const FILE_EXT = (name) => {
  const m = name.match(/\.(\w+)$/);
  return m ? m[1].toUpperCase() : '—';
};

function FileIcon({ name, size = 32 }) {
  const ext = FILE_EXT(name);
  const colors = { PDF: '#d94f3d', XLSX: '#1e7e34', ZIP: '#7a5af8', PNG: '#0f7d6c', JPG: '#0f7d6c' };
  const c = colors[ext] || '#8a93a1';
  return (
    <div style={{
      width: size, height: size + 8, borderRadius: 4, background: '#f6f3ee',
      border: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-end', flex: 'none', overflow: 'hidden',
    }}>
      <div style={{ flex: 1 }}/>
      <div style={{
        width: '100%', padding: '2px 0', textAlign: 'center', background: c,
        fontSize: size < 32 ? 7 : 8, fontFamily: 'var(--f-mono)', fontWeight: 600, color: '#fff',
        letterSpacing: '0.05em',
      }}>{ext}</div>
    </div>
  );
}

function DocDetail({ doc }) {
  if (!doc) return null;
  const statusKind = doc.status === 'verified' ? 'teal' : 'amber';

  return (
    <div style={{
      width: 280, flex: 'none', borderLeft: '1px solid var(--line)',
      background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      {/* Preview stub */}
      <div style={{
        height: 160, background: `
          linear-gradient(180deg, rgba(20,24,31,0.1), rgba(20,24,31,0.25)),
          repeating-linear-gradient(45deg, var(--bg-muted) 0 10px, var(--bg-subtle) 10px 20px)
        `,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--line)',
      }}>
        <FileIcon name={doc.name} size={48}/>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{doc.name}</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className={`pill pill-${KIND_COLOR[doc.kind]}`}>{doc.kind}</span>
            <span className={`pill pill-${statusKind}`}>
              {doc.status === 'verified'
                ? <><Icons.Check size={9} style={{ strokeWidth: 3 }}/> Verified</>
                : <><Icons.Clock size={9}/> Pending</>}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Size',    doc.size],
            ['Added',   doc.date],
            ['Claim',   doc.claim || '— (policy doc)'],
            ['Pages',   doc.pages ? doc.pages + ' pages' : '—'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span style={{ color: 'var(--ink-4)' }}>{l}</span>
              <span className="mono" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="hr"/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Icons.Download size={13}/> Download
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
            <Icons.Sparkle size={13}/> Analyze with AI
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
            <Icons.Copy size={13}/> Copy link
          </button>
        </div>

        {doc.kind === 'Estimate' && (
          <div className="card" style={{ padding: 12, background: '#eef2fb', borderColor: 'var(--navy-soft)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Icons.Sparkle size={14} style={{ color: 'var(--navy)', flex: 'none', marginTop: 1 }}/>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                Shielded has reviewed this estimate and flagged <strong>3 line items</strong> below replacement cost.
              </div>
            </div>
          </div>
        )}

        {doc.status === 'pending' && (
          <div className="card" style={{ padding: 12, background: 'var(--amber-soft)', borderColor: 'var(--amber)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Icons.Alert size={14} style={{ color: 'var(--amber)', flex: 'none', marginTop: 1 }}/>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                Awaiting adjuster confirmation before this document is accepted into the claim file.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Documents() {
  const FILTERS = ['All', 'Policy', 'Evidence', 'Photos', 'Inventory', 'Estimate', 'Correspondence'];
  const [filter, setFilter] = React.useState('All');
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  const visible = filter === 'All' ? ALL_DOCS : ALL_DOCS.filter(d => d.kind === filter);
  const selected = visible[selectedIdx] || null;

  const counts = {};
  FILTERS.forEach(f => { counts[f] = f === 'All' ? ALL_DOCS.length : ALL_DOCS.filter(d => d.kind === f).length; });
  const verified = ALL_DOCS.filter(d => d.status === 'verified').length;
  const pending = ALL_DOCS.filter(d => d.status === 'pending').length;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left: list + filters */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '22px 28px 0', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="eyebrow">Vault</div>
              <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Documents</h2>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                {ALL_DOCS.length} files · {verified} verified · {pending} awaiting review
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm"><Icons.Search size={13}/> Search</button>
              <button className="btn btn-ghost btn-sm"><Icons.Filter size={13}/> Sort</button>
              <button className="btn btn-primary"><Icons.Upload size={13}/> Upload</button>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--line)', paddingBottom: 0, overflowX: 'auto' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setFilter(f); setSelectedIdx(0); }} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                padding: '8px 12px', fontSize: 12.5, fontFamily: 'var(--f-sans)',
                fontWeight: filter === f ? 600 : 400,
                color: filter === f ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: filter === f ? '2px solid var(--navy)' : '2px solid transparent',
                marginBottom: -1, flex: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {f}
                {counts[f] > 0 && (
                  <span className="mono" style={{
                    fontSize: 10, padding: '1px 5px', borderRadius: 99,
                    background: filter === f ? 'var(--navy)' : 'var(--bg-subtle)',
                    color: filter === f ? '#fff' : 'var(--ink-4)',
                  }}>{counts[f]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 28px 28px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Column headers */}
            <div style={{
              padding: '9px 16px',
              display: 'grid', gridTemplateColumns: '1fr 110px 80px 64px 90px 32px',
              gap: 12, alignItems: 'center',
              borderBottom: '1px solid var(--line)',
              background: 'var(--bg-subtle)',
            }}>
              {['Name', 'Type', 'Size', 'Added', 'Status', ''].map((h, i) => (
                <span key={i} className="eyebrow" style={{ fontSize: 9.5, textAlign: i === 2 || i === 3 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {visible.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                No {filter} documents yet.
              </div>
            ) : visible.map((d, i) => {
              const on = i === selectedIdx;
              return (
                <div key={i} onClick={() => setSelectedIdx(i)} style={{
                  padding: '11px 16px',
                  display: 'grid', gridTemplateColumns: '1fr 110px 80px 64px 90px 32px',
                  gap: 12, alignItems: 'center',
                  borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                  background: on ? '#eef2fb' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background .1s',
                }}>
                  {/* Name + icon */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                    <FileIcon name={d.name}/>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: on ? 500 : 400,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        color: on ? 'var(--navy)' : 'var(--ink)',
                      }}>{d.name}</div>
                      {d.claim && (
                        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{d.claim}</div>
                      )}
                    </div>
                  </div>

                  {/* Kind */}
                  <span className={`pill pill-${KIND_COLOR[d.kind]}`} style={{ fontSize: 10.5 }}>{d.kind}</span>

                  {/* Size */}
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'right' }}>{d.size}</span>

                  {/* Date */}
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-4)', textAlign: 'right' }}>{d.date}</span>

                  {/* Status */}
                  {d.status === 'verified'
                    ? <span className="pill pill-teal" style={{ fontSize: 10.5 }}><Icons.Check size={9} style={{ strokeWidth: 3 }}/> Verified</span>
                    : <span className="pill pill-amber" style={{ fontSize: 10.5 }}><Icons.Clock size={9}/> Pending</span>}

                  {/* Actions */}
                  <button className="btn btn-quiet btn-sm" style={{ padding: 4, justifyContent: 'center' }}
                    onClick={e => e.stopPropagation()}>
                    <Icons.Dots size={13}/>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload CTA */}
          <div style={{
            marginTop: 14, padding: '18px 24px',
            border: '1.5px dashed var(--line-2)', borderRadius: 10,
            background: 'var(--bg-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            cursor: 'pointer',
          }}>
            <Icons.Upload size={16} style={{ color: 'var(--ink-4)' }}/>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              Drop files here or <span style={{ color: 'var(--navy)', fontWeight: 500, cursor: 'pointer' }}>click to upload</span>
              <span className="mono" style={{ fontSize: 11, marginLeft: 8, color: 'var(--ink-4)' }}>PDF · DOCX · XLSX · ZIP · JPG · up to 250 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: detail panel */}
      <DocDetail doc={selected}/>
    </div>
  );
}

Object.assign(window, { Documents });
