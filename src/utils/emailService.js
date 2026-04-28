const BREVO_API    = 'https://api.brevo.com/v3/smtp/email'
const BREVO_KEY    = import.meta.env.VITE_BREVO_API_KEY
const SENDER_NAME  = 'IBN Technologies'
const SENDER_EMAIL = 'info@ibntechchat.com'
const SCRIPT_URL   = 'https://script.google.com/macros/s/AKfycbwqcOsnhpel2_ipWmO3lbZMjRDgFnUdTRNEVf7ikJk0lxuwA6dmzvC6gjOcbPU7JgM/exec'

function buildHtml(lead) {
  const name    = lead.full_name    || 'Valued Client'
  const company = lead.company_name || 'your company'
  const service = lead.service_needed || lead.service || 'our engineering services'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;background:#f0f4f8}
  .wrap{max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)}
  .hdr{background:linear-gradient(135deg,#1A56A0 0%,#2563EB 100%);padding:40px 36px;text-align:center}
  .hdr h1{color:#fff;font-size:28px;font-weight:700;letter-spacing:.5px;margin-bottom:6px}
  .hdr p{color:#bfdbfe;font-size:13px}
  .body{padding:40px 36px}
  .greeting{font-size:17px;font-weight:600;color:#111827;margin-bottom:20px}
  .text{font-size:15px;color:#374151;line-height:1.8;margin-bottom:16px}
  .divider{height:1px;background:#e5e7eb;margin:28px 0}
  .highlight{background:#f0f7ff;border-left:4px solid #1A56A0;border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0;font-size:14px;color:#1e3a5f;line-height:1.7}
  .cta{text-align:center;margin:32px 0}
  .cta a{background:#1A56A0;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block;letter-spacing:.3px}
  .cta a:hover{background:#2563EB}
  .sign{font-size:14px;color:#6b7280;line-height:1.8;margin-top:28px}
  .sign strong{color:#111827;font-size:15px}
  .footer{background:#f9fafb;padding:20px 36px;text-align:center;border-top:1px solid #e5e7eb}
  .footer p{font-size:11px;color:#9ca3af;margin:3px 0}
</style>
</head>
<body>
<div class="wrap">

  <div class="hdr">
    <h1>IBN Technologies</h1>
    <p>Engineering Back-Office Services &amp; IT Outsourcing</p>
  </div>

  <div class="body">
    <p class="greeting">Dear ${name},</p>

    <p class="text">
      Thank you for your interest in our <strong>engineering back-office services</strong>.
    </p>

    <p class="text">
      We've helped GCs and businesses streamline operations and achieve measurable
      efficiency gains, and we'd love to explore how we can support
      <strong>${company}</strong> as well.
    </p>

    <div class="highlight">
      📋 <strong>Service of Interest:</strong> ${service}
    </div>

    <p class="text">
      Your time is valuable, so please use the link below to schedule a call
      at your convenience.
    </p>

    <p class="text">
      Our consultant will also reach out to you within the <strong>next 15 hours</strong>.
    </p>

    <p class="text">We look forward to connecting.</p>

    <div class="cta">
      <a href="https://www.ibntech.com" target="_blank">📅 Schedule a Call →</a>
    </div>

    <div class="divider"></div>

    <div class="sign">
      Best regards,<br>
      <strong>IBN Technologies Team</strong><br>
      📧 info@ibntechchat.com &nbsp;|&nbsp; 🌐 www.ibntech.com
    </div>
  </div>

  <div class="footer">
    <p><strong>IBN Technologies Ltd.</strong></p>
    <p>info@ibntechchat.com &nbsp;|&nbsp; www.ibntech.com</p>
    <p style="margin-top:8px">You received this email because you submitted an inquiry through our platform.</p>
  </div>

</div>
</body>
</html>`
}

export async function sendLeadEmail(lead) {
  if (!lead.work_email) throw new Error('No email address for this lead.')

  // Send via Brevo
  const res = await fetch(BREVO_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_KEY },
    body: JSON.stringify({
      sender:      { name: SENDER_NAME, email: SENDER_EMAIL },
      to:          [{ email: lead.work_email, name: lead.full_name || '' }],
      subject:     `Your Inquiry with IBN Technologies — Let's Connect!`,
      htmlContent: buildHtml(lead),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Brevo error ${res.status}`)
  }

  // Update sheet via Apps Script GET request (avoids CORS preflight issues)
  try {
    const updateUrl = `${SCRIPT_URL}?action=update&email=${encodeURIComponent(lead.work_email)}`
    await fetch(updateUrl)
  } catch { /* silent fail — email was already sent */ }

  return true
}
