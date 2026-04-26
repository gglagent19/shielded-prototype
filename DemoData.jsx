// DemoData.jsx — the restaurant-owner story: "Lumen & Loaf"
const DEMO = {
  business: {
    name: 'Lumen & Loaf',
    type: 'Restaurant & Bakery',
    owner: 'Maya Okafor',
    location: 'Asheville, NC',
    policy: 'Commercial Property — GreatWest Mutual',
    policyNo: 'CPP-48291-B',
    premium: '$4,820 / yr',
    renews: 'Feb 14, 2027',
  },
  activeClaim: {
    id: 'CLM-2041',
    type: 'Fire & Smoke Damage',
    date: 'Mar 11, 2026',
    status: 'Negotiating',
    insurerOffer: 28400,
    fairLow: 41200,
    fairHigh: 53800,
    fairMid: 47800,
    delta: 19400, // fair mid - offer
    daysOpen: 43,
  },
  coverage: [
    { label: 'Building', limit: 420000, covered: true },
    { label: 'Business Personal Property', limit: 85000, covered: true },
    { label: 'Business Income Loss', limit: 120000, covered: true, note: '12-month limit' },
    { label: 'Equipment Breakdown', limit: 50000, covered: true },
    { label: 'Spoilage (food stock)', limit: 10000, covered: true, note: '$500 ded.' },
    { label: 'Ordinance or Law', limit: 25000, covered: false, flag: 'Sub-limit — low for your area' },
    { label: 'Flood', limit: 0, covered: false, flag: 'Excluded — consider endorsement' },
  ],
  risks: [
    { level: 'high', title: 'Flood exclusion on primary policy', detail: 'Your basement prep kitchen sits 400 ft from Swannanoa River floodplain. No flood endorsement in place.' },
    { level: 'med', title: 'Business income sub-limit may be short', detail: 'At current revenue ($1.4M), 12-month ALE only covers ~68% of projected loss in a full shutdown.' },
    { level: 'low', title: 'Deductible is higher than comparable policies', detail: '$5k vs. $2.5k median for similar restaurants in NC.' },
  ],
  deadlines: [
    { date: 'Apr 28', day: 5,  title: 'Submit sworn proof of loss', kind: 'Mandatory — policy §7B', status: 'upcoming' },
    { date: 'May 02', day: 9,  title: 'Insurer 60-day response window closes', kind: 'State law — NC §58-63', status: 'upcoming' },
    { date: 'May 10', day: 17, title: 'Contents inventory supplement due', kind: 'Adjuster request', status: 'upcoming' },
    { date: 'Jun 11', day: 49, title: '90-day claim review checkpoint', kind: 'Internal — Shielded', status: 'scheduled' },
  ],
  recentDocs: [
    { name: 'Policy — CPP-48291-B.pdf', kind: 'Policy', size: '2.4 MB', date: 'Feb 14' },
    { name: 'Fire marshal report.pdf', kind: 'Evidence', size: '1.1 MB', date: 'Mar 14' },
    { name: 'Kitchen damage — 34 photos', kind: 'Photos', size: '142 MB', date: 'Mar 12' },
    { name: 'Contents inventory v2.xlsx', kind: 'Inventory', size: '88 KB', date: 'Mar 22' },
    { name: "Adjuster's estimate.pdf", kind: 'Estimate', size: '640 KB', date: 'Apr 04' },
  ],
  benchmarks: {
    // Similar claims: NC restaurants, fire+smoke, last 18mo
    comps: [
      { label: 'Restaurant — Raleigh', payout: 38200, type: 'Kitchen fire, 2.1k sqft' },
      { label: 'Bakery — Charlotte',  payout: 52500, type: 'Electrical fire, full shutdown 6wk' },
      { label: 'Café — Durham',       payout: 44800, type: 'Grease fire, partial shutdown' },
      { label: 'Restaurant — Asheville', payout: 51000, type: 'Smoke damage, hood failure' },
      { label: 'Bistro — Wilmington', payout: 46100, type: 'Kitchen fire, 3wk closure' },
      { label: 'Bakery — Greensboro', payout: 40900, type: 'Oven fire, minor structural' },
      { label: 'Restaurant — Cary',   payout: 49600, type: 'Fire + water, 4wk closure' },
    ],
  },
};

Object.assign(window, { DEMO });
