// Supabase Edge Function: send-welcome
// Handles: waitlist confirmation + analysis-ready notification
// Deploy: supabase functions deploy send-welcome --no-verify-jwt
// Set secrets:
//   supabase secrets set RESEND_API_KEY=re_...
//   supabase secrets set FROM_EMAIL=hello@attorneyaitools.org

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Shielded <${Deno.env.get('FROM_EMAIL') || 'hello@attorneyaitools.org'}>`,
      to: [to],
      subject,
      html,
    })
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
  return res.json();
}

const emailBase = (content: string) => `
<!doctype html><html><head><meta charset="utf-8">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#f6f3ee;margin:0;padding:40px 20px}
  .card{background:#fff;border-radius:12px;max-width:560px;margin:0 auto;padding:40px;border:1px solid #e0dbd2}
  .logo{color:#1c2333;font-weight:700;font-size:16px;margin-bottom:28px;display:flex;align-items:center;gap:8px}
  h1{font-size:22px;font-weight:700;color:#1c2333;margin:0 0 14px;letter-spacing:-.02em}
  p{font-size:15px;color:#2a3140;line-height:1.65;margin:0 0 16px}
  .btn{display:inline-block;background:#1c2333;color:#fff;padding:13px 26px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;margin:8px 0}
  .stat{background:#f6f3ee;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:14px;color:#5b6472}
  .stat strong{color:#1c2333;font-size:24px;display:block;margin-bottom:2px}
  .footer{text-align:center;font-size:11.5px;color:#8a9097;margin-top:24px}
</style></head><body>
<div class="card">
<div class="logo">🛡 Shielded</div>
${content}
<div class="footer">
AttorneyAITools.org · Not legal advice<br>
<a href="https://attorneyaitools.org/waitlist/?unsubscribe=1" style="color:#8a9097">Unsubscribe</a>
</div>
</div></body></html>`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const body = await req.json();
    const { type, email, name, policy_id, user_id } = body;

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Waitlist welcome ─────────────────────────────────────────────────
    if (type === 'waitlist' || (!type && email)) {
      await sendEmail(
        email,
        'You\'re on the Shielded waitlist 🛡',
        emailBase(`
<h1>You're in, ${name?.split(' ')[0] || 'there'}.</h1>
<p>We'll analyze your commercial insurance policy and find exactly where your insurer is short-changing you — for free.</p>
<div class="stat">
  <strong>$14,200</strong>
  That's the average gap between an insurer's first offer and what the policy actually supports. We find it using your exact policy language.
</div>
<p>While you wait, browse our claim guides for your state:</p>
<a href="https://attorneyaitools.org/claims/" class="btn">Browse 162,000+ claim guides →</a>
<p style="font-size:13px;color:#5b6472;margin-top:20px">We'll email you the moment your analysis tool is ready. Usually within 24 hours of launch.</p>
`)
      );
    }

    // ── Analysis ready ────────────────────────────────────────────────────
    if (type === 'analysis_ready' && policy_id && user_id) {
      const { data: profile } = await sb.from('profiles').select('email,business_name').eq('id', user_id).single();
      const { data: policy } = await sb.from('policies').select('coverage_score,analysis_json').eq('id', policy_id).single();
      if (!profile || !policy) throw new Error('Profile or policy not found');

      const score = policy.coverage_score;
      const scoreLabel = score >= 80 ? 'Strong' : score >= 60 ? 'Adequate' : score >= 40 ? 'Below average' : 'Needs attention';

      await sendEmail(
        profile.email,
        `Your policy analysis is ready — coverage score: ${score}/100`,
        emailBase(`
<h1>Your analysis is ready.</h1>
<p>We've read every page of your ${profile.business_name || 'business'} insurance policy.</p>
<div class="stat">
  <strong>${score}/100</strong>
  Coverage score — ${scoreLabel}
</div>
<p>We found the specific clauses that matter for your situation, flagged where coverage is thin, and drafted the dispute language you'd need if your claim gets lowballed.</p>
<a href="https://attorneyaitools.org/app.html#/app/dashboard" class="btn">View your full analysis →</a>
<p style="font-size:13px;color:#5b6472;margin-top:20px">Your dispute letter and coverage gap report are waiting in your dashboard.</p>
`)
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
});
