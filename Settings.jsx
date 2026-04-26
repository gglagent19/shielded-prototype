// Settings.jsx — account, notifications, billing, security

function SettingsSection({ title, children }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg-subtle)' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, sub, right, danger }) {
  return (
    <div style={{
      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
      borderTop: '1px solid var(--line)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: danger ? 'var(--red)' : 'var(--ink)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div style={{
      width: 36, height: 20, borderRadius: 99,
      background: on ? 'var(--navy)' : 'var(--bg-muted)',
      position: 'relative', cursor: 'pointer', transition: 'background .15s', flex: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16,
        borderRadius: 99, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transition: 'left .15s',
      }}/>
    </div>
  );
}

function PlanBadge({ name, color }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: color === 'navy' ? 'var(--navy)' : 'var(--bg-subtle)',
      color: color === 'navy' ? '#fff' : 'var(--ink-3)',
      fontFamily: 'var(--f-mono)', letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>{name}</span>
  );
}

function Settings() {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px 32px' }}>
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <div className="eyebrow">Account</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Settings</h2>
        </div>

        {/* Profile */}
        <SettingsSection title="Profile">
          <SettingsRow label="Full name" sub="Visible on reports and correspondence"
            right={<><span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Maya Okafor</span><button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/></button></>}/>
          <SettingsRow label="Email" sub="Used for deadlines alerts and account access"
            right={<><span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>maya@lumenandloaf.com</span><button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/></button></>}/>
          <SettingsRow label="Business name"
            right={<><span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Lumen & Loaf</span><button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/></button></>}/>
          <SettingsRow label="Location"
            right={<><span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Asheville, NC</span><button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/></button></>}/>
        </SettingsSection>

        {/* Billing */}
        <SettingsSection title="Plan & billing">
          <SettingsRow label="Current plan"
            sub="Renews May 23, 2026 · $150/month"
            right={<><PlanBadge name="Premium" color="navy"/><button className="btn btn-ghost btn-sm">Manage</button></>}/>
          <SettingsRow label="Payment method"
            sub="Visa ending 6411 · expires 09/28"
            right={<button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/> Update</button>}/>
          <SettingsRow label="Billing history"
            right={<button className="btn btn-quiet btn-sm">View invoices <Icons.ExternalLink size={11}/></button>}/>
          <SettingsRow label="Downgrade to Basic"
            sub="Removes AI negotiation drafts and settlement benchmarking"
            right={<button className="btn btn-ghost btn-sm" style={{ color: 'var(--ink-3)' }}>Downgrade</button>}/>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          {[
            { l: 'Deadline reminders', sub: 'Email + push alerts 7 days and 24h before policy deadlines', on: true },
            { l: 'Claim status updates', sub: 'When your insurer responds or requests documentation', on: true },
            { l: 'AI draft ready', sub: 'When a negotiation letter is ready to review', on: true },
            { l: 'Policy renewal warnings', sub: '60-day and 30-day renewal reminders', on: false },
            { l: 'Weekly summary digest', sub: 'Every Monday — open claims, upcoming deadlines', on: false },
          ].map(n => (
            <SettingsRow key={n.l} label={n.l} sub={n.sub} right={<Toggle on={n.on}/>}/>
          ))}
        </SettingsSection>

        {/* AI preferences */}
        <SettingsSection title="AI assistant">
          <SettingsRow label="Tone"
            sub="Voice used in negotiation drafts and claim summaries"
            right={
              <div style={{ display: 'flex', gap: 4 }}>
                {['Assertive', 'Balanced', 'Formal'].map((t, i) => (
                  <button key={t} className="btn btn-ghost btn-sm" style={{
                    borderColor: i === 0 ? 'var(--navy)' : 'var(--line)',
                    background: i === 0 ? '#eef2fb' : 'transparent',
                    color: i === 0 ? 'var(--navy)' : 'var(--ink-3)',
                    fontSize: 11.5,
                  }}>{t}</button>
                ))}
              </div>
            }/>
          <SettingsRow label="Auto-cite policy clauses"
            sub="Automatically attach relevant clause references to AI drafts"
            right={<Toggle on={true}/>}/>
          <SettingsRow label="Include comparable claims"
            sub="Append benchmark data from similar claims to each negotiation draft"
            right={<Toggle on={true}/>}/>
        </SettingsSection>

        {/* Integrations */}
        <SettingsSection title="Integrations">
          {[
            { name: 'Google Calendar', sub: 'Sync claim deadlines to your calendar', icon: 'Calendar', connected: true },
            { name: 'Dropbox',         sub: 'Auto-backup documents to Dropbox',      icon: 'Folder',   connected: false },
            { name: 'Slack',           sub: 'Receive claim alerts in Slack',          icon: 'Chat',     connected: false },
          ].map(int => {
            const I = Icons[int.icon];
            return (
              <SettingsRow key={int.name}
                label={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--bg-subtle)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I size={13} style={{ color: 'var(--ink-3)' }}/>
                  </div>
                  {int.name}
                </span>}
                sub={int.sub}
                right={
                  int.connected
                    ? <><span className="pill pill-teal" style={{ fontSize: 10 }}><Icons.Check size={9} style={{ strokeWidth: 3 }}/> Connected</span><button className="btn btn-quiet btn-sm" style={{ fontSize: 11 }}>Disconnect</button></>
                    : <button className="btn btn-ghost btn-sm">Connect</button>
                }/>
            );
          })}
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="Security">
          <SettingsRow label="Password"
            sub="Last changed 6 months ago"
            right={<button className="btn btn-ghost btn-sm">Change password</button>}/>
          <SettingsRow label="Two-factor authentication"
            sub="Authenticator app enabled"
            right={<><span className="pill pill-teal" style={{ fontSize: 10 }}><Icons.Check size={9} style={{ strokeWidth: 3 }}/> On</span><button className="btn btn-quiet btn-sm">Manage</button></>}/>
          <SettingsRow label="Active sessions"
            sub="2 devices: MacBook Pro · iPhone 15"
            right={<button className="btn btn-quiet btn-sm">View all</button>}/>
          <SettingsRow label="Export your data"
            sub="Download all claims, documents, and AI drafts as a ZIP"
            right={<button className="btn btn-ghost btn-sm"><Icons.Download size={12}/> Export</button>}/>
          <SettingsRow label="Delete account" danger
            sub="Permanently remove all data. Cannot be undone."
            right={<button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red-soft)' }}>Delete</button>}/>
        </SettingsSection>

      </div>
    </div>
  );
}

Object.assign(window, { Settings });
