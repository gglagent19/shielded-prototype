// Timeline.jsx — deadline timeline

function Timeline() {
  const events = [
    { date: 'Mar 11', day: -43, title: 'Date of loss',                  kind: 'event',   status: 'done', icon: 'Alert' },
    { date: 'Mar 11', day: -43, title: 'Notice of loss sent',           kind: 'you',     status: 'done', icon: 'Mail' },
    { date: 'Mar 14', day: -40, title: 'Fire marshal report obtained',  kind: 'evidence',status: 'done', icon: 'FileText' },
    { date: 'Mar 22', day: -32, title: 'Contents inventory submitted',  kind: 'you',     status: 'done', icon: 'List' },
    { date: 'Apr 04', day: -19, title: 'Insurer inspection',            kind: 'insurer', status: 'done', icon: 'Building' },
    { date: 'Apr 04', day: -19, title: 'Settlement offer received',     kind: 'insurer', status: 'done', icon: 'Mail', amount: '$28,400' },
    { date: 'Apr 23', day: 0,   title: 'Today',                         kind: 'now',     status: 'now',  icon: 'Target' },
    { date: 'Apr 28', day: 5,   title: 'Sworn proof of loss due',       kind: 'deadline',status: 'soon', icon: 'Flag', source: 'Policy §7B' },
    { date: 'May 02', day: 9,   title: '60-day response window closes', kind: 'deadline',status: 'soon', icon: 'Clock', source: 'NC §58-63' },
    { date: 'May 10', day: 17,  title: 'Contents inventory supplement', kind: 'you',     status: 'upcoming', icon: 'Upload' },
    { date: 'Jun 11', day: 49,  title: '90-day checkpoint',             kind: 'internal',status: 'upcoming', icon: 'CheckCircle' },
    { date: 'Sep 11', day: 141, title: 'NC 6-month bad-faith threshold',kind: 'legal',   status: 'upcoming', icon: 'Scale' },
  ];

  const kindColor = {
    event: 'var(--ink)', you: 'var(--navy)', evidence: 'var(--ink-2)',
    insurer: 'var(--amber)', now: 'var(--teal)',
    deadline: 'var(--red)', internal: 'var(--ink-3)', legal: 'var(--gold)',
  };

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Claim {DEMO.activeClaim.id}</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
            Claim timeline
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            Day 43 of your claim. 2 deadlines this week.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Calendar size={13}/> Sync to calendar</button>
          <button className="btn btn-ghost"><Icons.Bell size={13}/> Reminder settings</button>
        </div>
      </div>

      {/* Mini chart */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="eyebrow">Progress from loss → resolution</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>Typical NC restaurant fire claim closes in 90–140 days.</div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--ink-3)' }}>
            <div><span className="dot" style={{ background: 'var(--navy)', marginRight: 6 }}/> You</div>
            <div><span className="dot" style={{ background: 'var(--amber)', marginRight: 6 }}/> Insurer</div>
            <div><span className="dot" style={{ background: 'var(--red)', marginRight: 6 }}/> Deadline</div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 60, padding: '0 10px' }}>
          <div style={{ position: 'absolute', left: 10, right: 10, top: 28, height: 2, background: 'var(--line)' }}/>
          <div style={{ position: 'absolute', left: 10, top: 28, height: 2, width: '30%', background: 'var(--teal)' }}/>
          {[-43, -40, -32, -19, 0, 5, 9, 17, 49, 141].map((d, i) => {
            const total = 141 + 43; // from -43 to 141
            const x = ((d + 43) / total) * 100;
            const isNow = d === 0;
            const color = isNow ? 'var(--teal)' : d < 0 ? 'var(--navy)' : d <= 9 ? 'var(--red)' : 'var(--ink-3)';
            return (
              <div key={i} style={{
                position: 'absolute', left: `calc(10px + ${x}% * (100% - 20px) / 100)`, top: 22,
                width: isNow ? 14 : 10, height: isNow ? 14 : 10, borderRadius: 99,
                background: color, border: '2px solid var(--bg-card)',
                transform: 'translate(-50%, 0)',
                boxShadow: isNow ? '0 0 0 4px color-mix(in oklab, var(--teal) 20%, transparent)' : 'none',
              }}/>
            );
          })}
          <div className="mono" style={{ position: 'absolute', left: 10, top: 44, fontSize: 10, color: 'var(--ink-4)' }}>LOSS Mar 11</div>
          <div className="mono" style={{ position: 'absolute', left: '30%', top: 44, fontSize: 10, color: 'var(--teal)', transform: 'translateX(-50%)' }}>TODAY</div>
          <div className="mono" style={{ position: 'absolute', right: 10, top: 44, fontSize: 10, color: 'var(--ink-4)' }}>Sep 11 →</div>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>All events</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'You', 'Insurer', 'Deadlines'].map((f, i) => (
              <button key={f} className="btn btn-ghost btn-sm" style={{
                borderColor: i === 0 ? 'var(--navy)' : 'var(--line)',
                background: i === 0 ? '#eef2fb' : 'transparent',
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '8px 0' }}>
          {events.map((e, i) => {
            const I = Icons[e.icon];
            const isNow = e.status === 'now';
            const isSoon = e.status === 'soon';
            return (
              <div key={i} style={{
                padding: '10px 22px', display: 'grid',
                gridTemplateColumns: '90px 24px 1fr auto', gap: 14, alignItems: 'center',
                position: 'relative',
                background: isNow ? '#e9f7f4' : 'transparent',
              }}>
                {/* Vertical connector */}
                {i < events.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 90 + 14 + 11, top: 28, bottom: -10,
                    width: 1, background: 'var(--line)',
                  }}/>
                )}
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase' }}>{e.date}</div>
                  <div style={{ fontSize: 11.5, color: isNow ? 'var(--teal)' : isSoon ? 'var(--red)' : 'var(--ink-3)', fontWeight: isNow || isSoon ? 500 : 400 }} className="mono">
                    {e.day === 0 ? 'today' : e.day < 0 ? `${e.day}d` : `+${e.day}d`}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 99, flex: 'none',
                  background: e.status === 'done' ? 'var(--bg-card)' : kindColor[e.kind],
                  color: e.status === 'done' ? kindColor[e.kind] : '#fff',
                  border: e.status === 'done' ? `1.5px solid ${kindColor[e.kind]}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isNow ? '0 0 0 4px color-mix(in oklab, var(--teal) 25%, transparent)' : 'none',
                  zIndex: 1,
                }}>
                  <I size={11} stroke={2}/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: isNow || isSoon ? 500 : 400 }}>
                    {e.title}
                    {e.amount && <span className="mono" style={{ marginLeft: 8, color: 'var(--amber)' }}>{e.amount}</span>}
                  </div>
                  {e.source && <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{e.source}</div>}
                </div>
                <div>
                  {e.status === 'done' && <span className="pill pill-neutral"><Icons.Check size={10}/> done</span>}
                  {e.status === 'now' && <span className="pill pill-teal"><span className="dot pulse" style={{ background: 'var(--teal)' }}/> today</span>}
                  {e.status === 'soon' && <span className="pill pill-red">Due in {e.day}d</span>}
                  {e.status === 'upcoming' && <span className="pill pill-neutral">Upcoming</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Timeline });
