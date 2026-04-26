// ClaimFlow.jsx — claim creation + documentation workflow

function ClaimCreate() {
  const [step, setStep] = React.useState(2); // on step 2 (details)
  const [peril, setPeril] = React.useState('fire');
  const perils = [
    { id: 'fire', label: 'Fire / smoke', icon: 'Alert' },
    { id: 'water', label: 'Water damage', icon: 'Info' },
    { id: 'theft', label: 'Theft / vandalism', icon: 'Lock' },
    { id: 'wind', label: 'Wind / storm', icon: 'TrendUp' },
    { id: 'liab', label: 'Liability', icon: 'Scale' },
    { id: 'other', label: 'Other', icon: 'Plus' },
  ];

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div>
        <div className="eyebrow">Start a claim</div>
        <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
          Tell us what happened
        </h2>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          We'll build a documentation checklist tailored to your policy and peril.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
        {['What happened', 'Details', 'First report', 'File with insurer'].map((s, i) => {
          const done = i < step - 1, active = i === step - 1;
          return (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 99,
                  background: done ? 'var(--teal)' : active ? 'var(--navy)' : 'var(--bg-card)',
                  color: done || active ? '#fff' : 'var(--ink-4)',
                  border: done || active ? 'none' : '1px solid var(--line-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {done ? <Icons.Check size={12} style={{ strokeWidth: 3 }}/> : i + 1}
                </div>
                <div style={{ fontSize: 12.5, color: active ? 'var(--ink)' : 'var(--ink-3)', fontWeight: active ? 500 : 400 }}>{s}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 1, background: done ? 'var(--teal)' : 'var(--line)', margin: '0 14px' }}/>}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>What kind of loss?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {perils.map(p => {
                const I = Icons[p.icon];
                const on = p.id === peril;
                return (
                  <button key={p.id} onClick={() => setPeril(p.id)} style={{
                    padding: 14, borderRadius: 10, cursor: 'pointer',
                    background: on ? '#eef2fb' : 'var(--bg-card)',
                    border: on ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                    display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start',
                    textAlign: 'left',
                  }}>
                    <I size={18} style={{ color: on ? 'var(--navy)' : 'var(--ink-3)' }}/>
                    <div style={{ fontSize: 13, fontWeight: on ? 500 : 400 }}>{p.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>When did it happen?</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--ink-4)' }}>Date of loss</label>
                <input defaultValue="March 11, 2026" style={{ width: '100%', marginTop: 4 }}/>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--ink-4)' }}>Time (approximate)</label>
                <input defaultValue="2:45 AM" style={{ width: '100%', marginTop: 4 }}/>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>What happened? <span style={{ color: 'var(--ink-4)', fontWeight: 400, fontSize: 12 }}>Plain English is fine</span></div>
            <textarea
              rows={4}
              defaultValue="Grease fire started on the flat-top around 2:45am after close. Sprinklers activated. Fire contained to kitchen but smoke spread through dining room. Fire marshal cleared site 9am next day. Building structurally OK; hood, oven, walk-in reefer likely totaled."
              style={{ width: '100%', lineHeight: 1.55 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
              <button className="btn btn-quiet btn-sm" style={{ fontSize: 11.5, color: 'var(--navy)' }}>
                <Icons.Sparkle size={12}/> Polish with AI
              </button>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· AI will neutralize language; nothing sent to insurer yet</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Estimated loss amount</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['<$10k', '$10–50k', '$50–100k', '$100k+', 'Not sure'].map((v, i) => (
                <button key={v} className="btn btn-ghost btn-sm" style={{
                  borderColor: i === 1 ? 'var(--navy)' : 'var(--line)',
                  background: i === 1 ? '#eef2fb' : 'transparent',
                  color: i === 1 ? 'var(--navy)' : 'var(--ink-2)',
                }}>{v}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost">Save draft</button>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-ghost"><Icons.ChevronL size={12}/> Back</button>
            <button className="btn btn-primary">Continue <Icons.Arrow size={12}/></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow">Covered under</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{DEMO.business.policy}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }} className="mono">{DEMO.business.policyNo}</div>
            <div className="hr" style={{ margin: '12px 0' }}/>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Fire/smoke coverage</span><span className="pill pill-teal" style={{ fontSize: 10 }}>Covered</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Deductible (AOP)</span><span className="mono" style={{ color: 'var(--ink)' }}>$5,000</span>
            </div>
          </div>

          <div className="card" style={{ padding: 16, background: '#eef2fb', borderColor: 'var(--navy-soft)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Icons.Info size={18} style={{ color: 'var(--navy)', flex: 'none', marginTop: 1 }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>Notice-of-loss deadline</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 3, lineHeight: 1.5 }}>
                  Your policy requires written notice to GreatWest "as soon as practicable." Most courts in NC accept up to 30 days — you're on day 0.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Documentation workflow ───────────────────────────────────────
const CHECKLIST = [
  {
    group: 'Immediate (Day 0–3)',
    items: [
      { title: 'Notify insurer in writing', detail: 'Policy §6 — within 24h recommended', done: true, when: 'Mar 11' },
      { title: 'Secure the property', detail: 'Board up, tarp, prevent further loss', done: true, when: 'Mar 11' },
      { title: 'Start damage photo log', detail: 'We\'ll guide you — minimum 40 photos', done: true, when: 'Mar 12', count: '34/40' },
      { title: 'Obtain fire marshal report', detail: 'Needed for proof of loss', done: true, when: 'Mar 14' },
    ],
  },
  {
    group: 'Documentation (Day 3–21)',
    items: [
      { title: 'Contents inventory with replacement costs', detail: 'Walk-in, prep line, small equipment', done: true, when: 'Mar 22' },
      { title: 'Business income worksheet', detail: 'Pull 12mo sales, COGS, fixed costs', done: false, active: true },
      { title: 'Vendor repair estimates (min. 2)', detail: 'Hood, oven, walk-in reefer', done: false, count: '1/2' },
      { title: 'Employee witness statements', detail: 'Closing manager + sous chef', done: false },
    ],
  },
  {
    group: 'Formal filings (Day 21–60)',
    items: [
      { title: 'Sworn proof of loss', detail: 'Policy §7B — due Apr 28', done: false, due: '5 days' },
      { title: 'Examination under oath prep', detail: 'If insurer requests', done: false, optional: true },
    ],
  },
];

function PhotoStep({ num, title, detail, done }) {
  return (
    <div style={{
      padding: 12, background: 'var(--bg-card)', borderRadius: 8,
      border: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 99, flex: 'none',
        background: done ? 'var(--teal)' : 'var(--bg-subtle)',
        border: done ? 'none' : '1px solid var(--line-2)',
        color: done ? '#fff' : 'var(--ink-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, fontFamily: 'var(--f-mono)', marginTop: 2,
      }}>
        {done ? <Icons.Check size={12} style={{ strokeWidth: 3 }}/> : num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{detail}</div>
      </div>
    </div>
  );
}

function ClaimDocs() {
  const [expanded, setExpanded] = React.useState(1);
  const totalDone = CHECKLIST.flatMap(g => g.items).filter(i => i.done).length;
  const total = CHECKLIST.flatMap(g => g.items).length;

  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div className="eyebrow">Claim {DEMO.activeClaim.id} · Documentation</div>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>
            Build your case
          </h2>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            {totalDone} of {total} items · strong claims win in the paperwork.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Icons.Camera size={14}/> Add photos</button>
          <button className="btn btn-primary"><Icons.Paperclip size={14}/> Upload document</button>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="eyebrow">Overall readiness</div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{Math.round(totalDone/total*100)}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
          <div style={{ flex: totalDone, background: 'var(--teal)' }}/>
          <div style={{ flex: total - totalDone, background: 'transparent' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: 'var(--ink-3)' }}>
          <span>{totalDone} complete</span>
          <span>1 in progress</span>
          <span>{total - totalDone - 1} to do</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CHECKLIST.map((g, gi) => (
            <div key={gi} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button onClick={() => setExpanded(e => e === gi ? -1 : gi)} style={{
                width: '100%', padding: '14px 18px', border: 'none', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{g.group}</div>
                  <span className="pill pill-neutral">
                    {g.items.filter(i => i.done).length}/{g.items.length}
                  </span>
                </div>
                <Icons.ChevronD size={14} style={{ transform: expanded === gi ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}/>
              </button>
              {expanded === gi && (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {g.items.map((it, i) => (
                    <div key={i} style={{
                      padding: '12px 18px', display: 'flex', alignItems: 'flex-start', gap: 12,
                      borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                      background: it.active ? '#fdf7ea' : 'transparent',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flex: 'none', marginTop: 1,
                        background: it.done ? 'var(--teal)' : 'transparent',
                        border: it.done ? 'none' : '1.5px solid var(--line-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {it.done && <Icons.Check size={11} style={{ color: '#fff', strokeWidth: 3 }}/>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: it.done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: it.done ? 'line-through' : 'none' }}>
                            {it.title}
                          </div>
                          {it.active && <span className="pill pill-amber">In progress</span>}
                          {it.due && <span className="pill pill-red">Due in {it.due}</span>}
                          {it.optional && <span className="pill pill-neutral">Optional</span>}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{it.detail}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--f-mono)', textAlign: 'right', marginTop: 2 }}>
                        {it.when && <div>✓ {it.when}</div>}
                        {it.count && <div>{it.count}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Photo coach */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icons.Camera size={16} style={{ color: 'var(--navy)' }}/>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Photo coach · kitchen</div>
              <span className="pill pill-amber" style={{ marginLeft: 'auto' }}>34 / 40</span>
            </div>
            <div style={{
              height: 100, borderRadius: 8, marginBottom: 12,
              background: `
                linear-gradient(135deg, rgba(20,24,31,0.35), rgba(20,24,31,0.55)),
                repeating-linear-gradient(45deg, #3a2a1f 0 8px, #4a3a2f 8px 16px)
              `,
              display: 'flex', alignItems: 'flex-end', padding: 10, color: '#fff',
              fontSize: 11, fontFamily: 'var(--f-mono)',
            }}>
              <Icons.Image size={13}/>&nbsp; hood_08.jpg · captured 9:12am
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PhotoStep num="1" title="Wide shot of each damaged room" detail="From 2 opposing corners" done/>
              <PhotoStep num="2" title="Close-up of every damaged item" detail="Serial numbers visible if possible" done/>
              <PhotoStep num="3" title="Timestamped ceiling and wall damage" detail="Show smoke spread pattern" done={false}/>
              <PhotoStep num="4" title="Structural + electrical (if exposed)" detail="After fire marshal clears site" done={false}/>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              <Icons.Plus size={13}/> Add next 6 photos
            </button>
          </div>

          <div className="card" style={{ padding: 16, background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Icons.Sparkle size={16} style={{ color: 'var(--navy)', flex: 'none', marginTop: 2 }}/>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                <strong>Tip:</strong> Capture the inside of the walk-in before vendors touch it. Adjusters frequently dispute spoilage claims without time-stamped photos of product still in place.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimSettled() {
  const c = DEMO.activeClaim;
  const fmt = n => '$' + n.toLocaleString();
  const finalAmt = 46200;
  const recovered = finalAmt - c.insurerOffer;

  return (
    <div style={{ padding: '40px 48px 48px', display: 'flex', flexDirection: 'column', gap: 28, overflow: 'auto', flex: 1, alignItems: 'center' }}>
      {/* Victory header */}
      <div style={{ textAlign: 'center', maxWidth: 580 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(15,125,108,0.3)' }}>
          <Icons.CheckCircle size={36} style={{ color: '#fff', strokeWidth: 1.5 }}/>
        </div>
        <div className="pill pill-teal" style={{ marginBottom: 14, display: 'inline-flex' }}>CLM-2041 · Settled</div>
        <h2 className="serif" style={{ margin: '0 0 10px', fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Your claim is settled.<br/>
          <em style={{ color: 'var(--teal)' }}>You recovered more.</em>
        </h2>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          GreatWest Mutual agreed to a final settlement of <strong style={{ color: 'var(--ink)' }}>{fmt(finalAmt)}</strong> — <strong style={{ color: 'var(--teal)' }}>{fmt(recovered)} more</strong> than their initial offer. Payment issued within 10 business days.
        </div>
      </div>

      {/* Settlement card */}
      <div className="card" style={{ padding: 28, maxWidth: 620, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { l: 'Initial offer', v: fmt(c.insurerOffer), color: 'var(--red)', note: 'Apr 4, 2026' },
          { l: 'Final settlement', v: fmt(finalAmt), color: 'var(--teal)', note: 'May 12, 2026', highlight: true },
          { l: 'You recovered', v: '+' + fmt(recovered), color: 'var(--ink)', note: 'vs. initial offer' },
        ].map((s, i) => (
          <div key={s.l} style={{ padding: '16px 20px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--line)' : 'none', background: s.highlight ? 'linear-gradient(180deg, var(--teal-soft), transparent)' : 'transparent' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{s.l}</div>
            <div className="serif num-t" style={{ fontSize: 30, letterSpacing: '-0.02em', color: s.color, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 6 }}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* What Shielded found */}
      <div style={{ maxWidth: 620, width: '100%' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>How we recovered the gap</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { ref: '§4.2', title: 'Replacement cost, not ACV', gained: '+$9,200' },
            { ref: '§3.4', title: 'Smoke remediation scope',   gained: '+$4,400' },
            { ref: '§5.1', title: 'Business income method',    gained: '+$3,800' },
          ].map(c => (
            <div key={c.ref} className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--navy)', width: 36, flex: 'none', fontWeight: 600 }}>{c.ref}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{c.title}</span>
              <span className="serif num-t" style={{ fontSize: 18, color: 'var(--teal)' }}>{c.gained}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, maxWidth: 620, width: '100%' }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          <Icons.Download size={13}/> Download settlement report
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
          <Icons.Upload size={13}/> Upload renewal policy
        </button>
      </div>

      <div style={{ fontSize: 12.5, color: 'var(--ink-4)', textAlign: 'center', maxWidth: 480 }}>
        This claim is now archived. Shielded will continue monitoring your active policies for gaps and renewal deadlines.
      </div>
    </div>
  );
}

// ─── Step 1: Select policy + confirm ────────────────────────────
function ClaimStart() {
  const [chosen, setChosen] = React.useState('CPP-48291-B');
  const policies = [
    { id: 'CPP-48291-B', name: 'Commercial Property', insurer: 'GreatWest Mutual', score: 72, note: 'Covers fire, water, theft, wind, equipment' },
    { id: 'GL-33021-A',  name: 'General Liability',   insurer: 'GreatWest Mutual', score: 88, note: 'Covers bodily injury, property damage to others' },
  ];
  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div>
        <div className="eyebrow">New claim · Step 1 of 4</div>
        <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Which policy covers this?</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          We'll build a tailored documentation checklist based on the policy you choose.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
        {['What happened', 'Details', 'First report', 'File with insurer'].map((s, i) => {
          const active = i === 0;
          return (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: active ? 'var(--navy)' : 'var(--bg-card)', color: active ? '#fff' : 'var(--ink-4)', border: active ? 'none' : '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 12.5, color: active ? 'var(--ink)' : 'var(--ink-3)', fontWeight: active ? 500 : 400 }}>{s}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 1, background: 'var(--line)', margin: '0 14px' }}/>}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Your active policies</div>
          {policies.map(p => {
            const on = p.id === chosen;
            return (
              <button key={p.id} onClick={() => setChosen(p.id)} style={{
                padding: 18, borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
                border: on ? '1.5px solid var(--navy)' : '1px solid var(--line)',
                background: on ? '#eef2fb' : 'var(--bg-card)', display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: on ? 'var(--navy)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <Icons.Shield size={17} style={{ color: on ? '#fff' : 'var(--ink-4)' }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: on ? 'var(--navy)' : 'var(--ink)' }}>{p.name}</div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{p.id}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 6 }}>{p.insurer}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{p.note}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="serif num-t" style={{ fontSize: 20, color: p.score >= 80 ? 'var(--teal)' : 'var(--amber)' }}>{p.score}</div>
                  {on && <Icons.Check size={18} style={{ color: 'var(--navy)', strokeWidth: 2.5 }}/>}
                </div>
              </button>
            );
          })}

          <div style={{ padding: 16, border: '1.5px dashed var(--line-2)', borderRadius: 12, background: 'var(--bg-subtle)', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
            <Icons.Plus size={18} style={{ color: 'var(--ink-4)' }}/>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Upload another policy to check coverage</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow">Preliminary coverage check</div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Fire / smoke', covered: true },
                { label: 'Water damage', covered: true },
                { label: 'Theft', covered: true },
                { label: 'Flood', covered: false, note: 'Excluded' },
                { label: 'Earthquake', covered: false, note: 'Excluded' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                  {c.covered
                    ? <Icons.CheckCircle size={14} style={{ color: 'var(--teal)', flex: 'none' }}/>
                    : <Icons.X size={14} style={{ color: 'var(--ink-4)', flex: 'none' }}/>}
                  <span style={{ flex: 1, color: c.covered ? 'var(--ink-2)' : 'var(--ink-4)' }}>{c.label}</span>
                  {!c.covered && <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.note}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 14, background: '#eef2fb', borderColor: 'var(--navy-soft)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Icons.Info size={15} style={{ color: 'var(--navy)', flex: 'none', marginTop: 1 }}/>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                Not sure which policy applies? Describe what happened and we'll suggest the right one.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button className="btn btn-ghost"><Icons.ChevronL size={12}/> Back to claims</button>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary">Continue to details <Icons.Arrow size={12}/></button>
      </div>
    </div>
  );
}

// ─── Step 3: First report / Notice of loss ───────────────────────
function ClaimFirstReport() {
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div>
        <div className="eyebrow">New claim · Step 3 of 4</div>
        <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>Send your first notice.</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          Most policies require written notice "as soon as practicable." Shielded drafted this from your claim details. Review and send.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
        {['What happened', 'Details', 'First report', 'File with insurer'].map((s, i) => {
          const done = i < 2, active = i === 2;
          return (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: done ? 'var(--teal)' : active ? 'var(--navy)' : 'var(--bg-card)', color: done || active ? '#fff' : 'var(--ink-4)', border: done || active ? 'none' : '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                  {done ? <Icons.Check size={12} style={{ strokeWidth: 3 }}/> : i + 1}
                </div>
                <div style={{ fontSize: 12.5, color: active ? 'var(--ink)' : done ? 'var(--ink-3)' : 'var(--ink-4)', fontWeight: active ? 500 : 400 }}>{s}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 1, background: done ? 'var(--teal)' : 'var(--line)', margin: '0 14px' }}/>}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        {/* Draft letter */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-subtle)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--navy)' }}/>
            <div style={{ fontSize: 13, fontWeight: 500 }}>AI-drafted notice of loss</div>
            <span className="pill pill-teal" style={{ marginLeft: 'auto', fontSize: 10 }}>Review before sending</span>
          </div>
          <div style={{ padding: 22, fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.75, color: '#1a1a1a' }}>
            <div style={{ marginBottom: 16, fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--ink-4)' }}>
              <div>To: claims@greatwestmutual.com</div>
              <div>Re: Notice of Loss — Policy CPP-48291-B</div>
              <div>Date: March 11, 2026</div>
            </div>
            <p style={{ margin: '0 0 12px' }}>Dear GreatWest Mutual Claims Department,</p>
            <p style={{ margin: '0 0 12px' }}>I am writing to provide formal notice of loss pursuant to Policy No. CPP-48291-B, Commercial Property, issued to Lumen & Loaf, 248 Lexington Ave, Asheville, NC.</p>
            <p style={{ margin: '0 0 12px' }}>On March 11, 2026, at approximately 2:45 AM, a fire originating on the commercial flat-top range caused fire and smoke damage to the kitchen and dining areas of the property. The Asheville Fire Department responded and cleared the scene at 9:00 AM. A fire marshal report is forthcoming.</p>
            <p style={{ margin: '0 0 12px' }}>We are taking immediate steps to secure the property and prevent further damage. We will submit a complete proof of loss within the policy-required timeframe.</p>
            <p style={{ margin: '0 0 12px' }}>Please acknowledge receipt and assign a claims representative at your earliest convenience.</p>
            <p style={{ margin: 0 }}>Sincerely,<br/>Maya Okafor<br/>Owner, Lumen & Loaf</p>
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icons.Edit size={12}/> Edit letter</button>
            <button className="btn btn-ghost btn-sm"><Icons.Copy size={12}/> Copy</button>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-quiet btn-sm" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
              <Icons.Sparkle size={11}/> Adjust tone
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Delivery options */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Send via</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Email (recommended)', sub: 'claims@greatwestmutual.com', icon: 'Mail', on: true },
                { label: 'Certified mail', sub: 'Print + send yourself', icon: 'Download', on: false },
                { label: 'Insurer portal', sub: 'Log in to GreatWest', icon: 'ExternalLink', on: false },
              ].map((opt, i) => {
                const I = Icons[opt.icon];
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: opt.on ? '#eef2fb' : 'var(--bg-subtle)', border: `1px solid ${opt.on ? 'var(--navy)' : 'var(--line)'}`, cursor: 'pointer' }}>
                    <I size={14} style={{ color: opt.on ? 'var(--navy)' : 'var(--ink-4)', flex: 'none' }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: opt.on ? 500 : 400, color: opt.on ? 'var(--navy)' : 'var(--ink)' }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{opt.sub}</div>
                    </div>
                    {opt.on && <Icons.Check size={14} style={{ color: 'var(--navy)', strokeWidth: 2.5 }}/>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deadline warning */}
          <div className="card" style={{ padding: 14, background: 'var(--amber-soft)', borderColor: 'var(--amber)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Icons.Clock size={16} style={{ color: 'var(--amber)', flex: 'none', marginTop: 1 }}/>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                <strong>Send today.</strong> NC courts consider "as soon as practicable" to mean within 24–72 hours of discovery. You're on day 0.
              </div>
            </div>
          </div>

          {sent ? (
            <div className="card" style={{ padding: 16, background: 'var(--teal-soft)', borderColor: 'var(--teal)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Icons.CheckCircle size={18} style={{ color: 'var(--teal)' }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>Notice sent!</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Delivered to GreatWest at 3:14 PM</div>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setSent(true)} style={{ justifyContent: 'center', padding: '12px' }}>
              <Icons.Mail size={14}/> Send notice of loss
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button className="btn btn-ghost"><Icons.ChevronL size={12}/> Back</button>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary" disabled={!sent} style={{ opacity: sent ? 1 : 0.5 }}>
          Continue to file <Icons.Arrow size={12}/>
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: File with insurer ───────────────────────────────────
function ClaimFile() {
  return (
    <div style={{ padding: '22px 28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', flex: 1 }}>
      <div>
        <div className="eyebrow">New claim · Step 4 of 4</div>
        <h2 className="serif" style={{ margin: 0, fontSize: 30, letterSpacing: '-0.015em' }}>You're filed. Now we build the case.</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          CLM-2041 is open with GreatWest Mutual. Here's what happens next.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
        {['What happened', 'Details', 'First report', 'File with insurer'].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 99, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                <Icons.Check size={12} style={{ strokeWidth: 3 }}/>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 400 }}>{s}</div>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 1, background: 'var(--teal)', margin: '0 14px' }}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Confirmation */}
      <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #eef2fb, var(--bg-card))', borderColor: 'var(--navy-soft)' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Icons.CheckCircle size={26} style={{ color: '#fff', strokeWidth: 1.5 }}/>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--navy)', fontWeight: 700, letterSpacing: '0.05em' }}>CLM-2041</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Claim opened · Fire & Smoke Damage</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>March 11, 2026 · Lumen & Loaf · GreatWest Mutual</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { l: 'Notice sent', v: 'Mar 11 · 3:14 PM', icon: 'Check' },
            { l: 'Claim assigned', v: 'J. Halloran · Adjuster', icon: 'User' },
            { l: 'First deadline', v: 'Apr 28 · Proof of loss', icon: 'Clock' },
          ].map(s => {
            const I = Icons[s.icon];
            return (
              <div key={s.l} style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                  <I size={13} style={{ color: 'var(--teal)' }}/>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>{s.l}</div>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.v}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What's next */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>What Shielded does next</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: 'FileText', title: 'Build your documentation checklist', sub: '13 items — photo guide, estimates, inventory. Start now to stay ahead of deadlines.' },
            { icon: 'TrendUp',  title: 'Monitor comparable settlements', sub: 'We\'ll track NC restaurant fire claims and alert you when new comps are added.' },
            { icon: 'Clock',    title: 'Track every policy deadline', sub: 'Proof of loss Apr 28, 60-day window May 2, inventory May 10. Reminders sent automatically.' },
            { icon: 'Sparkle',  title: 'Draft rebuttal when the offer arrives', sub: 'As soon as GreatWest sends a number, we\'ll analyse it and build your negotiation case.' },
          ].map(item => {
            const I = Icons[item.icon];
            return (
              <div key={item.title} className="card" style={{ padding: 16, display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <I size={15} style={{ color: 'var(--navy)' }}/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button className="btn btn-ghost"><Icons.Copy size={12}/> Copy claim ID</button>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Start documentation <Icons.Arrow size={12}/>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ClaimCreate, ClaimDocs, ClaimSettled, ClaimStart, ClaimFirstReport, ClaimFile });
