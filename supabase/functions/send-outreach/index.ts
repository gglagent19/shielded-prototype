// Supabase Edge Function: send-outreach
// Sends personalized emails to business leads found by news-monitor
//
// Deploy: supabase functions deploy send-outreach --no-verify-jwt
//
// Modes:
//   auto_send: false  → just log leads (review mode, default)
//   auto_send: true   → send emails automatically (activate when ready)
//   lead_id: "uuid"   → send to a specific lead manually

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function sendEmail(to: string, subject: string, body: string, fromEmail: string, resendKey: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Shielded <${fromEmail}>`,
      to: [to],
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>').replace(/(https:\/\/[^\s]+)/g, '<a href="$1">$1</a>'),
    })
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
  return res.json();
}

// Find contact email by scraping business website or article
async function findContactEmail(businessName: string | null, articleUrl: string): Promise<string | null> {
  if (!businessName) return null;

  try {
    // Try to scrape email from article page
    const res = await fetch(articleUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
    const html = await res.text();

    // Look for email addresses in the page
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      const email = emailMatch[0].toLowerCase();
      // Skip news site emails
      if (!email.includes('gmail') && !email.includes('nytimes') && !email.includes('local') &&
          !email.includes('reporter') && !email.includes('editor') && !email.includes('news')) {
        return email;
      }
    }
  } catch { /* ignore scraping errors */ }

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const body = await req.json().catch(() => ({}));
    const { auto_send = false, lead_id } = body;

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'hello@attorneyaitools.org';

    const results = { leads_reviewed: 0, emails_sent: 0, emails_queued: 0, errors: [] as string[] };

    // Get pending leads
    let query = sb.from('business_leads').select('*').eq('outreach_status', 'pending').order('created_at', { ascending: false });
    if (lead_id) query = query.eq('id', lead_id);

    const { data: leads, error } = await query.limit(50);
    if (error) throw error;

    for (const lead of leads || []) {
      results.leads_reviewed++;

      // Try to find contact email
      const contactEmail = lead.contact_email || await findContactEmail(lead.business_name, lead.article_url);

      if (contactEmail) {
        await sb.from('business_leads').update({ contact_email: contactEmail }).eq('id', lead.id);
      }

      if (auto_send && contactEmail && resendKey) {
        try {
          await sendEmail(contactEmail, lead.outreach_email_subject, lead.outreach_email_body, fromEmail, resendKey);
          await sb.from('business_leads').update({
            outreach_status: 'sent',
            contact_email: contactEmail,
            sent_at: new Date().toISOString(),
          }).eq('id', lead.id);
          results.emails_sent++;
          console.log(`✅ Sent to ${contactEmail} for ${lead.business_name || 'unknown'} (${lead.incident_type})`);
        } catch (e) {
          results.errors.push(`${lead.id}: ${e.message}`);
        }
      } else if (!auto_send) {
        results.emails_queued++;
        console.log(`📋 Lead queued: ${lead.business_name || 'unknown'} | ${lead.incident_type} | ${lead.city}, ${lead.state} | email: ${contactEmail || 'not found'}`);
      }
    }

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
