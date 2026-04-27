import React, { useState } from 'react'

function SortIcon({ active, dir }) {
  return (
    <span className={`ml-1 text-xs ${active ? 'text-blue-400' : 'text-gray-600'}`}>
      {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase()
  if (s === 'processed')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Processed
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800/40">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Pending
    </span>
  )
}

function PlatformBadge({ platform }) {
  const p = platform?.toLowerCase()
  if (p === 'fb')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-800/50">FB</span>
  if (p === 'ig')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-900/40 text-pink-300 border border-pink-800/50">IG</span>
  return <span className="text-gray-500 text-xs">{platform || '—'}</span>
}

function fmtDate(str) {
  if (!str) return '—'
  try {
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return str }
}

const COLS = [
  { key: 'full_name',    label: 'Name' },
  { key: 'company_name', label: 'Company' },
  { key: 'work_email',   label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'service',      label: 'Service' },
  { key: 'platform',     label: 'Platform' },
  { key: 'status',       label: 'Status' },
  { key: 'created_time', label: 'Date' },
]

export default function LeadsTable({ data, newRowIds }) {
  const [sort, setSort] = useState({ key: 'created_time', dir: 'desc' })

  const toggleSort = key =>
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))

  const sorted = [...data].sort((a, b) => {
    const av = a[sort.key] ?? ''
    const bv = b[sort.key] ?? ''
    return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  return (
    <div className="bg-[#132C48] border border-[#1A56A0]/20 rounded-2xl overflow-hidden">
      {/* Table header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1A56A0]/20">
        <h2 className="text-white font-semibold text-sm">Live Leads</h2>
        <span className="text-gray-500 text-xs">{data.length} record{data.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1A56A0]/15">
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
                >
                  {col.label}
                  <SortIcon active={sort.key === col.key} dir={sort.dir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A56A0]/10">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-600 py-16 text-sm">
                  No leads match your filters
                </td>
              </tr>
            ) : (
              sorted.map(lead => (
                <tr
                  key={lead.id}
                  className={`hover:bg-[#1A56A0]/10 transition-colors duration-150 ${newRowIds.has(lead.id) ? 'animate-highlight-row' : ''}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap max-w-[160px] truncate">{lead.full_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap max-w-[140px] truncate">{lead.company_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-blue-300 whitespace-nowrap max-w-[180px] truncate">{lead.work_email || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{lead.phone_number || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap max-w-[150px] truncate">{lead.service || '—'}</td>
                  <td className="px-4 py-3"><PlatformBadge platform={lead.platform} /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{fmtDate(lead.created_time)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
