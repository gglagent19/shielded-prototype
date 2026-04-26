// ErrorPages.jsx — 404 and app error states

function NotFound() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', overflow: 'hidden' }} className="shielded-root">
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 32px' }}>
        {/* Shield with crack / question mark */}
        <div style={{ position: 'relative', width: 80, height: 88, margin: '0 auto 28px' }}>
          <svg width="80" height="88" viewBox="0 0 80 88" fill="none">
            <path d="M40 4 L74 14 V44 C74 63 58 77 40 84 C22 77 6 63 6 44 V14 L40 4 Z" stroke="var(--line-2)" strokeWidth="2.5" fill="none"/>
            <text x="40" y="56" textAnchor="middle" style={{ fontSize: 28, fill: 'var(--ink-4)', fontFamily: 'Georgia, serif' }}>?</text>
          </svg>
        </div>

        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>404 · Page not found</div>
        <h1 className="serif" style={{ margin: '0 0 12px', fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          This page doesn't exist.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, margin: '0 0 28px' }}>
          The link might be broken, expired, or you may not have access. If you followed a link from an email, check that you're signed in as the right account.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          <button className="btn btn-primary"><Icons.Home size={14}/> Go to dashboard</button>
          <button className="btn btn-ghost"><Icons.ChevronL size={12}/> Go back</button>
        </div>

        <div className="card" style={{ padding: '14px 18px', textAlign: 'left', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--ink-2)' }}>Quick links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Dashboard', 'Home · Overview'],
              ['Claims', 'Your active and past claims'],
              ['Policies', 'Uploaded insurance policies'],
              ['Documents', 'Your document vault'],
            ].map(([label, sub]) => (
              <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', padding: '4px 0' }}>
                <Icons.ChevronR size={12} style={{ color: 'var(--ink-4)', flex: 'none' }}/>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-4)', marginLeft: 8 }}>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppError() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }} className="shielded-root">
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 32px' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--red-soft)', border: '1px solid var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Icons.Alert size={32} style={{ color: 'var(--red)' }}/>
        </div>

        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Something went wrong</div>
        <h1 className="serif" style={{ margin: '0 0 12px', fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          We hit an unexpected error.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, margin: '0 0 28px' }}>
          This has been automatically reported. Your claim data is safe — this error only affected the current view.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          <button className="btn btn-primary"><Icons.TrendUp size={14}/> Reload page</button>
          <button className="btn btn-ghost"><Icons.Home size={13}/> Dashboard</button>
        </div>

        <div className="card" style={{ padding: '14px 18px', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Icons.Info size={15} style={{ color: 'var(--ink-4)', flex: 'none', marginTop: 1 }}/>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>
              Error ID <span className="mono" style={{ color: 'var(--ink-2)' }}>ERR-7f3a-4b2c</span>. If this keeps happening, contact <span style={{ color: 'var(--navy)', cursor: 'pointer' }}>support@shielded.co</span> with this ID and we'll investigate immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfflineState() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }} className="shielded-root">
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 32px' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--bg-subtle)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        </div>

        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>No connection</div>
        <h1 className="serif" style={{ margin: '0 0 12px', fontSize: 32, letterSpacing: '-0.02em' }}>
          You're offline.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, margin: '0 0 28px' }}>
          Shielded needs a connection to load your claims and policy data. Check your internet and try again.
        </p>

        <button className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', marginBottom: 12 }}>
          Try again
        </button>

        <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
          Your documents and drafts are safely stored — nothing is lost.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotFound, AppError, OfflineState });
