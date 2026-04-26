// Supabase Edge Function: news-monitor
// Runs daily — uses SerpAPI Google News to find businesses hit by accidents/incidents
// then generates personalized outreach emails linking to their city/incident page.
//
// Deploy: supabase functions deploy news-monitor --no-verify-jwt
// Secrets: SERPAPI_KEY (set), RESEND_API_KEY (set), FROM_EMAIL (set)
//
// Set up daily cron (run in Supabase SQL editor):
//   select cron.schedule(
//     'news-monitor-daily',
//     '0 8 * * *',
//     $$
//       select net.http_post(
//         url    := current_setting('app.supabase_url') || '/functions/v1/news-monitor',
//         headers := '{"Content-Type":"application/json","Authorization":"Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
//         body   := '{}'::jsonb
//       );
//     $$
//   );

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Search queries — each costs 1 SerpAPI credit ───────────────────────────
// With 100 free credits/month → run top 20 queries daily (3 credits/day)
const SEARCH_QUERIES = [
  'fire damage business restaurant shop',
  'flood damage store commercial property',
  'burglary break-in business',
  'theft robbery small business',
  'kitchen fire restaurant',
  'roof collapse commercial building',
  'water damage business burst pipe',
  'tornado hurricane damage business',
  'vandalism business property damage',
  'equipment breakdown restaurant',
  'slip fall lawsuit business',
  'smoke damage commercial property',
  'hail damage commercial roof',
  'vehicle crash into business',
  'food spoilage restaurant power outage',
  'sewage backup business',
  'grease fire commercial kitchen',
  'electrical fire business',
  'frozen pipe burst business',
  'wildfire damage business',
];

// ─── State name → slug ────────────────────────────────────────────────────────
const STATE_MAP: Record<string, string> = {
  'alabama':'alabama','alaska':'alaska','arizona':'arizona','arkansas':'arkansas',
  'california':'california','colorado':'colorado','connecticut':'connecticut',
  'delaware':'delaware','florida':'florida','georgia':'georgia','hawaii':'hawaii',
  'idaho':'idaho','illinois':'illinois','indiana':'indiana','iowa':'iowa',
  'kansas':'kansas','kentucky':'kentucky','louisiana':'louisiana','maine':'maine',
  'maryland':'maryland','massachusetts':'massachusetts','michigan':'michigan',
  'minnesota':'minnesota','mississippi':'mississippi','missouri':'missouri',
  'montana':'montana','nebraska':'nebraska','nevada':'nevada',
  'new hampshire':'new-hampshire','new jersey':'new-jersey','new mexico':'new-mexico',
  'new york':'new-york','north carolina':'north-carolina','north dakota':'north-dakota',
  'ohio':'ohio','oklahoma':'oklahoma','oregon':'oregon','pennsylvania':'pennsylvania',
  'rhode island':'rhode-island','south carolina':'south-carolina',
  'south dakota':'south-dakota','tennessee':'tennessee','texas':'texas','utah':'utah',
  'vermont':'vermont','virginia':'virginia','washington':'washington',
  'west virginia':'west-virginia','wisconsin':'wisconsin','wyoming':'wyoming',
  'al':'alabama','ak':'alaska','az':'arizona','ar':'arkansas','ca':'california',
  'co':'colorado','ct':'connecticut','de':'delaware','fl':'florida','ga':'georgia',
  'hi':'hawaii','id':'idaho','il':'illinois','in':'indiana','ia':'iowa','ks':'kansas',
  'ky':'kentucky','la':'louisiana','me':'maine','md':'maryland','ma':'massachusetts',
  'mi':'michigan','mn':'minnesota','ms':'mississippi','mo':'missouri','mt':'montana',
  'ne':'nebraska','nv':'nevada','nh':'new-hampshire','nj':'new-jersey',
  'nm':'new-mexico','ny':'new-york','nc':'north-carolina','nd':'north-dakota',
  'oh':'ohio','ok':'oklahoma','or':'oregon','pa':'pennsylvania','ri':'rhode-island',
  'sc':'south-carolina','sd':'south-dakota','tn':'tennessee','tx':'texas',
  'ut':'utah','vt':'vermont','va':'virginia','wa':'washington',
  'wv':'west-virginia','wi':'wisconsin','wy':'wyoming',
};

function extractLocation(text: string): { city: string; state: string; stateSlug: string } | null {
  const stateNames = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming';

  // "City, State" or "City, ST"
  const patterns = [
    new RegExp(`([A-Z][a-zA-Z\\s]{2,25}),\\s*(${stateNames})`, 'i'),
    /([A-Z][a-zA-Z\s]{2,20}),\s+([A-Z]{2})\b/,
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const city = m[1].trim().replace(/^(in|at|near)\s+/i, '');
      const stateRaw = m[2].trim().toLowerCase();
      const stateSlug = STATE_MAP[stateRaw];
      if (stateSlug && city.length > 2 && city.length < 40) {
        return { city, state: m[2].trim(), stateSlug };
      }
    }
  }
  return null;
}

function extractBusinessName(title: string, snippet: string): string | null {
  const text = title + ' ' + snippet;
  // Quoted name
  const q = text.match(/"([^"]{3,50})"|'([^']{3,50})'/);
  if (q) return (q[1] || q[2]).trim();
  // "at [Name]"
  const at = text.match(/\bat\s+([A-Z][a-zA-Z\s&'.-]{3,35})(?:\s+(?:in|on|was|has|after|sustained|suffers?)|\s*[,.])/);
  if (at) return at[1].trim();
  // "[Name] restaurant/bar/shop/etc"
  const biz = text.match(/([A-Z][a-zA-Z\s&'.-]{2,30})\s+(?:restaurant|bar|cafe|diner|shop|store|salon|gym|hotel|motel|pub|grill|bakery|auto|garage|clinic|laundry|market|brewery|winery|dispensary|dealership)/i);
  if (biz) return biz[1].trim();
  return null;
}

function detectIncident(text: string): { type: string; slug: string } {
  const lower = text.toLowerCase();
  const rules: [string[], string, string][] = [
    [['kitchen fire','grease fire','cooking fire','hood fire','duct fire'],   'Kitchen Fire',            'kitchen-fire'],
    [['electrical fire','wiring fire','breaker fire'],                         'Electrical Fire',         'electrical-fire'],
    [['wildfire','brush fire','forest fire'],                                  'Wildfire',                'wildfire'],
    [['fire','blaze','flames','burned down','burnt','arson'],                  'Fire Damage',             'structure-fire'],
    [['smoke damage','smoke'],                                                 'Smoke Damage',            'smoke-damage'],
    [['flood','flooding','floodwater','storm surge'],                          'Flood Damage',            'natural-flood'],
    [['burst pipe','pipe burst','frozen pipe','pipe break'],                   'Burst Pipe',              'burst-pipe'],
    [['water damage','water intrusion','roof leak'],                           'Water Damage',            'roof-leak'],
    [['roof collapse','ceiling collapse','ceiling fell'],                      'Roof Collapse',           'roof-collapse'],
    [['hail','hailstorm'],                                                     'Hail Damage',             'hail-damage'],
    [['tornado','twister','severe storm'],                                     'Tornado Damage',          'tornado'],
    [['hurricane','tropical storm','cyclone'],                                 'Hurricane Damage',        'hurricane'],
    [['burglary','burglarized','break-in','broke into','smashed window'],      'Burglary',                'burglary'],
    [['robbery','armed robbery','robbed at gunpoint'],                         'Robbery',                 'robbery'],
    [['theft','stolen','stole','shoplifting','employee theft'],                'Theft',                   'employee-theft'],
    [['vandalism','vandalized','spray paint','graffiti'],                      'Vandalism',               'property-destruction'],
    [['equipment breakdown','equipment failure','machine failure'],            'Equipment Breakdown',     'equipment-breakdown-gen'],
    [['slip and fall','slip fall','tripped and fell','customer fell'],         'Slip & Fall',             'customer-slip-fall'],
    [['food spoilage','power outage food','refrigerator failure','freezer'],   'Food Spoilage',           'food-spoilage-equip'],
    [['sewage backup','sewer backup','raw sewage'],                            'Sewage Backup',           'sewer-backup'],
    [['car crashed into','vehicle hit','car drove into','truck hit building'], 'Vehicle Hit Building',    'vehicle-hit-building'],
    [['wind damage','wind storm','high wind','tree fell on'],                  'Wind/Storm Damage',       'wind-damage'],
    [['chemical spill','gas leak','hazmat'],                                   'Environmental Incident',  'chemical-spill'],
    [['ransomware','cyber attack','data breach','hack'],                       'Cyber Attack',            'ransomware'],
  ];

  for (const [kw, type, slug] of rules) {
    if (kw.some(k => lower.includes(k))) return { type, slug };
  }
  return { type: 'Property Damage', slug: 'structure-fire' };
}

function generateOutreach(
  businessName: string | null, incident: string,
  city: string, state: string, stateSlug: string,
  citySlug: string, incidentSlug: string, articleTitle: string
): { subject: string; body: string } {
  const biz = businessName || 'your business';
  const claimsUrl = `https://attorneyaitools.org/claims/${stateSlug}/${citySlug}/${incidentSlug}/`;
  const waitlistUrl = `https://attorneyaitools.org/waitlist/`;

  const subject = businessName
    ? `${incident} at ${businessName} — insurance claim help`
    : `${incident} in ${city}, ${state} — is your insurance settlement fair?`;

  const body = `Hi ${businessName ? businessName + ' team' : 'there'},

We saw the news about the ${incident.toLowerCase()} at ${biz} in ${city}, ${state}.

Before you accept any insurance settlement, here's something important:

The average commercial insurance claim for ${incident.toLowerCase()} is settled $14,200 below what the policy actually requires — because adjusters routinely apply actual cash value instead of replacement cost, omit standard remediation scope, and miscalculate business income loss.

Shielded is a free AI tool that reads your commercial insurance policy and shows you exactly where the settlement may be short — citing your specific policy sections by number.

We put together a free guide specifically for ${incident.toLowerCase()} claims in ${city}, ${state}:
${claimsUrl}

The full claim analysis tool (upload your policy PDF — takes 90 seconds):
${waitlistUrl}

No attorneys, no fees, no obligation. Just your policy — explained.

Don't sign anything until you know what the policy actually requires.

— Shielded Team
AttorneyAITools.org · ${city}, ${state} Insurance Claim Guides

---
This message was sent because ${biz} was mentioned in recent news.
Reply "remove" to unsubscribe.`;

  return { subject, body };
}

// ─── SerpAPI Google News fetch ────────────────────────────────────────────────
async function fetchSerpAPINews(query: string, apiKey: string): Promise<any[]> {
  const url = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query)}&gl=us&hl=en&api_key=${apiKey}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      console.error(`SerpAPI error for "${query}": ${res.status}`);
      return [];
    }
    const data = await res.json();
    // google_news returns news_results array
    const articles = data.news_results || data.organic_results || [];
    return articles.slice(0, 8).map((a: any) => ({
      title: a.title || '',
      url: a.link || a.url || '',
      description: a.snippet || a.description || '',
      publishedAt: a.date || new Date().toISOString().split('T')[0],
      source: a.source?.name || a.source || 'Google News',
    }));
  } catch (e) {
    console.error(`SerpAPI fetch error for "${query}":`, e.message);
    return [];
  }
}

// ─── Fallback: Google News RSS ────────────────────────────────────────────────
async function fetchGoogleNewsRSS(query: string): Promise<any[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' site:us')}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const xml = await res.text();
    const items: any[] = [];
    for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const it = match[1];
      const title = it.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || it.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link  = it.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const desc  = it.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '';
      const date  = it.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      if (title) items.push({ title, url: link, description: desc.replace(/<[^>]+>/g,''), publishedAt: date, source: 'Google News RSS' });
    }
    return items.slice(0, 6);
  } catch { return []; }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const serpKey  = Deno.env.get('SERPAPI_KEY');
    const results  = { queries: 0, articles: 0, leads_created: 0, skipped_duplicate: 0, errors: [] as string[] };

    for (const query of SEARCH_QUERIES) {
      results.queries++;

      // Fetch news — SerpAPI preferred, RSS fallback
      const articles = serpKey
        ? await fetchSerpAPINews(query, serpKey)
        : await fetchGoogleNewsRSS(query);

      for (const article of articles) {
        results.articles++;
        const text = `${article.title} ${article.description}`;

        // Must find a US location
        const location = extractLocation(text);
        if (!location) continue;

        // Detect incident
        const incident = detectIncident(text);

        // Extract business name
        const businessName = extractBusinessName(article.title, article.description || '');

        // City slug
        const citySlug = location.city.toLowerCase()
          .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

        // Check duplicate
        const { data: dup } = await sb.from('business_leads').select('id').eq('article_url', article.url).maybeSingle();
        if (dup) { results.skipped_duplicate++; continue; }

        // Generate outreach
        const outreach = generateOutreach(
          businessName, incident.type,
          location.city, location.state, location.stateSlug,
          citySlug, incident.slug, article.title
        );

        // Save lead
        const { error } = await sb.from('business_leads').insert({
          business_name:          businessName,
          incident_type:          incident.type,
          incident_slug:          incident.slug,
          city:                   location.city,
          state:                  location.state,
          state_slug:             location.stateSlug,
          city_slug:              citySlug,
          article_title:          article.title,
          article_url:            article.url,
          article_date:           typeof article.publishedAt === 'string'
                                    ? article.publishedAt.substring(0, 10)
                                    : new Date().toISOString().split('T')[0],
          source:                 serpKey ? `SerpAPI · ${article.source}` : 'Google News RSS',
          search_query:           query,
          outreach_email_subject: outreach.subject,
          outreach_email_body:    outreach.body,
          outreach_status:        'pending',
        });

        if (error) {
          if (!error.message.includes('duplicate')) results.errors.push(error.message);
        } else {
          results.leads_created++;
          console.log(`✅ Lead: ${businessName || 'unknown'} | ${incident.type} | ${location.city}, ${location.state}`);
        }
      }
    }

    console.log('Monitor complete:', JSON.stringify(results));
    return new Response(JSON.stringify(results), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
});
