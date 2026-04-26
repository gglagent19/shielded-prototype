# Shielded — Deployment & Activation Checklist

Complete these steps in order. Time estimate: ~2 hours total.

---

## Step 1 — Supabase project (15 min)

1. Go to https://app.supabase.com → New project
2. Name: `shielded-prod`, region: pick closest to US East
3. Wait for provisioning (~2 min)
4. Go to **Settings → API** and copy:
   - **Project URL** → paste into `js/config.js` as `SUPABASE_URL`
   - **anon/public key** → paste into `js/config.js` as `SUPABASE_ANON_KEY`
5. Go to **SQL Editor → New query** → paste the entire contents of `supabase-schema.sql` → Run
6. Go to **Storage** → verify `policy-docs` bucket was created (or create it manually: private bucket)

---

## Step 2 — Deploy Supabase Edge Functions (20 min)

Install the Supabase CLI first: https://supabase.com/docs/guides/cli

```bash
# Login
supabase login

# Link to your project (find project ref in Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets (get these from each service)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-YOUR_KEY
supabase secrets set RESEND_API_KEY=re_YOUR_KEY
supabase secrets set FROM_EMAIL=hello@attorneyaitools.org

# Deploy functions
supabase functions deploy analyze-policy --no-verify-jwt
supabase functions deploy send-welcome --no-verify-jwt
```

**Get your Anthropic API key:** https://console.anthropic.com → API Keys
**Get your Resend API key:** https://resend.com → API Keys → Add key (verify your domain first)

---

## Step 3 — Stripe setup (15 min)

1. Go to https://dashboard.stripe.com
2. **Payment Links → Create link**
3. Create three products:
   - **One-time Report**: $49 (name: "Shielded Policy Analysis")
   - **Monthly**: $29/month (name: "Shielded Monthly")
   - **Annual**: $199/year (name: "Shielded Annual")
4. Copy each payment link URL into `js/config.js`

**Webhook (for pro plan later):** When you're ready to unlock features after payment, add a Stripe webhook → Supabase Edge Function that updates `profiles.plan`.

---

## Step 4 — Domain & DNS (10 min, if not done)

The CNAME file already sets `attorneyaitools.org` as the domain.

In your DNS provider:
```
CNAME  www   gglagent19.github.io
A      @     185.199.108.153
A      @     185.199.109.153
A      @     185.199.110.153
A      @     185.199.111.153
```

In GitHub Pages settings → Custom domain → `attorneyaitools.org` → Enable HTTPS.

---

## Step 5 — Activate live mode (5 min)

In `js/config.js`:
```js
LIVE_MODE: true,   // ← change false to true
```

Add this script tag to `app.html` before the closing `</head>` (replace the DEMO_MODE line):
```html
<script src="js/config.js"></script>
```

Then find `const DEMO_MODE = true;` in app.html and change to:
```js
const DEMO_MODE = !(window.SHIELDED_CONFIG?.LIVE_MODE);
```

---

## Step 6 — Google Search Console (10 min)

1. Go to https://search.google.com/search-console
2. Add property → URL prefix → `https://attorneyaitools.org`
3. Verify via HTML tag (add to app.html `<head>`) or DNS TXT record
4. Go to **Sitemaps → Add sitemap** → enter `sitemap-index.xml`
5. Done — indexing starts within 24–48 hours

---

## Step 7 — Resend domain verification (15 min)

1. Go to https://resend.com → Domains → Add domain → `attorneyaitools.org`
2. Add the DNS records Resend provides (SPF, DKIM)
3. Wait for verification (usually 5–15 min)
4. Create API key and save it (already set in Step 2)

---

## Step 8 — Distribution (do now, ongoing)

**Today:**
- [ ] Submit sitemap to Google Search Console (Step 6)
- [ ] Post Reddit content from `brand-assets/reddit-posts.md` to:
  - r/smallbusiness (best: informational post, not just a link)
  - r/insurance
  - r/entrepreneur
- [ ] Post LinkedIn content from `go-to-market/linkedin-series.md` — start with Post 3 (story)
- [ ] Post social images from `brand-assets/social-post-1.png` through `5.png`

**This week:**
- [ ] Send broker outreach emails from `brand-assets/broker-outreach-emails.md` (start with 10 attorneys in your state)
- [ ] Record YouTube video from `go-to-market/youtube-script.md` (Loom is fine for v1)

**Launch day:**
- [ ] Product Hunt — use `go-to-market/product-hunt.md`
- [ ] Post LinkedIn Post 10 (launch announcement) same day

---

## Step 9 — Monitor & iterate

**Key metrics to watch:**
- Waitlist signups (Supabase → Table Editor → waitlist)
- Google Search Console → Pages indexed + clicks
- GA4 → Sessions, bounce rate on waitlist page
- Stripe → Revenue

**When to launch paid tier:**
Once you have 100+ waitlist signups and a working analysis flow — flip `WAITLIST_MODE: false` in `config.js`.

---

## Troubleshooting

**Edge function not working:**
```bash
supabase functions logs analyze-policy
```

**Waitlist form not saving:**
Check Supabase → Table Editor → waitlist. If empty, check browser console for CORS or policy errors.

**Email not sending:**
Check Resend dashboard → Logs. Verify domain is confirmed.

**PDF analysis slow:**
Claude API typically takes 10–30 seconds for a full policy. Show a loading state in the UI.
