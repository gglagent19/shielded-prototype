// Supabase Edge Function: news-monitor
// Runs daily via pg_cron — scans news for business incidents, generates leads + outreach
//
// Deploy: supabase functions deploy news-monitor --no-verify-jwt
// Secrets needed:
//   supabase secrets set NEWS_API_KEY=your_newsapi_key       ← free at newsapi.org
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...        ← for smart parsing (optional)
//
// Cron: run daily at 8am UTC
//   select cron.schedule('news-monitor-daily', '0 8 * * *',
//     $$select net.http_post(
//       url := current_setting('app.supabase_url') || '/functions/v1/news-monitor',
//       headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key')),
//       body := '{}'
//     )$$
//   );

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

// ─── Incident keywords to monitor ───────────────────────────────────────────
const SEARCH_QUERIES = [
  'fire damage restaurant business',
  'kitchen fire restaurant',
  'flood damage business',
  'water damage store shop',
  'burglary business break-in',
  'theft equipment business',
  'vandalism business damage',
  'roof collapse business',
  'equipment breakdown restaurant',
  'tornado damage business',
  'hurricane damage business',
  'pipe burst water damage business',
  'smoke damage business',
  'car hit building business',
  'slip fall lawsuit business',
  'food spoilage restaurant',
  'grease fire commercial kitchen',
  'electrical fire business',
  'sewage backup business',
  'hail damage commercial roof',
];

// ─── US state slug map ────────────────────────────────────────────────────────
const STATE_MAP: Record<string, string> = {
  'alabama': 'alabama', 'alaska': 'alaska', 'arizona': 'arizona', 'arkansas': 'arkansas',
  'california': 'california', 'colorado': 'colorado', 'connecticut': 'connecticut',
  'delaware': 'delaware', 'florida': 'florida', 'georgia': 'georgia', 'hawaii': 'hawaii',
  'idaho': 'idaho', 'illinois': 'illinois', 'indiana': 'indiana', 'iowa': 'iowa',
  'kansas': 'kansas', 'kentucky': 'kentucky', 'louisiana': 'louisiana', 'maine': 'maine',
  'maryland': 'maryland', 'massachusetts': 'massachusetts', 'michigan': 'michigan',
  'minnesota': 'minnesota', 'mississippi': 'mississippi', 'missouri': 'missouri',
  'montana': 'montana', 'nebraska': 'nebraska', 'nevada': 'nevada', 'new hampshire': 'new-hampshire',
  'new jersey': 'new-jersey', 'new mexico': 'new-mexico', 'new york': 'new-york',
  'north carolina': 'north-carolina', 'north dakota': 'north-dakota', 'ohio': 'ohio',
  'oklahoma': 'oklahoma', 'oregon': 'oregon', 'pennsylvania': 'pennsylvania',
  'rhode island': 'rhode-island', 'south carolina': 'south-carolina', 'south dakota': 'south-dakota',
  'tennessee': 'tennessee', 'texas': 'texas', 'utah': 'utah', 'vermont': 'vermont',
  'virginia': 'virginia', 'washington': 'washington', 'west virginia': 'west-virginia',
  'wisconsin': 'wisconsin', 'wyoming': 'wyoming',
  // abbreviations
  'al':'alabama','ak':'alaska','az':'arizona','ar':'arkansas','ca':'california',
  'co':'colorado','ct':'connecticut','de':'delaware','fl':'florida','ga':'georgia',
  'hi':'hawaii','id':'idaho','il':'illinois','in':'indiana','ia':'iowa','ks':'kansas',
  'ky':'kentucky','la':'louisiana','me':'maine','md':'maryland','ma':'massachusetts',
  'mi':'michigan','mn':'minnesota','ms':'mississippi','mo':'missouri','mt':'montana',
  'ne':'nebraska','nv':'nevada','nh':'new-hampshire','nj':'new-jersey','nm':'new-mexico',
  'ny':'new-york','nc':'north-carolina','nd':'north-dakota','oh':'ohio','ok':'oklahoma',
  'or':'oregon','pa':'pennsylvania','ri':'rhode-island','sc':'south-carolina',
  'sd':'south-dakota','tn':'tennessee','tx':'texas','ut':'utah','vt':'vermont',
  'va':'virginia','wa':'washington','wv':'west-virginia','wi':'wisconsin','wy':'wyoming',
};

// ─── Incident type → site slug mapping ──────────────────────────────────────
const INCIDENT_SLUG_MAP: Record<string, string> = {
  'fire': 'kitchen-fire', 'kitchen fire': 'kitchen-fire', 'grease fire': 'grease-fire',
  'electrical fire': 'electrical-fire', 'smoke': 'smoke-damage', 'flood': 'natural-flood',
  'water damage': 'burst-pipe', 'burst pipe': 'burst-pipe', 'pipe burst': 'burst-pipe',
  'roof': 'roof-collapse', 'roof collapse': 'roof-collapse', 'hail': 'hail-damage',
  'tornado': 'tornado', 'hurricane': 'hurricane', 'burglary': 'burglary',
  'break-in': 'burglary', 'theft': 'burglary', 'equipment': 'equipment-breakdown-gen',
  'vandalism': 'property-destruction', 'slip': 'customer-slip-fall',
  'fall': 'customer-slip-fall', 'food spoilage': 'food-spoilage-equip',
  'sewage': 'sewer-backup', 'car hit': 'vehicle-hit-building',
};

// ─── Extract location from article text ─────────────────────────────────────
function extractLocation(text: string): { city: string; state: string; stateSlug: string } | null {
  // Match patterns like "City, State" or "City, ST"
  const patterns = [
    /in ([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*)/,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const city = match[1].trim();
      const stateRaw = match[2].trim().toLowerCase();
      const stateSlug = STATE_MAP[stateRaw];
      if (stateSlug) {
        return { city, state: match[2].trim(), stateSlug };
      }
    }
  }
  return null;
}

// ─── Extract business name from title/description ───────────────────────────
function extractBusinessName(title: string, description: string): string | null {
  const text = title + ' ' + description;
  // Look for quoted business names
  const quoted = text.match(/"([^"]{3,50})"|'([^']{3,50})'/);
  if (quoted) return quoted[1] || quoted[2];

  // Look for patterns like "at [Business Name]"
  const atPattern = text.match(/at\s+([A-Z][a-zA-Z\s&'.-]{3,40})(?:\s+in|\s+on|\s*,|\s+was|\s+has)/);
  if (atPattern) return atPattern[1].trim();

  // Look for "The [X] restaurant/store/bar/etc"
  const thePattern = text.match(/(?:The\s+)?([A-Z][a-zA-Z\s&'.-]{2,30})\s+(?:restaurant|bar|cafe|diner|shop|store|salon|gym|hotel|motel|pub|grill|bakery|laundry|auto|garage|clinic)/i);
  if (thePattern) return thePattern[1].trim();

  return null;
}

// ─── Determine incident type from text ───────────────────────────────────────
function detectIncidentType(text: string): { type: string; slug: string } {
  const lower = text.toLowerCase();
  const checks: [string[], string, string][] = [
    [['kitchen fire', 'grease fire', 'cooking fire'], 'Kitchen Fire', 'kitchen-fire'],
    [['electrical fire', 'wiring fire', 'electrical'], 'Electrical Fire', 'electrical-fire'],
    [['fire', 'blaze', 'flames', 'burned', 'burnt'], 'Fire Damage', 'structure-fire'],
    [['smoke damage', 'smoke'], 'Smoke Damage', 'smoke-damage'],
    [['flood', 'flooding', 'floodwater'], 'Flooding', 'natural-flood'],
    [['water damage', 'burst pipe', 'pipe burst', 'pipe break'], 'Water Damage', 'burst-pipe'],
    [['roof collapse', 'roof fell', 'ceiling collapse'], 'Roof/Ceiling Collapse', 'roof-collapse'],
    [['hail', 'hailstorm'], 'Hail Damage', 'hail-damage'],
    [['tornado', 'twister'], 'Tornado Damage', 'tornado'],
    [['hurricane', 'tropical storm'], 'Hurricane Damage', 'hurricane'],
    [['burglary', 'break-in', 'broke into', 'burglar', 'burglarized'], 'Burglary', 'burglary'],
    [['theft', 'stolen', 'stole', 'robbed', 'robbery'], 'Theft/Robbery', 'robbery'],
    [['vandalism', 'vandalized', 'damage property', 'smashed'], 'Vandalism', 'property-destruction'],
    [['equipment failure', 'equipment broke', 'machine broke'], 'Equipment Breakdown', 'equipment-breakdown-gen'],
    [['slip', 'fall', 'tripped', 'fell'], 'Slip & Fall', 'customer-slip-fall'],
    [['food spoilage', 'power outage food', 'refriger'], 'Food Spoilage', 'food-spoilage-equip'],
    [['sewage', 'sewer backup'], 'Sewer Backup', 'sewer-backup'],
    [['car hit', 'vehicle crash', 'car crashed into', 'drove into'], 'Vehicle Hit Building', 'vehicle-hit-building'],
    [['wind damage', 'windstorm'], 'Wind Damage', 'wind-damage'],
  ];

  for (const [keywords, type, slug] of checks) {
    if (keywords.some(k => lower.includes(k))) return { type, slug };
  }
  return { type: 'Property Damage', slug: 'structure-fire' };
}

// ─── Generate outreach email ─────────────────────────────────────────────────
function generateOutreach(
  businessName: string | null,
  incidentType: string,
  city: string,
  stateName: string,
  stateSlug: string,
  citySlug: string,
  incidentSlug: string,
  articleTitle: string
): { subject: string; body: string } {
  const biz = businessName || 'your business';
  const claimsUrl = `https://attorneyaitools.org/claims/${stateSlug}/${citySlug}/${incidentSlug}/`;

  const subject = businessName
    ? `Re: ${incidentType} at ${businessName} — don't sign anything yet`
    : `${incidentType} in ${city}, ${stateName} — insurance claim help`;

  const body = `Hi ${businessName ? businessName + ' team' : 'there'},

We saw the news about the ${incidentType.toLowerCase()} at ${biz} in ${city}, ${stateName}.

Before you accept any insurance settlement, there's something worth knowing:

The average commercial insurance claim for ${incidentType.toLowerCase()} in ${stateName} is $14,200 below what the policy actually requires — because adjusters routinely use actual cash value instead of replacement cost, omit standard scope items, and miscalculate business income loss.

Shielded is a free AI tool that reads your commercial policy and shows you exactly where the settlement offer may be short — citing your specific policy sections.

It takes 90 seconds. Free to start. No attorneys, no fees.

We wrote a guide specifically for ${incidentType.toLowerCase()} claims in ${city}, ${stateName}:
${claimsUrl}

And the full analysis tool is at: https://attorneyaitools.org/waitlist/

Don't sign the first check until you know what the policy actually requires.

— Shielded Team
AttorneyAITools.org

---
Not legal advice. Unsubscribe: reply with "remove"`;

  return { subject, body };
}

// ─── Fetch news from NewsAPI ─────────────────────────────────────────────────
async function fetchNewsAPIArticles(query: string, apiKey: string): Promise<any[]> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${yesterday}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles || [];
}

// ─── Fetch from Google News RSS (fallback, no key needed) ───────────────────
async function fetchGoogleNewsRSS(query: string): Promise<any[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' US business')}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const res = await fetch(url);
    const xml = await res.text();
    // Parse RSS items
    const items: any[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of itemMatches) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      if (title) items.push({ title, url: link, description: desc, publishedAt: pubDate });
    }
    return items.slice(0, 8);
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

    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    const results = { processed: 0, leads_created: 0, errors: [] as string[] };

    // Process each search query
    for (const query of SEARCH_QUERIES) {
      let articles: any[] = [];

      // Try NewsAPI first, fall back to Google News RSS
      if (newsApiKey) {
        articles = await fetchNewsAPIArticles(query, newsApiKey);
      } else {
        articles = await fetchGoogleNewsRSS(query);
      }

      for (const article of articles) {
        results.processed++;
        const text = `${article.title} ${article.description || ''}`;

        // Skip if no US location found
        const location = extractLocation(text);
        if (!location) continue;

        // Detect incident type
        const incident = detectIncidentType(text);

        // Extract business name
        const businessName = extractBusinessName(article.title, article.description || '');

        // Generate city slug
        const citySlug = location.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check for duplicate (same article URL)
        const { data: existing } = await sb
          .from('business_leads')
          .select('id')
          .eq('article_url', article.url || article.link)
          .single();
        if (existing) continue;

        // Generate outreach
        const outreach = generateOutreach(
          businessName, incident.type,
          location.city, location.state,
          location.stateSlug, citySlug,
          incident.slug, article.title
        );

        // Save lead to Supabase
        const { error } = await sb.from('business_leads').insert({
          business_name: businessName,
          incident_type: incident.type,
          incident_slug: incident.slug,
          city: location.city,
          state: location.state,
          state_slug: location.stateSlug,
          city_slug: citySlug,
          article_title: article.title,
          article_url: article.url || article.link,
          article_date: article.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          source: newsApiKey ? 'NewsAPI' : 'Google News RSS',
          search_query: query,
          outreach_email_subject: outreach.subject,
          outreach_email_body: outreach.body,
          outreach_status: 'pending',
        });

        if (!error) {
          results.leads_created++;
        } else {
          results.errors.push(error.message);
        }
      }
    }

    // Trigger outreach function for pending leads
    if (results.leads_created > 0) {
      await sb.functions.invoke('send-outreach', { body: { auto_send: false } });
    }

    console.log('News monitor complete:', JSON.stringify(results));
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
