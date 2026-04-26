// ─── Shielded / AttorneyAITools.org — Configuration ─────────────────────────
// Supabase keys are live. Add Stripe Payment Links when ready.

window.SHIELDED_CONFIG = {

  // ── Supabase (attorney-ai-tools project) ────────────────────────────────────
  SUPABASE_URL:       'https://tougkweqcaypycwazreb.supabase.co',
  SUPABASE_ANON_KEY:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdWdrd2VxY2F5cHljd2F6cmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjA2NDAsImV4cCI6MjA5MjY5NjY0MH0._TBhLQ4fpUhPXL5IaYOG4xbGdgcl-y1NxdOiGuX8Le8',

  // ── Stripe Payment Links (add when Stripe is set up) ─────────────────────────
  STRIPE_ANALYSIS_LINK:  'https://buy.stripe.com/YOUR_LINK',  // $49 one-time report
  STRIPE_MONTHLY_LINK:   'https://buy.stripe.com/YOUR_LINK',  // $29/mo subscription
  STRIPE_ANNUAL_LINK:    'https://buy.stripe.com/YOUR_LINK',  // $199/yr subscription

  // ── Feature flags ────────────────────────────────────────────────────────────
  LIVE_MODE:      true,   // Supabase is live — waitlist form saves to DB
  WAITLIST_MODE:  true,   // Show waitlist instead of paywall (flip false after Stripe setup)

};
