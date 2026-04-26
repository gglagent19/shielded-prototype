// Mobile.jsx — mobile dashboard + claim docs flow inside iPhone frame

function MobileStatus() {
  return (
    <div style={{
      height: 44, padding: '12px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 14, fontWeight: 600, color: 'var(--ink)',
    }}>
      <span>9:41</span>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.05em' }}>●●●●●  5G  ▮▮▮</span>
    </div>
  );
}

function MobileDashboard() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <MobileStatus />
      <div style={{ padding: '8px 18px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
          <ShieldedLogo size={17} color="var(--ink)" />
          <div style={{ width: 30, height: 30, borderRadius: 99, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>MO</div>
        </div>
        <div>
          <div className="eyebrow">Thursday · Apr 23</div>
          <div className="serif" style={{ fontSize: 26, letterSpacing: '-0.015em', lineHeight: 1.1 }}>Good morning, Maya.</div>
        </div>

        {/* Hero claim card */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="pill pill-amber"><span className="dot" style={{ background: 'var(--amber)' }}/> Negotiating</span>
            <span className="eyebrow">CLM-2041 · day 43</span>
          </div>
          <div className="eyebrow">Recovery gap</div>
          <div className="serif num-t" style={{ fontSize: 38, letterSpacing: '-0.02em', lineHeight: 1 }}>+$19.4k</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Insurer offered $28.4k · fair mid $47.8k</div>
          {/* Mini range */}
          <div style={{ position: 'relative', height: 18, marginTop: 14 }}>
            <div style={{ position: 'absolute', left: '35%', right: '10%', top: 7, height: 5, background: 'var(--teal-soft)', border: '1px solid var(--teal)', borderRadius: 3 }}/>
            <div style={{ position: 'absolute', left: '8%', top: 2, width: 2, height: 14, background: 'var(--red)' }}/>
          </div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
            <Icons.Sparkle size={12}/> Draft rebuttal
          </button>
        </div>

        {/* Next up */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Next up</div>
            <span className="pill pill-red">2 this week</span>
          </div>
          {DEMO.deadlines.slice(0, 3).map((d, i) => (
            <div key={i} style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ width: 38, textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 9, color: 'var(--ink-4)' }}>{d.date.split(' ')[0]}</div>
                <div className="serif num-t" style={{ fontSize: 20, lineHeight: 1 }}>{d.date.split(' ')[1]}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{d.title}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{d.kind}</div>
              </div>
              <span className={`pill pill-${d.day <= 7 ? 'red' : 'neutral'}`}>{d.day}d</span>
            </div>
          ))}
        </div>

        {/* AI suggestion */}
        <div className="card" style={{ padding: 14, background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldedMark size={12} color="#fff"/>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Shielded suggests</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            Your hood and oven were valued at ACV, but §4.2 guarantees replacement cost. That's a <strong>$9,200</strong> lever on its own.
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 26px', background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {[
          { i: 'Home', l: 'Home', on: true },
          { i: 'Claim', l: 'Claims' },
          { i: 'Shield', l: 'Policy' },
          { i: 'Chat', l: 'Ask AI' },
        ].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/>
              <span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileClaimDocs() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)' }}>
      <MobileStatus />
      <div style={{ padding: '8px 18px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.ChevronL size={16}/></button>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ fontSize: 9 }}>Claim CLM-2041</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Documentation</div>
        </div>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.Dots size={16}/></button>
      </div>

      <div style={{ padding: '0 18px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="eyebrow">Overall readiness</div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>55%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '55%', height: '100%', background: 'var(--teal)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'var(--ink-3)' }}>
            <span>5 done</span><span>1 active</span><span>4 to do</span>
          </div>
        </div>

        {/* Photo coach tile */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            height: 120,
            background: `linear-gradient(135deg, rgba(20,24,31,0.2), rgba(20,24,31,0.55)), repeating-linear-gradient(45deg, #3a2a1f 0 8px, #4a3a2f 8px 16px)`,
            padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
              <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <Icons.Camera size={10}/> Photo coach
              </span>
              <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>34 / 40</span>
            </div>
            <div className="mono" style={{ color: '#fff', fontSize: 10, opacity: 0.8 }}>hood_08.jpg · 9:12am</div>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Capture the walk-in interior</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.5 }}>
              Before vendors touch it. Adjusters dispute spoilage without timestamped photos.
            </div>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              <Icons.Camera size={13}/> Open camera
            </button>
          </div>
        </div>

        {/* Today's checklist */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Today</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>3 items</div>
          </div>
          {[
            { t: 'Business income worksheet', s: 'Pull 12mo sales, COGS', done: false, active: true },
            { t: 'Second repair estimate', s: 'Hood vendor · Walker HVAC', done: false },
            { t: 'Photos — walk-in interior', s: '6 more photos', done: false },
          ].map((it, i) => (
            <div key={i} style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start', borderTop: i > 0 ? '1px solid var(--line)' : 'none', background: it.active ? '#fdf7ea' : 'transparent' }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid var(--line-2)', flex: 'none', marginTop: 1 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{it.t}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{it.s}</div>
              </div>
              {it.active && <span className="pill pill-amber">Active</span>}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 12, background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--navy)', flex: 'none', marginTop: 2 }}/>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              You're ahead of schedule for the Apr 28 proof of loss. Focus today on business income — it's the slowest piece.
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 26px', background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {[
          { i: 'Home', l: 'Home' },
          { i: 'Claim', l: 'Claims', on: true },
          { i: 'Shield', l: 'Policy' },
          { i: 'Chat', l: 'Ask AI' },
        ].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/>
              <span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple iPhone-like frame
function PhoneFrame({ children, label }) {
  return (
    <div style={{
      width: 340, height: 720, padding: 8, background: '#0e1218',
      borderRadius: 44, boxShadow: '0 20px 60px rgba(0,0,0,0.18), inset 0 0 0 2px #2a2f38',
      position: 'relative',
    }}>
      {label && <div className="eyebrow" style={{ position: 'absolute', top: -22, left: 0, color: 'var(--ink-4)' }}>{label}</div>}
      <div style={{
        width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden',
        background: 'var(--bg)', position: 'relative',
      }}>
        {/* notch */}
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 28, background: '#0e1218', borderRadius: 99, zIndex: 5,
        }}/>
        {children}
      </div>
    </div>
  );
}

function MobilePolicies() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <MobileStatus />
      <div style={{ padding: '8px 18px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="serif" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>Policies</div>
        <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }}><Icons.Plus size={11}/> Add</button>
      </div>

      <div style={{ padding: '4px 18px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Coverage score summary */}
        <div className="card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 44, height: 44, flex: 'none' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="22" cy="22" r="16" fill="none" stroke="var(--line)" strokeWidth="4"/>
              <circle cx="22" cy="22" r="16" fill="none" stroke="var(--amber)" strokeWidth="4"
                strokeDasharray={`${(80/100)*2*Math.PI*16} 999`} strokeLinecap="round"/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>80</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Portfolio score</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>2 active policies · 1 high-risk flag</div>
          </div>
        </div>

        {/* Commercial property card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icons.Shield size={14} style={{ color: 'var(--navy)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Commercial Property</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>CPP-48291-B · GreatWest</div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--amber)',
              padding: '2px 8px', borderRadius: 99, background: 'var(--amber-soft)',
            }}>72</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[
              ['Premium', '$4,820 / yr'],
              ['Renews', 'Feb 14, 2027'],
              ['Coverage', '$710k total'],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                <span style={{ color: 'var(--ink-4)' }}>{l}</span>
                <span className="mono" style={{ color: 'var(--ink-2)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--red-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icons.Alert size={12} style={{ color: 'var(--red)', flex: 'none' }}/>
            <div style={{ fontSize: 11.5, color: 'var(--red)', fontWeight: 500 }}>Flood exclusion — high risk</div>
            <Icons.ChevronR size={12} style={{ color: 'var(--red)', marginLeft: 'auto' }}/>
          </div>
        </div>

        {/* General liability card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icons.Scale size={14} style={{ color: 'var(--teal)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>General Liability</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>GL-33021-A · GreatWest</div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--teal)',
              padding: '2px 8px', borderRadius: 99, background: 'var(--teal-soft)',
            }}>88</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[
              ['Premium', '$2,160 / yr'],
              ['Renews', 'Mar 1, 2027'],
              ['Coverage', '$1M per occ.'],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                <span style={{ color: 'var(--ink-4)' }}>{l}</span>
                <span className="mono" style={{ color: 'var(--ink-2)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-ghost" style={{ justifyContent: 'center', width: '100%', fontSize: 13 }}>
          <Icons.Upload size={13}/> Add a policy
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px', background: 'var(--bg)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around' }}>
        {[{ i: 'Home', l: 'Home' }, { i: 'Claim', l: 'Claims' }, { i: 'Shield', l: 'Policy', on: true }, { i: 'Chat', l: 'Ask AI' }].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/>
              <span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileNegotiate() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <MobileStatus />

      {/* Header */}
      <div style={{ padding: '8px 18px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.ChevronL size={16}/></button>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ fontSize: 9 }}>CLM-2041 · Negotiate</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Draft rebuttal</div>
        </div>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.Dots size={16}/></button>
      </div>

      <div style={{ padding: '0 18px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Gap summary */}
        <div className="card" style={{ padding: 14, background: '#eef2fb', borderColor: 'var(--navy-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--navy)', fontWeight: 500 }}>Recovery gap</div>
            <div className="serif num-t" style={{ fontSize: 22, color: 'var(--navy)', letterSpacing: '-0.02em' }}>+$19.4k</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['§4.2 RCV', '§3.4 Smoke', '§5.1 Income'].map(c => (
              <span key={c} className="mono" style={{ fontSize: 9, padding: '2px 6px', background: 'var(--navy)', color: '#fff', borderRadius: 4 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Draft preview */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--navy)' }}/>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>AI draft ready</div>
            <span className="pill pill-teal" style={{ marginLeft: 'auto', fontSize: 9 }}>Review</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6, borderLeft: '2.5px solid var(--line-2)', paddingLeft: 10 }}>
            <div style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 11, marginBottom: 6 }}>To: j.halloran@greatwestmutual.com</div>
            Dear Mr. Halloran,<br/>
            I am writing regarding GreatWest's April 4 settlement offer of $28,400 for claim CLM-2041. Three policy clauses require correction:
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { ref: '§4.2', t: 'Replacement cost, not ACV', g: '+$9.2k' },
              { ref: '§3.4', t: 'Smoke remediation scope',   g: '+$4.4k' },
              { ref: '§5.1', t: 'Business income method',    g: '+$3.8k' },
            ].map(c => (
              <div key={c.ref} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--navy)', width: 32, flex: 'none' }}>{c.ref}</span>
                <span style={{ flex: 1, fontSize: 11.5 }}>{c.t}</span>
                <span className="serif num-t" style={{ fontSize: 13, color: 'var(--teal)' }}>{c.g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Icons.Mail size={14}/> Send via Shielded
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
            <Icons.Copy size={14}/> Copy to clipboard
          </button>
          <button className="btn btn-quiet" style={{ justifyContent: 'center', fontSize: 12, color: 'var(--ink-3)' }}>
            <Icons.Edit size={13}/> Edit draft first
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px', background: 'var(--bg)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around' }}>
        {[{ i: 'Home', l: 'Home' }, { i: 'Claim', l: 'Claims', on: true }, { i: 'Shield', l: 'Policy' }, { i: 'Chat', l: 'Ask AI' }].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/>
              <span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileAIChat() {
  const msgs = [
    { who: 'ai', text: "I've reviewed GreatWest's $28,400 offer. It's **41% below** the fair midpoint based on 7 NC comps.", chips: ['Why so low?', 'Draft rebuttal', 'Next deadline?'] },
    { who: 'you', text: 'Why is the offer so low?' },
    { who: 'ai', text: "Three reasons: §4.2 — they valued your hood and oven at ACV, not replacement cost (+$9.2k). §3.4 — smoke remediation scope omits HVAC (+$4.4k). §5.1 — income calc used a flat rate, not trailing avg (+$3.8k).", chips: ['Draft the rebuttal', 'Show the math'] },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <MobileStatus />

      {/* Header */}
      <div style={{ padding: '8px 18px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)', flex: 'none' }}>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.ChevronL size={16}/></button>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <ShieldedMark size={17} color="#fff"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            Shielded <span className="dot pulse" style={{ background: 'var(--teal)', width: 5, height: 5 }}/>
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>CLM-2041 · Fire & Smoke</div>
        </div>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.Dots size={15}/></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="eyebrow" style={{ textAlign: 'center', fontSize: 9 }}>Today · 9:41 AM</div>
        {msgs.map((m, i) => {
          const isAI = m.who === 'ai';
          const text = (m.text || '').split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
            p.startsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p
          );
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAI ? 'flex-start' : 'flex-end', gap: 6 }}>
              <div style={{
                maxWidth: '85%', padding: '10px 13px',
                borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: isAI ? 'var(--bg-card)' : 'var(--navy)',
                color: isAI ? 'var(--ink-2)' : '#fff',
                border: isAI ? '1px solid var(--line)' : 'none',
                fontSize: 13.5, lineHeight: 1.5,
              }}>{text}</div>
              {m.chips && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.chips.map(c => (
                    <button key={c} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99 }}>{c}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px 28px', borderTop: '1px solid var(--line)', flex: 'none', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: '8px 10px' }}>
          <input placeholder="Ask about your claim…" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, outline: 'none', boxShadow: 'none', padding: 0 }}/>
          <button className="btn btn-primary btn-sm" style={{ padding: '6px 10px', borderRadius: 10 }}>
            <Icons.ArrowUp size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto' }}>
          {['What should I do next?', 'Draft rebuttal', 'Next deadline?'].map(s => (
            <button key={s} className="btn btn-quiet btn-sm" style={{ fontSize: 10.5, padding: '3px 8px', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTimeline() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <MobileStatus />
      <div style={{ padding: '8px 18px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)', flex: 'none' }}>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.ChevronL size={16}/></button>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ fontSize: 9 }}>CLM-2041 · Day 43</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Deadlines</div>
        </div>
        <button className="btn btn-quiet btn-sm" style={{ padding: 4 }}><Icons.Calendar size={15}/></button>
      </div>

      <div style={{ padding: '14px 18px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--line)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, width: '30%', height: '100%', background: 'var(--teal)', borderRadius: 99 }}/>
          <div style={{ position: 'absolute', left: '30%', width: 8, height: 8, borderRadius: 99, background: 'var(--navy)', top: -2 }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-4)' }} className="mono">
          <span>Mar 11</span><span>Today · Day 43</span><span>~Jun</span>
        </div>

        {/* Urgent deadline */}
        <div className="card" style={{ padding: 14, borderColor: 'var(--red)', borderWidth: 1.5, background: 'var(--red-soft)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icons.Alert size={16} style={{ color: '#fff' }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--red)' }}>Due in 5 days</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>Sworn proof of loss</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>Apr 28 · Policy §7B</div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            <Icons.Sparkle size={12}/> Draft proof of loss
          </button>
        </div>

        {/* Upcoming deadlines */}
        {DEMO.deadlines.slice(1).map((d, i) => (
          <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'center', width: 38, flex: 'none' }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--ink-4)' }}>{d.date.split(' ')[0]}</div>
              <div className="serif num-t" style={{ fontSize: 22, lineHeight: 1 }}>{d.date.split(' ')[1]}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{d.kind}</div>
            </div>
            <span className="pill pill-neutral" style={{ fontSize: 10 }}>{d.day}d</span>
          </div>
        ))}

        {/* Completed events */}
        <div style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500, marginTop: 4 }}>COMPLETED</div>
        {[
          { date: 'Apr 4',  title: 'Settlement offer received', kind: 'Milestone' },
          { date: 'Mar 22', title: 'Contents inventory submitted', kind: 'Documentation' },
          { date: 'Mar 14', title: 'Fire marshal report obtained', kind: 'Evidence' },
          { date: 'Mar 11', title: 'Notice of loss sent', kind: 'Filing' },
        ].map((ev, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', opacity: 0.6 }}>
            <Icons.CheckCircle size={16} style={{ color: 'var(--teal)', flex: 'none' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5 }}>{ev.title}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{ev.date}</div>
            </div>
            <span className="pill pill-neutral" style={{ fontSize: 9 }}>{ev.kind}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px', background: 'var(--bg)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around' }}>
        {[{ i: 'Home', l: 'Home' }, { i: 'Claim', l: 'Claims', on: true }, { i: 'Shield', l: 'Policy' }, { i: 'Chat', l: 'Ask AI' }].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/><span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileSearch() {
  const results = [
    { type: 'claim',  icon: 'Claim',    label: 'CLM-2041 · Fire & Smoke', sub: 'Day 43 · Negotiating', badge: 'Claim' },
    { type: 'doc',    icon: 'FileText', label: "Adjuster's estimate.pdf",  sub: 'ACV kitchen equipment', badge: 'Doc' },
    { type: 'policy', icon: 'Shield',   label: 'CPP-48291-B · §4.2',       sub: 'Replacement cost clause', badge: 'Policy' },
    { type: 'ai',     icon: 'Sparkle',  label: 'What is replacement cost?', sub: 'Ask Shielded', badge: 'AI' },
  ];
  const recents = ['CLM-2041', 'Proof of loss', '§4.2 replacement'];
  const [query, setQuery] = React.useState('replacement cost');
  const badgeKind = { Claim: 'amber', Doc: 'neutral', Policy: 'navy', AI: 'teal' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <MobileStatus />

      {/* Search bar */}
      <div style={{ padding: '8px 14px 12px', borderBottom: '1px solid var(--line)', flex: 'none', background: 'var(--bg-card)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Icons.Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--ink-4)', pointerEvents: 'none' }}/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search claims, policies, docs…"
            style={{ width: '100%', paddingLeft: 32, fontSize: 14, padding: '9px 12px 9px 32px', borderRadius: 10 }}
          />
        </div>
        {/* Recent searches */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto' }}>
          {recents.map(r => (
            <button key={r} onClick={() => setQuery(r)} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 0 100px' }}>
        {query && (
          <div style={{ padding: '6px 14px 8px', fontSize: 11, color: 'var(--ink-4)' }}>
            {results.length} results for "{query}"
          </div>
        )}
        {results.map((r, i) => {
          const I = Icons[r.icon];
          return (
            <div key={i} style={{ padding: '13px 14px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--line)', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: r.type === 'ai' ? 'var(--navy)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {r.type === 'ai' ? <ShieldedMark size={18} color="#fff"/> : <I size={16} style={{ color: 'var(--ink-3)' }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 1 }}>{r.sub}</div>
              </div>
              <span className={`pill pill-${badgeKind[r.badge]}`} style={{ fontSize: 10, flex: 'none' }}>{r.badge}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px', background: 'var(--bg)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around' }}>
        {[{ i: 'Home', l: 'Home' }, { i: 'Claim', l: 'Claims' }, { i: 'Shield', l: 'Policy' }, { i: 'Search', l: 'Search', on: true }].map((n, i) => {
          const I = Icons[n.i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.on ? 'var(--navy)' : 'var(--ink-4)' }}>
              <I size={19} stroke={n.on ? 2 : 1.5}/><span style={{ fontSize: 10, fontWeight: n.on ? 600 : 400 }}>{n.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { MobileDashboard, MobileClaimDocs, MobilePolicies, MobileNegotiate, MobileAIChat, MobileTimeline, MobileSearch, PhoneFrame });
