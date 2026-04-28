const BREVO_API    = 'https://api.brevo.com/v3/smtp/email'
const BREVO_KEY    = import.meta.env.VITE_BREVO_API_KEY
const SENDER_NAME  = 'IBN Technologies'
const SENDER_EMAIL = 'info@ibntechchat.com'
const TEMPLATE_ID  = 3
const SCRIPT_URL   = 'https://script.google.com/macros/s/AKfycbwqcOsnhpel2_ipWmO3lbZMjRDgFnUdTRNEVf7ikJk0lxuwA6dmzvC6gjOcbPU7JgM/exec'

export async function sendLeadEmail(lead) {
  if (!lead.work_email) throw new Error('No email address for this lead.')

  // Send via Brevo using Template #3
  const res = await fetch(BREVO_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_KEY },
    body: JSON.stringify({
      sender:     { name: SENDER_NAME, email: SENDER_EMAIL },
      to:         [{ email: lead.work_email, name: lead.full_name || '' }],
      templateId: TEMPLATE_ID,
      params: {
        name:    lead.full_name    || 'Valued Client',
        company: lead.company_name || 'your company',
        service: lead.service_needed || lead.service || 'engineering services',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Brevo error ${res.status}`)
  }

  // Update sheet via Apps Script
  try {
    const updateUrl = `${SCRIPT_URL}?action=update&email=${encodeURIComponent(lead.work_email)}`
    await fetch(updateUrl)
  } catch { /* silent */ }

  return true
}
