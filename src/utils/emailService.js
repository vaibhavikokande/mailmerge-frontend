const BREVO_API    = 'https://api.brevo.com/v3/smtp/email'
const BREVO_KEY    = import.meta.env.VITE_BREVO_API_KEY
const SENDER_NAME  = 'IBN Technologies'
const SENDER_EMAIL = 'info@ibntechchat.com'
const SCRIPT_URL   = import.meta.env.VITE_SCRIPT_URL

function buildHtml(lead) {
  const name    = lead.full_name    || 'Valued Client'
  const company = lead.company_name || 'your company'
  const service = lead.service      || 'our IT services'
  const phone   = lead.phone_number || '—'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;background:#f0f4f8}
  .wrap{max-width:600px;margin:24px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.10)}
  .hdr{background:linear-gradient(135deg,#1A56A0 0%,#2563EB 100%);padding:36px 32px;text-align:center}
  .hdr h1{color:#fff;font-size:26px;letter-spacing:.5px}
  .hdr p{color:#bfdbfe;font-size:13px;margin-top:6px}
  .body{padding:36px 32px}
  .greeting{font-size:18px;font-weight:700;color:#111827;margin-bottom:14px}
  .text{font-size:15px;color:#4b5563;line-height:1.75;margin-bottom:14px}
  .box{background:#eff6ff;border-left:4px solid #1A56A0;border-radius:6px;padding:16px 20px;margin:22px 0}
  .box p{font-size:14px;color:#1e40af;font-weight:600;margin:4px 0}
  .cta{text-align:center;margin:30px 0}
  .cta a{background:#1A56A0;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block}
  .footer{background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb}
  .footer p{font-size:12px;color:#9ca3af;margin:3px 0}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>IBN Technologies</h1>
    <p>Your Trusted IT Outsourcing Partner</p>
  </div>
  <div class="body">
    <p class="greeting">Dear ${name},</p>
    <p class="text">Thank you for reaching out to <strong>IBN Technologies</strong>. We received your inquiry and our team is excited to connect with you.</p>
    <div class="box">
      <p>🏢 Company : ${company}</p>
      <p>🎯 Service : ${service}</p>
      <p>📞 Phone   : ${phone}</p>
    </div>
    <p class="text">We specialize in providing top-tier IT talent and tailored technology solutions. One of our team members will be in touch with you shortly.</p>
    <p class="text">Feel free to reply to this email with any questions.</p>
    <div class="cta">
      <a href="https://www.ibntech.com" target="_blank">Explore IBN Technologies →</a>
    </div>
    <p class="text" style="font-size:13px;color:#6b7280">
      Best regards,<br>
      <strong style="color:#111827">IBN Technologies Team</strong><br>
      📧 info@ibntechchat.com
    </p>
  </div>
  <div class="footer">
    <p><strong>IBN Technologies Ltd.</strong></p>
    <p>info@ibntechchat.com | www.ibntech.com</p>
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
      subject:     `Following up on your ${lead.service || 'IT services'} inquiry — IBN Technologies`,
      htmlContent: buildHtml(lead),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Brevo error ${res.status}`)
  }

  // Update sheet via Apps Script
  try {
    await fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: lead.work_email }),
    })
  } catch { /* no-cors always resolves */ }

  return true
}
