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

  const platformCounts = {}
  data.forEach(d => {
    const p = d.platform?.trim()
    if (p) platformCounts[p] = (platformCounts[p] || 0) + 1
  })
  const topPlatform = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  return { total, newLeads, uniqueCompanies, activeCampaigns, interestedLeads, topPlatform }
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
