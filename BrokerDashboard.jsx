// BrokerDashboard.jsx — multi-client view for brokers (Enterprise plan)

const BROKER_CLIENTS = [
  { name: 'Lumen & Loaf',         type: 'Restaurant',     loc: 'Asheville, NC',  score: 72, activeClaims: 1, gap: 19400, lastActivity: 'Today',    flag: 'Negotiating' },
  { name: 'Silver Lake Bakery',   type: 'Bakery',         loc: 'Durham, NC',     score: 85, activeClaims: 0, gap: 0,     lastActivity: '3 days',   flag: null },
  { name: 'Nomad Coffee Co.',     type: 'Café',           loc: 'Charlotte, NC',  score: 61, activeClaims: 1, gap: 8200,  lastActivity: 'Yesterday', flag: 'In review' },
  { name: 'Roan + Oak Studio',    type: 'Retail',         loc: 'Raleigh, NC',    score: 79, activeClaims: 0, gap: 0,     lastActivity: '1 week',   flag: null },
  { name: 'The Sorting Yard',     type: 'Warehouse',      loc: 'Greensboro, NC', score: 55, activeClaims: 0, gap: 0,     lastActivity: '2 weeks',  flag: 'Coverage gap' },
  { name: 'Studio 14 Salon',      type: 'Personal svc.',  loc: 'Wilmington, NC', score: 88, activeClaims: 0, gap: 0,     lastActivity: '3 days',   flag: null },
  { name: 'Wilkinson & Greer',    type: 'Professional',   loc: 'Cary, NC',       score: 91, activeClaims: 0, gap: 0,     lastActivity: '5 days',   flag: null },
  { name: 'Piedmont Provisions',  type: 'Grocery',        loc: 'Chapel Hill, NC',score: 68, activeClaims: 1, gap: 12100, lastActivity: 'Yesterday', flag: 'Negotiating' },
];

const STATUS_KIND = { 'Negotiating': 'amber', 'In review': 'navy', 'Coverage gap': 'red' };

function MiniScoreBar({ score }) {
  const color = score >= 80 ? 'var(--teal)' : score >= 65 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: score + '%', height: '100%', background: color, borderRadius: 99, transition: 'width .3s' }}/>
      </div>
      <span className="mono" style={{ fontSize: 11, color, width: 24, textAlign: 'right', fontWeight: 600 }}>{score}</span>
    </div>
  );
}

function BrokerSidebar() {
  const items = [
    { label: 'Clients', icon: 'Building', on: true },
    { label: 'Active claims', icon: 'Claim', badge: 3 },
    { label: 'Benchmarks', icon: 'TrendUp' },
    { label: 'Documents', icon: 'Folder' },
    { label: 'Reports', icon: 'FileText' },
    { label: 'Referrals', icon: 'User' },
  ];
  return (
    <aside style={{
      width: 220, flex: 'none', borderRight: '1px solid var(--line)',
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      padding: '14px 14px 14px 16px', gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ShieldedLogo size={17} color="var(--navy)" />
        <span className="mono" style={{ fontSize: 9, padding: '2px 6px', background: 'var(--navy)', color: '#fff', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Broker</span>
      </div>

      <div className="card" style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-serif)', fontSize: 14 }}>WG</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Wilkinson & Greer</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Independent brokerage</div>
        </div>
        <Icons.ChevronD size={13} style={{ color: 'var(--ink-4)' }}/>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(n => {
          const I = Icons[n.icon];
          return (
            <button key={n.label} className="btn-quiet" style={{
              border: 'none', background: n.on ? 'var(--bg-subtle)' : 'transparent',
              color: n.on ? 'var(--ink)' : 'var(--ink-3)',
              padding: '8px 10px', borderRadius: 7,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: n.on ? 500 : 400, cursor: 'pointer',
            }}>
              <I size={16} stroke={n.on ? 1.8 : 1.5}/>
              <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
              {n.badge && (
                <span style={{ background: 'var(--amber)', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 99, fontFamily: 'var(--f-mono)' }}>{n.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }}/>

      <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--line)', background: 'linear-gradient(180deg, var(--bg-card), var(--bg-subtle))', fontSize: 12, color: 'var(--ink-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Icons.Sparkle size={13} style={{ color: 'var(--navy)' }}/>
          <span style={{ fontWeight: 500 }}>Enterprise</span>
        </div>
        <div style={{ color: 'var(--ink-3)', fontSize: 11.5, lineHeight: 1.45 }}>
          {BROKER_CLIENTS.length} clients · white-label reports · API access
        </div>
      </div>

      <button className="btn-quiet" style={{ border: 'none', background: 'transparent', color: 'var(--ink-3)', padding: '8px 10px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer' }}>
        <Icons.Settings size={16}/> <span>Settings</span>
      </button>
    </aside>
  );
}

function BrokerDashboard() {
  const [selected, setSelected] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const fmt = n => n > 0 ? '+$' + (n/1000).toFixed(1) + 'k' : '—';

  const totalGap = BROKER_CLIENTS.reduce((a, c) => a + c.gap, 0);
  const activeClaims = BROKER_CLIENTS.reduce((a, c) => a + c.activeClaims, 0);
  const atRisk = BROKER_CLIENTS.filter(c => c.score < 65).length;

  const visible = search
    ? BROKER_CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()))
    : BROKER_CLIENTS;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }} className="shielded-root">
      <BrokerSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg)', flex: 'none' }}>
          <div style={{ flex: 1 }}>
            <h1 className="serif" style={{ margin: 0, fontSize: 26, letterSpacing: '-0.01em' }}>Client portfolio</h1>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{BROKER_CLIENTS.length} businesses · Wilkinson & Greer brokerage</div>
          </div>
          <button className="btn btn-ghost btn-sm"><Icons.Download size={13}/> Export CSV</button>
          <button className="btn btn-primary btn-sm"><Icons.Plus size={13}/> Add client</button>
          <div style={{ paddingLeft: 12, marginLeft: 4, borderLeft: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-quiet btn-sm" style={{ padding: 6 }}><Icons.Bell size={15}/></button>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>JW</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Summary strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { l: 'Total clients',       v: BROKER_CLIENTS.length,  sub: '2 added this month',    icon: 'Building', color: 'neutral' },
              { l: 'Active claims',       v: activeClaims,            sub: 'Across portfolio',       icon: 'Claim',    color: 'amber'   },
              { l: 'Total recovery gap',  v: '$' + (totalGap/1000).toFixed(1) + 'k', sub: 'In negotiation', icon: 'TrendUp', color: 'red' },
              { l: 'Low-score policies',  v: atRisk,                  sub: 'Score < 65 · need review',icon: 'Alert',  color: 'red'     },
            ].map(s => {
              const I = Icons[s.icon];
              return (
                <div key={s.l} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, flex: 'none', background: s.color === 'red' ? 'var(--red-soft)' : s.color === 'amber' ? 'var(--amber-soft)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I size={16} style={{ color: s.color === 'red' ? 'var(--red)' : s.color === 'amber' ? 'var(--amber)' : 'var(--ink-3)' }}/>
                  </div>
                  <div>
                    <div className="eyebrow">{s.l}</div>
                    <div className="serif num-t" style={{ fontSize: 24, lineHeight: 1.1 }}>{s.v}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Client table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Search + filter bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--bg-subtle)' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Icons.Search size={13} style={{ position: 'absolute', left: 10, color: 'var(--ink-4)' }}/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search clients…" style={{ width: '100%', paddingLeft: 30, fontSize: 12.5 }}/>
              </div>
              <button className="btn btn-ghost btn-sm"><Icons.Filter size={12}/> Filter</button>
              <button className="btn btn-ghost btn-sm"><Icons.List size={12}/> Sort: Recent</button>
            </div>

            {/* Column headers */}
            <div style={{
              padding: '9px 16px', display: 'grid',
              gridTemplateColumns: '1.8fr 100px 80px 140px 110px 110px 80px',
              gap: 12, borderBottom: '1px solid var(--line)',
            }}>
              {['Client', 'Type', 'Score', 'Coverage quality', 'Active claims', 'Gap in play', 'Last activity'].map((h, i) => (
                <span key={i} className="eyebrow" style={{ fontSize: 9.5 }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {visible.map((c, i) => (
              <div key={i} onClick={() => setSelected(i)} style={{
                padding: '13px 16px', display: 'grid',
                gridTemplateColumns: '1.8fr 100px 80px 140px 110px 110px 80px',
                gap: 12, alignItems: 'center',
                borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                background: i === selected ? '#eef2fb' : 'transparent',
                cursor: 'pointer', transition: 'background .1s',
              }}>
                {/* Name */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: i === selected ? 600 : 500, color: i === selected ? 'var(--navy)' : 'var(--ink)' }}>{c.name}</div>
                    {c.flag && <span className={`pill pill-${STATUS_KIND[c.flag]}`} style={{ fontSize: 9.5 }}>{c.flag}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.loc}</div>
                </div>
                {/* Type */}
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.type}</span>
                {/* Score number */}
                <span className="serif num-t" style={{ fontSize: 17, color: c.score >= 80 ? 'var(--teal)' : c.score >= 65 ? 'var(--amber)' : 'var(--red)' }}>{c.score}</span>
                {/* Score bar */}
                <MiniScoreBar score={c.score}/>
                {/* Active claims */}
                <div style={{ textAlign: 'center' }}>
                  {c.activeClaims > 0
                    ? <span className="pill pill-amber">{c.activeClaims} active</span>
                    : <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>—</span>}
                </div>
                {/* Gap */}
                <span className="serif num-t" style={{ fontSize: 15, color: c.gap > 0 ? 'var(--red)' : 'var(--ink-4)' }}>{fmt(c.gap)}</span>
                {/* Last activity */}
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.lastActivity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BrokerDashboard });
