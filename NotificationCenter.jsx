// NotificationCenter.jsx — full notification panel, accessible from the bell icon

const NOTIFS = [
  {
    id: 1, kind: 'deadline', urgent: true,
    title: 'Proof of loss due in 5 days',
    body: 'Policy §7B requires sworn proof of loss by Apr 28. Shielded has a draft ready.',
    time: '2h ago', action: 'Review draft', icon: 'Clock',
  },
  {
    id: 2, kind: 'ai', urgent: false,
    title: 'Negotiation draft ready to review',
    body: 'We built a 3-clause rebuttal anchored in your policy. 412 words — takes 2 min to read.',
    time: '4h ago', action: 'Open draft', icon: 'Sparkle',
  },
  {
    id: 3, kind: 'claim', urgent: false,
    title: 'GreatWest requested additional documentation',
    body: 'Adjuster J. Halloran is requesting your contents inventory supplement by May 10.',
    time: 'Yesterday', action: 'View request', icon: 'Claim',
  },
  {
    id: 4, kind: 'benchmark', urgent: false,
    title: 'Benchmark dataset updated',
    body: 'Two new Asheville restaurant fire settlements added. Your fair range is now $41.2k–$53.8k.',
    time: '2 days ago', action: 'See benchmarks', icon: 'TrendUp',
  },
  {
    id: 5, kind: 'policy', urgent: false,
    title: 'Policy analysis complete — CPP-48291-B',
    body: 'Shielded flagged 3 issues: flood exclusion (high), income sub-limit (medium), deductible (low).',
    time: 'Apr 11', action: 'View analysis', icon: 'Shield',
  },
  {
    id: 6, kind: 'settlement', urgent: false,
    title: 'Settlement offer received from GreatWest',
    body: 'GreatWest Mutual submitted a formal offer of $28,400 for claim CLM-2041.',
    time: 'Apr 4', action: 'Review offer', icon: 'FileText',
  },
];

const KIND_COLOR = {
  deadline: 'red', ai: 'navy', claim: 'amber', benchmark: 'teal', policy: 'neutral', settlement: 'amber',
};

function NotifItem({ n, selected, onClick }) {
  const I = Icons[n.icon] || Icons.Bell;
  const kind = KIND_COLOR[n.kind] || 'neutral';
  return (
    <div onClick={onClick} style={{
      padding: '14px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
      background: selected ? '#eef2fb' : n.urgent ? 'linear-gradient(90deg, #fdf7ea 0%, transparent 30%)' : 'transparent',
      borderLeft: `3px solid ${n.urgent ? 'var(--amber)' : selected ? 'var(--navy)' : 'transparent'}`,
      cursor: 'pointer', transition: 'background .1s', borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flex: 'none',
        background: `var(--${kind === 'neutral' ? 'bg-subtle' : kind + '-soft'})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
      }}>
        <I size={16} style={{ color: `var(--${kind === 'neutral' ? 'ink-3' : kind})` }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
          <div style={{ flex: 1, fontSize: 13, fontWeight: n.urgent ? 600 : 500, lineHeight: 1.4 }}>{n.title}</div>
          {n.urgent && <span className="pill pill-red" style={{ fontSize: 9.5, flex: 'none' }}>Urgent</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 8 }}>{n.body}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, padding: '3px 10px' }}>
            {n.action} <Icons.Arrow size={10}/>
          </button>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{n.time}</span>
        </div>
      </div>
    </div>
  );
}

function NotificationCenter() {
  const [selected, setSelected] = React.useState(0);
  const [tab, setTab] = React.useState('all');
  const urgent = NOTIFS.filter(n => n.urgent);
  const visible = tab === 'urgent' ? urgent : NOTIFS;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }} className="shielded-root">
      {/* Sidebar */}
      <Sidebar active="dashboard" compact={false}/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Notifications" subtitle={`${urgent.length} urgent`} crumbs={['Notifications']}
          right={<button className="btn btn-ghost btn-sm"><Icons.Check size={13}/> Mark all read</button>}/>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Notif list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--line)', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', padding: '0 20px', flex: 'none', background: 'var(--bg-subtle)' }}>
              {[['all', 'All', NOTIFS.length], ['urgent', 'Urgent', urgent.length]].map(([id, label, count]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--f-sans)',
                  padding: '10px 14px', fontSize: 13, fontWeight: tab === id ? 600 : 400,
                  color: tab === id ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom: tab === id ? '2px solid var(--navy)' : '2px solid transparent',
                  marginBottom: -1, display: 'flex', gap: 6, alignItems: 'center',
                }}>
                  {label}
                  <span className="mono" style={{ fontSize: 10, padding: '1px 5px', borderRadius: 99, background: tab === id ? 'var(--navy)' : 'var(--bg-muted)', color: tab === id ? '#fff' : 'var(--ink-4)' }}>{count}</span>
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {visible.map((n, i) => (
                <NotifItem key={n.id} n={n} selected={i === selected} onClick={() => setSelected(i)}/>
              ))}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', background: 'var(--bg-subtle)' }}>
              <button className="btn btn-quiet btn-sm" style={{ fontSize: 12, color: 'var(--ink-4)' }}>
                View notification history
              </button>
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ width: 380, flex: 'none', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {(() => {
              const n = visible[selected];
              if (!n) return null;
              const I = Icons[n.icon] || Icons.Bell;
              const kind = KIND_COLOR[n.kind] || 'neutral';
              return (
                <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, flex: 'none', background: `var(--${kind === 'neutral' ? 'bg-subtle' : kind + '-soft'})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <I size={22} style={{ color: `var(--${kind === 'neutral' ? 'ink-3' : kind})` }}/>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{n.title}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.65, padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                    {n.body}
                    {n.kind === 'deadline' && (
                      <div className="card" style={{ padding: 14, marginTop: 14, background: 'var(--red-soft)', borderColor: 'var(--red)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>Why this matters</div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                          Missing the proof of loss deadline can void your right to dispute the settlement. NC courts generally hold policyholders to the written policy deadline.
                        </div>
                      </div>
                    )}
                    {n.kind === 'ai' && (
                      <div className="card" style={{ padding: 14, marginTop: 14, background: '#eef2fb', borderColor: 'var(--navy-soft)' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Icons.Sparkle size={14} style={{ color: 'var(--navy)', flex: 'none', marginTop: 2 }}/>
                          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                            Draft cites §4.2 (replacement cost), §3.4 (smoke scope), and §5.1 (income calc). Total recovery gap supported: <strong>$17,400</strong>.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
                      {n.action} <Icons.Arrow size={13}/>
                    </button>
                    <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                      <Icons.Check size={13}/> Mark as read
                    </button>
                    <button className="btn btn-quiet" style={{ justifyContent: 'center', fontSize: 12, color: 'var(--ink-4)' }}>
                      Snooze 1 day
                    </button>
                  </div>

                  {n.kind === 'deadline' && (
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--ink-4)', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                      <Icons.Bell size={14} style={{ flex: 'none', marginTop: 1 }}/>
                      <div>Notifications for CLM-2041 · <span style={{ color: 'var(--navy)', cursor: 'pointer' }}>Manage preferences</span></div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationCenter });
