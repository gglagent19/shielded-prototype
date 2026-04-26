// AppShell.jsx — sidebar + topbar + AI panel wrapper used across all app screens

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'policy',    label: 'Policies',  icon: 'Shield', badge: 1 },
  { id: 'claims',    label: 'Claims',    icon: 'Claim', badge: 1 },
  { id: 'negotiate', label: 'Negotiate', icon: 'Scale' },
  { id: 'benchmark', label: 'Benchmarks',icon: 'TrendUp' },
  { id: 'deadlines', label: 'Deadlines', icon: 'Clock' },
  { id: 'documents', label: 'Documents', icon: 'Folder' },
];

const NAV_FOOT = [
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

// Maps nav IDs to design-canvas slot IDs (sectionId/artboardId).
// Called when clicking sidebar items in prototype/focus mode.
const DC_NAV_MAP = {
  dashboard: 'app/dash',
  policy:    'app/policies-list',
  claims:    'claim/claims-list',
  negotiate: 'claim/negotiate',
  benchmark: 'claim/benchmark',
  deadlines: 'claim/timeline',
  documents: 'app/documents',
  settings:  'app2/settings',
};

function dcNav(id) {
  const slot = DC_NAV_MAP[id];
  if (slot && window.__dcSetFocus) window.__dcSetFocus(slot);
}

function Sidebar({ active, onNav, compact }) {
  const width = compact ? 56 : 220;
  return (
    <aside style={{
      width, flex: 'none',
      borderRight: '1px solid var(--line)',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      padding: compact ? '14px 8px' : '14px 14px 14px 16px',
      gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: compact ? 'center' : 'space-between' }}>
        {compact
          ? <ShieldedMark size={22} color="var(--navy)" />
          : <ShieldedLogo size={19} color="var(--navy)" />
        }
      </div>

      {!compact && (
        <div className="card" style={{
          padding: '10px 12px', borderRadius: 10, background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--navy)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--f-serif)', fontSize: 14,
          }}>L</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {DEMO.business.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {DEMO.business.owner}
            </div>
          </div>
          <Icons.ChevronD size={14} style={{ color: 'var(--ink-4)' }} />
        </div>
      )}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => {
          const I = Icons[n.icon];
          const on = n.id === active;
          return (
            <button key={n.id} onClick={() => { onNav?.(n.id); dcNav(n.id); }} className="btn-quiet"
              style={{
                border: 'none', background: on ? 'var(--bg-subtle)' : 'transparent',
                color: on ? 'var(--ink)' : 'var(--ink-3)',
                padding: compact ? '9px 0' : '8px 10px',
                borderRadius: 7, display: 'flex', alignItems: 'center',
                justifyContent: compact ? 'center' : 'flex-start',
                gap: 10, fontSize: 13, fontWeight: on ? 500 : 400, cursor: 'pointer',
                position: 'relative',
              }}>
              <I size={16} stroke={on ? 1.8 : 1.5} />
              {!compact && <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>}
              {!compact && n.badge && (
                <span style={{
                  background: on ? 'var(--navy)' : 'var(--bg-muted)',
                  color: on ? '#fff' : 'var(--ink-3)',
                  fontSize: 10, padding: '1px 6px', borderRadius: 999, fontFamily: 'var(--f-mono)',
                }}>{n.badge}</span>
              )}
              {compact && n.badge && (
                <span style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 6, height: 6, borderRadius: 99, background: 'var(--amber)',
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }}/>

      {!compact && (
        <div style={{
          padding: 12, borderRadius: 10, border: '1px solid var(--line)',
          background: 'linear-gradient(180deg, var(--bg-card), var(--bg-subtle))',
          fontSize: 12, color: 'var(--ink-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Icons.Sparkle size={13} style={{ color: 'var(--navy)' }}/>
            <span style={{ fontWeight: 500 }}>Premium plan</span>
          </div>
          <div style={{ color: 'var(--ink-3)', fontSize: 11.5, lineHeight: 1.45 }}>
            Unlimited negotiation drafts, benchmarks, deadline alerts.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_FOOT.map(n => {
          const I = Icons[n.icon];
          return (
            <button key={n.id} onClick={() => dcNav(n.id)} className="btn-quiet" style={{
              border: 'none', background: 'transparent', color: 'var(--ink-3)',
              padding: compact ? '9px 0' : '8px 10px', borderRadius: 7,
              display: 'flex', alignItems: 'center', gap: 10,
              justifyContent: compact ? 'center' : 'flex-start',
              fontSize: 13, cursor: 'pointer',
            }}>
              <I size={16}/>
              {!compact && <span>{n.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, crumbs, right }) {
  return (
    <div style={{
      padding: '14px 28px',
      borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 16,
      background: 'var(--bg)',
      flex: 'none',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {crumbs && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-4)', marginBottom: 4 }}>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icons.ChevronR size={11} />}
                <span style={{ color: i === crumbs.length - 1 ? 'var(--ink-2)' : 'var(--ink-4)' }}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <h1 className="serif" style={{ margin: 0, fontSize: 26, letterSpacing: '-0.01em', lineHeight: 1.1, color: 'var(--ink)' }}>
            {title}
          </h1>
          {subtitle && <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, marginLeft: 4, borderLeft: '1px solid var(--line)' }}>
          <button className="btn btn-quiet btn-sm" style={{ padding: 6 }}><Icons.Bell size={15} /></button>
          <div style={{
            width: 28, height: 28, borderRadius: 99, background: 'var(--navy)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600,
          }}>MO</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, NAV });
