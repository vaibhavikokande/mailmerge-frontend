export function computeKPIs(data) {
  const total = data.length

  const newLeads = data.filter(d =>
    !d.status?.trim() || d.status?.toLowerCase() === 'new'
  ).length

  const uniqueCompanies = new Set(
    data.map(d => d.company_name?.trim()).filter(Boolean)
  ).size

  const activeCampaigns = new Set(
    data.map(d => d.campaign_name?.trim()).filter(Boolean)
  ).size

  const interestedLeads = data.filter(d =>
    d.status?.toLowerCase().includes('interest')
  ).length

  // Platform breakdown
  const platformCounts = {}
  data.forEach(d => {
    const p = (d.platform?.trim() || '').toLowerCase()
    if (p) platformCounts[p] = (platformCounts[p] || 0) + 1
  })
  const topPlatform = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() || '—'

  const fromFB = platformCounts['fb'] || platformCounts['facebook'] || 0
  const fromIG = platformCounts['ig'] || platformCounts['instagram'] || 0

  // Email sent tracking
  const emailsSent = data.filter(d =>
    d.email_sent?.toLowerCase() === 'yes' || d.status?.toLowerCase() === 'sent'
  ).length

  const processed = data.filter(d =>
    d.status?.toLowerCase() === 'processed' || d.status?.toLowerCase() === 'sent'
  ).length

  const pending = total - processed

  // Today's sent emails
  const today = new Date().toDateString()
  const emailsSentToday = data.filter(d => {
    if (d.processed_at) {
      return new Date(d.processed_at).toDateString() === today
    }
    return false
  }).length

  return {
    total, newLeads, uniqueCompanies, activeCampaigns, interestedLeads,
    topPlatform, fromFB, fromIG, processed, pending, emailsSent, emailsSentToday
  }
}

export function getEngagementData(data, buckets = 12) {
  if (!data.length) return []
  const count = Math.min(buckets, data.length)
  const size  = Math.ceil(data.length / count)
  const base  = new Date()
  base.setDate(base.getDate() - count + 1)

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const start = i * size
    const end   = Math.min(start + size, data.length)
    return { date: label, leads: end - start, cumulative: end }
  })
}

export function filterData(data, search) {
  if (!search?.trim()) return data
  const q = search.toLowerCase()
  return data.filter(d =>
    d.full_name?.toLowerCase().includes(q) ||
    d.work_email?.toLowerCase().includes(q) ||
    d.company_name?.toLowerCase().includes(q)
  )
}
