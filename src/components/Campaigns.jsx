import React, { useState, useMemo } from 'react'
import { Plus, Search, ChevronUp, ChevronDown } from 'lucide-react'
import Badge from './ui/Badge'
import Modal from './ui/Modal'

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_VARIANTS = {
  Running:   'green',
  Draft:     'slate',
  Completed: 'blue',
  Paused:    'amber',
}
const STATUSES = ['Running', 'Draft', 'Completed', 'Paused']

// ── Derive campaigns from real leads data ────────────────────────────────────
function buildCampaigns(leads) {
  const map = {}
  leads.forEach((l, i) => {
    const name = l.campaign_name?.trim() || 'Unnamed Campaign'
    if (!map[name]) map[name] = { name, platforms: {}, count: 0, idx: i }
    map[name].count++
    const p = l.platform?.trim() || 'Unknown'
    map[name].platforms[p] = (map[name].platforms[p] || 0) + 1
  })

  const base = new Date('2026-03-01')
  return Object.values(map).map((c, i) => {
    const topPlatform = Object.entries(c.platforms).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    const d = new Date(base)
    d.setDate(d.getDate() + i * 3)
    return {
      id:       i + 1,
      name:     c.name,
      platform: topPlatform,
      status:   STATUSES[i % STATUSES.length],
      leads:    c.count,
      created:  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  })
}

const PLATFORM_LABELS = {
  ig:        'Instagram',
  fb:        'Facebook',
  linkedin:  'LinkedIn',
  google:    'Google Ads',
}
function fmtPlatform(p) {
  return PLATFORM_LABELS[p?.toLowerCase()] || p || '—'
}

// ── Create Campaign Modal Form ────────────────────────────────────────────────
const BLANK = { name: '', platform: 'Instagram', status: 'Draft' }

function CreateModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(BLANK)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    if (!form.name.trim()) return
    onSave({ ...form, id: Date.now(), leads: 0, created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
    setForm(BLANK)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Campaign">
      <div className="space-y-4">
        <div>
          <label className="text-[12px] font-medium text-slate-600 block mb-1">Campaign Name *</label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Spring Outreach 2026"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium text-slate-600 block mb-1">Platform</label>
            <select value={form.platform} onChange={set('platform')} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 bg-white">
              {['Instagram', 'Facebook', 'LinkedIn', 'Google Ads'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-slate-600 block mb-1">Status</label>
            <select value={form.status} onChange={set('status')} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 bg-white">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Campaigns({ leads }) {
  const derived     = useMemo(() => buildCampaigns(leads), [leads])
  const [extra, setExtra] = useState([])
  const all         = useMemo(() => [...derived, ...extra], [derived, extra])

  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [sortKey, setSortKey]     = useState('leads')
  const [sortDir, setSortDir]     = useState('desc')
  const [modalOpen, setModal]     = useState(false)

  const filtered = useMemo(() => {
    let r = all
    if (search) r = r.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== 'all') r = r.filter(c => c.status === filterStatus)
    return [...r].sort((a, b) => {
      const av = typeof a[sortKey] === 'string' ? a[sortKey].toLowerCase() : a[sortKey]
      const bv = typeof b[sortKey] === 'string' ? b[sortKey].toLowerCase() : b[sortKey]
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [all, search, filterStatus, sortKey, sortDir])

  function handleSort(key) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function SortIcon({ col }) {
    if (col !== sortKey) return <ChevronUp size={11} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-blue-500" />
      : <ChevronDown size={11} className="text-blue-500" />
  }

  const COLS = [
    { key: 'name',     label: 'Campaign Name' },
    { key: 'platform', label: 'Platform'      },
    { key: 'status',   label: 'Status'        },
    { key: 'leads',    label: 'Leads'         },
    { key: 'created',  label: 'Created'       },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-xl font-bold">Campaigns</h1>
          <p className="text-slate-400 text-sm mt-0.5">{all.length} campaigns total</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shadow-blue-200 transition-colors"
        >
          <Plus size={15} />
          Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-slate-400 text-slate-800 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1 py-1 shadow-sm">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors capitalize ${filterStatus === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {COLS.map(c => (
                <th key={c.key} onClick={() => handleSort(c.key)}
                  className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 cursor-pointer hover:text-slate-800 select-none whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">{c.label}<SortIcon col={c.key} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-14 text-slate-400 text-sm">No campaigns found</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-slate-500">{fmtPlatform(c.platform)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANTS[c.status] ?? 'slate'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Running' ? 'bg-emerald-500' : c.status === 'Draft' ? 'bg-slate-400' : c.status === 'Completed' ? 'bg-blue-500' : 'bg-amber-500'} mr-0.5`} />
                    {c.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">{c.leads}</td>
                <td className="px-4 py-3 text-slate-400 text-[12px]">{c.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateModal
        open={modalOpen}
        onClose={() => setModal(false)}
        onSave={c => setExtra(prev => [c, ...prev])}
      />
    </div>
  )
}
