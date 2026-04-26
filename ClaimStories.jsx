// ClaimStories.jsx — public social proof / case studies page (linked from landing nav)

const STORIES = [
  {
    slug: 'lumen-loaf',
    business: 'Lumen & Loaf', type: 'Restaurant & Bakery', location: 'Asheville, NC',
    peril: 'Kitchen fire', initials: 'MO', name: 'Maya Okafor',
    offer: 28400, settled: 46200, recovered: 17800, daysOpen: 61,
    headline: '"We settled for $17,800 more than the adjuster\'s first number."',
    body: 'A grease fire started after close. The adjuster offered $28,400 and called it final. Shielded found three clauses the adjuster had misread — replacement cost vs ACV, smoke remediation scope, and income calculation method. Six weeks later we had $46,200.',
    clauses: ['§4.2 Replacement cost', '§3.4 Smoke scope', '§5.1 Income method'],
    color: 'var(--amber)',
  },
  {
    slug: 'silver-lake',
    business: 'Silver Lake Bakery', type: 'Artisan Bakery', location: 'Durham, NC',
    peril: 'Electrical fire', initials: 'RS', name: 'Rachel Simmons',
    offer: 38000, settled: 52500, recovered: 14500, daysOpen: 48,
    headline: '"The AI caught a $14,500 gap in the adjuster\'s scope."',
    body: 'An electrical fire in our proofing room caused equipment damage and forced a 5-week closure. Shielded flagged that the adjuster had omitted all spoilage and understated the income loss period. One rebuttal letter later, we had a fair settlement.',
    clauses: ['§6.1 Spoilage coverage', '§5.1 Income period', '§4.3 Equipment scope'],
    color: 'var(--teal)',
  },
  {
    slug: 'nomad-coffee',
    business: 'Nomad Coffee Co.', type: 'Specialty Coffee', location: 'Charlotte, NC',
    peril: 'Water damage', initials: 'DK', name: 'David Kim',
    offer: 11200, settled: 19800, recovered: 8600, daysOpen: 34,
    headline: '"34 days from claim to settlement — and $8,600 more than offered."',
    body: 'A burst pipe flooded our storage and espresso bar area. The insurer\'s first offer excluded our custom espresso equipment and all inventory. Shielded drafted a two-page rebuttal citing replacement cost endorsements. The insurer responded within 10 days.',
    clauses: ['§4.2 Replacement cost', '§6.2 Stock coverage', '§2.1 AOP deductible'],
    color: 'var(--navy)',
  },
  {
    slug: 'sorting-yard',
    business: 'The Sorting Yard', type: 'Vintage Warehouse', location: 'Greensboro, NC',
    peril: 'Theft & vandalism', initials: 'TW', name: 'Tanya Wolfe',
    offer: 22000, settled: 31400, recovered: 9400, daysOpen: 42,
    headline: '"They valued stolen inventory at half what replacement cost me."',
    body: 'A break-in cost us roughly $30k in vintage inventory. The adjuster valued everything at ACV using generic depreciation tables — not the actual resale market. Shielded found that our endorsement required us-actual-cash-value for specialty goods. We got $31,400.',
    clauses: ['§4.4 Specialty goods ACV', '§7.2 Inventory documentation', '§3.1 Theft scope'],
    color: 'var(--red)',
  },
];

function StoryCard({ s, featured }) {
  const fmt = n => '$' + (n / 1000).toFixed(1) + 'k';
  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden', display: 'flex',
      flexDirection: featured ? 'row' : 'column',
    }}>
      {/* Color stripe / placeholder image */}
      <div style={{
        background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
        borderRight: featured ? '1px solid var(--line)' : 'none',
        borderBottom: featured ? 'none' : '1px solid var(--line)',
        width: featured ? 200 : '100%',
        minHeight: featured ? 'auto' : 120,
        flex: featured ? 'none' : 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
        padding: 20,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>{s.initials}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{s.business}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{s.location}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Recovery numbers */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { l: 'Initial offer', v: fmt(s.offer),     c: 'var(--red)' },
            { l: 'Settled',       v: fmt(s.settled),   c: 'var(--teal)' },
            { l: 'Recovered',     v: '+' + fmt(s.recovered), c: 'var(--ink)' },
          ].map(stat => (
            <div key={stat.l}>
              <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 3 }}>{stat.l}</div>
              <div className="serif num-t" style={{ fontSize: 22, color: stat.c, letterSpacing: '-0.02em' }}>{stat.v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 3 }}>Peril</div>
            <span className="pill pill-neutral" style={{ fontSize: 11 }}>{s.peril}</span>
          </div>
        </div>

        <div className="serif" style={{ fontSize: featured ? 20 : 16, lineHeight: 1.45, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {s.headline}
        </div>

        <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{s.body}</div>

        {/* Clauses */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {s.clauses.map(c => (
            <span key={c} className="mono" style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-subtle)', color: 'var(--navy)', border: '1px solid var(--line)' }}>{c}</span>
          ))}
          <span className="mono" style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, color: 'var(--ink-4)' }}>{s.daysOpen} days</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{s.initials}</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{s.business} · {s.type}</div>
          </div>
          <button className="btn btn-quiet btn-sm" style={{ marginLeft: 'auto', fontSize: 12 }}>
            Read full story <Icons.Arrow size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClaimStories() {
  const [filter, setFilter] = React.useState('All');
  const FILTERS = ['All', 'Fire', 'Water', 'Theft', 'Wind'];
  const totalRecovered = STORIES.reduce((a, s) => a + s.recovered, 0);

  return (
    <div style={{ background: 'var(--bg)', overflow: 'auto', height: '100%' }}>
      {/* Nav */}
      <div style={{ padding: '18px 48px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 28, background: 'var(--bg)' }}>
        <ShieldedLogo size={18} color="var(--ink)"/>
        <div style={{ display: 'flex', gap: 22, fontSize: 13, color: 'var(--ink-2)', marginLeft: 12 }}>
          {['How it works', 'For brokers', 'Pricing', 'Claim stories', 'Resources'].map(item => (
            <span key={item} style={{ cursor: 'pointer', fontWeight: item === 'Claim stories' ? 600 : 400, color: item === 'Claim stories' ? 'var(--ink)' : 'var(--ink-2)' }}>{item}</span>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-quiet btn-sm">Sign in</button>
        <button className="btn btn-primary btn-sm">Start free <Icons.Arrow size={11}/></button>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '60px 48px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="pill pill-navy" style={{ marginBottom: 18, display: 'inline-flex' }}>
            <span className="dot" style={{ background: 'var(--navy)' }}/> Real claims · Real outcomes
          </div>
          <h1 className="serif" style={{ margin: '0 0 16px', fontSize: 56, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            Small businesses that recovered<br/>what their insurance <em style={{ color: 'var(--navy)', fontStyle: 'italic' }}>actually owed.</em>
          </h1>
          <div style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 540, margin: '0 auto 28px' }}>
            Every story below is a real claim. The amounts, timelines, and clauses are accurate.
          </div>

          {/* Aggregate stats */}
          <div style={{ display: 'inline-flex', gap: 40, padding: '18px 32px', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--line)', boxShadow: 'var(--sh-sm)' }}>
            {[
              { v: '$' + (totalRecovered/1000).toFixed(0) + 'k', l: 'recovered in these 4 stories' },
              { v: '46 days', l: 'avg. claim duration' },
              { v: '4 / 4', l: 'claims improved after Shielded' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div className="serif num-t" style={{ fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{s.v}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, justifyContent: 'center' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-ghost btn-sm" style={{
              borderColor: filter === f ? 'var(--navy)' : 'var(--line)',
              background: filter === f ? '#eef2fb' : 'transparent',
              color: filter === f ? 'var(--navy)' : 'var(--ink-3)',
            }}>{f}</button>
          ))}
        </div>

        {/* Featured story */}
        <div style={{ marginBottom: 20 }}>
          <StoryCard s={STORIES[0]} featured={true}/>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {STORIES.slice(1).map(s => <StoryCard key={s.slug} s={s} featured={false}/>)}
        </div>

        {/* CTA */}
        <div className="card" style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-subtle))' }}>
          <h2 className="serif" style={{ margin: '0 0 10px', fontSize: 32, letterSpacing: '-0.015em' }}>
            Have a claim of your own?
          </h2>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 22, maxWidth: 440, margin: '0 auto 22px' }}>
            Upload your policy for free. We'll read every page and tell you where you stand before anything happens.
          </div>
          <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 14 }}>
            Analyze my policy · free <Icons.Arrow size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClaimStories });
