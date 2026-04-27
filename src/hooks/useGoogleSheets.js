import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Column name aliases ─────────────────────────────────────────────────────
const ALIAS = {
  'which_service_do_you_need?': 'service',
  'which service do you need?': 'service',
  'when_do_you_want_to_hire?':  'hire_timeline',
  'when do you want to hire?':  'hire_timeline',
  'service_needed':             'service',
}

function normalise(raw) {
  const h = raw.trim().toLowerCase().replace(/ /g, '_')
  return ALIAS[h] || ALIAS[raw.trim().toLowerCase()] || h
}

// ─── CSV parser (used only for fallback gviz path) ──────────────────────────
function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQ = false
      else field += c
    } else {
      if (c === '"')  inQ = true
      else if (c === ',')  { row.push(field); field = '' }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else if (c !== '\r')  field += c
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

// ─── Convert raw rows (2-D array) → lead objects ────────────────────────────
function rowsToLeads(rows) {
  if (rows.length < 2) return []
  const header = rows[0].map(normalise)
  const idx = n => header.indexOf(n)

  return rows.slice(1)
    .filter(r => r.some(c => String(c).trim() !== ''))
    .map((row, i) => {
      const g = n => String(row[idx(n)] ?? '').trim()
      return {
        id:            `row-${i + 2}`,
        full_name:     g('full_name'),
        work_email:    g('work_email'),
        phone_number:  g('phone_number'),
        company_name:  g('company_name'),
        service:       g('service'),
        resource_type: g('resource_type'),
        hire_timeline: g('hire_timeline'),
        platform:      g('platform'),
        campaign_name: g('campaign_name'),
        created_time:  g('created_time'),
        status:        g('status'),
        processed_at:  g('processed_at'),
        email_sent:    g('email_sent'),
        brevo_added:   g('brevo_added'),
      }
    })
}

// ─── Build fetch URL ─────────────────────────────────────────────────────────
function buildUrl(raw) {
  const s = raw.trim()
  const t = Date.now()

  // Apps Script Web App URL (recommended — truly live, no caching)
  if (s.includes('script.google.com')) {
    return s + (s.includes('?') ? '&' : '?') + `t=${t}`
  }

  // "Publish to web" CSV link
  if (s.includes('/pub?')) {
    const base = s.includes('output=csv') ? s : `${s}&output=csv`
    return `${base}&t=${t}`
  }

  // Any regular /spreadsheets/d/{id}/ URL → gviz (less cached than /export)
  const m = s.match(/\/spreadsheets\/d\/(?!e\/)([a-zA-Z0-9_-]{15,})/)
  if (m) return `https://docs.google.com/spreadsheets/d/${m[1]}/gviz/tq?tqx=out:csv&sheet=Sheet1&t=${t}`

  // Bare sheet ID
  if (/^[a-zA-Z0-9_-]{15,}$/.test(s))
    return `https://docs.google.com/spreadsheets/d/${s}/gviz/tq?tqx=out:csv&sheet=Sheet1&t=${t}`

  throw new Error('Paste your Apps Script Web App URL or a Google Sheets share link.')
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useGoogleSheets({ sheetUrl, refreshInterval = 30_000 }) {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [connected, setConnected]     = useState(false)
  const [newRowIds, setNewRowIds]     = useState(new Set())
  const prevCount = useRef(0)

  const fetchData = useCallback(async () => {
    if (!sheetUrl) { setLoading(false); return }

    let url
    try { url = buildUrl(sheetUrl) }
    catch (e) { setError(e.message); setLoading(false); return }

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status} — check sharing / deployment settings.`)

      let rows
      const isAppsScript = sheetUrl.includes('script.google.com')

      if (isAppsScript) {
        // Apps Script returns a 2-D JSON array
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        rows = json  // [[header...], [row...], ...]
      } else {
        const text = await res.text()
        if (text.trim().startsWith('<!'))
          throw new Error('Google returned an error page — check that the sheet is public.')
        rows = parseCsv(text)
      }

      const leads = rowsToLeads(rows)

      // Highlight newly appended rows
      if (prevCount.current > 0 && leads.length > prevCount.current) {
        const ids = new Set()
        for (let i = prevCount.current; i < leads.length; i++) ids.add(leads[i].id)
        setNewRowIds(ids)
        setTimeout(() => setNewRowIds(new Set()), 3000)
      }

      prevCount.current = leads.length
      setData(leads)
      setConnected(true)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [sheetUrl])

  useEffect(() => {
    if (!sheetUrl) { setLoading(false); return }
    fetchData()
    const id = setInterval(fetchData, refreshInterval)
    return () => clearInterval(id)
  }, [fetchData, refreshInterval, sheetUrl])

  return { data, loading, error, lastUpdated, connected, newRowIds, refetch: fetchData }
}
