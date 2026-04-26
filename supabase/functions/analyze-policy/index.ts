// Supabase Edge Function: analyze-policy
// Invoke: POST /functions/v1/analyze-policy
// Body: { policy_id: string }
//
// Deploy: supabase functions deploy analyze-policy --no-verify-jwt
// Set secrets:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase secrets set RESEND_API_KEY=re_...

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { policy_id } = await req.json();
    if (!policy_id) throw new Error('policy_id required');

    // Init Supabase with service role (has storage access)
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Get policy record
    const { data: policy, error: pErr } = await sb
      .from('policies')
      .select('*')
      .eq('id', policy_id)
      .single();
    if (pErr || !policy) throw new Error('Policy not found');

    // 2. Mark as processing
    await sb.from('policies').update({ analysis_status: 'processing' }).eq('id', policy_id);

    // 3. Download PDF from Supabase Storage
    const { data: fileData, error: fErr } = await sb.storage
      .from('policy-docs')
      .download(policy.storage_path);
    if (fErr || !fileData) throw new Error('Could not download policy file');

    // 4. Convert PDF to base64 for Claude
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // 5. Call Claude API
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 4096,
        system: `You are a commercial insurance claim expert. Analyze the provided policy document and return a structured JSON analysis. Be precise and cite specific policy sections.`,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            },
            {
              type: 'text',
              text: `Analyze this commercial insurance policy and return ONLY valid JSON with this exact structure:
{
  "coverage_score": <integer 0-100>,
  "insurer_name": "<string>",
  "policy_type": "<string>",
  "policy_number": "<string or null>",
  "effective_date": "<YYYY-MM-DD or null>",
  "expiry_date": "<YYYY-MM-DD or null>",
  "coverage_items": [
    {
      "label": "<coverage name>",
      "limit_cents": <integer or null>,
      "covered": <boolean>,
      "flag_text": "<issue or null>",
      "sort_order": <integer>
    }
  ],
  "risks": [
    {
      "level": "<high|med|low>",
      "title": "<short title>",
      "detail": "<1-2 sentence explanation with section reference>"
    }
  ],
  "summary": "<2-3 sentence plain English summary of the policy's strengths and gaps>",
  "dispute_points": [
    "<specific clause or gap that supports a higher claim settlement>"
  ],
  "recommended_actions": [
    "<specific action the policyholder should take>"
  ]
}

Identify:
- All major coverage limits and sublimits
- Missing endorsements that are commonly needed (equipment breakdown, sewer backup, business income, ordinance/law)
- Exclusions that are unusual or particularly harmful
- Any clauses that could be used to dispute an underpaid claim
- The overall coverage score (0=terrible, 100=excellent for a small business)`
            }
          ]
        }]
      })
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      throw new Error(`Claude API error: ${errText}`);
    }

    const claudeData = await claudeRes.json();
    const analysisText = claudeData.content[0].text;

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Claude response');
    const analysis = JSON.parse(jsonMatch[0]);

    // 6. Update policy with results
    await sb.from('policies').update({
      analysis_status: 'done',
      analysis_json: analysis,
      coverage_score: analysis.coverage_score,
      insurer_name: analysis.insurer_name,
      policy_number: analysis.policy_number,
      effective_date: analysis.effective_date,
      expiry_date: analysis.expiry_date,
    }).eq('id', policy_id);

    // 7. Insert coverage items
    if (analysis.coverage_items?.length) {
      await sb.from('coverage_items').insert(
        analysis.coverage_items.map((item: any) => ({ ...item, policy_id }))
      );
    }

    // 8. Insert risks
    if (analysis.risks?.length) {
      await sb.from('policy_risks').insert(
        analysis.risks.map((r: any) => ({ ...r, policy_id }))
      );
    }

    // 9. Trigger welcome/analysis-ready email
    await sb.functions.invoke('send-analysis-ready', {
      body: { policy_id, user_id: policy.user_id }
    });

    return new Response(JSON.stringify({ success: true, policy_id, coverage_score: analysis.coverage_score }), {
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
