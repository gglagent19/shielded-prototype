// ─── Shielded / AttorneyAITools.org — Configuration ─────────────────────────
// Fill in your credentials below, then remove the DEMO_MODE flag from app.html
//
// HOW TO GET THESE VALUES:
//   Supabase:  https://app.supabase.com → your project → Settings → API
//   Stripe:    https://dashboard.stripe.com → Payment Links → create one
//   Resend:    Used server-side only (in Supabase Edge Functions)

window.SHIELDED_CONFIG = {

  // ── Supabase ────────────────────────────────────────────────────────────────
  SUPABASE_URL:       'https://YOUR_PROJECT.supabase.co',   // ← paste your project URL
  SUPABASE_ANON_KEY:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY',  // ← anon/public key

  // ── Stripe Payment Links ────────────────────────────────────────────────────
  // Create these at: https://dashboard.stripe.com/payment-links
  STRIPE_ANALYSIS_LINK:     'https://buy.stripe.com/YOUR_LINK',  // $49 one-time report
  STRIPE_MONTHLY_LINK:      'https://buy.stripe.com/YOUR_LINK',  // $29/mo subscription
  STRIPE_ANNUAL_LINK:       'https://buy.stripe.com/YOUR_LINK',  // $199/yr subscription

  // ── Feature flags ───────────────────────────────────────────────────────────
  LIVE_MODE:          false,  // ← set to true after filling in keys above
  WAITLIST_MODE:      true,   // ← show waitlist instead of paywall while building

};
