import React from 'react'

const STATUS_COLORS = {
  new:         'bg-blue-100 text-blue-700',
  interested:  'bg-emerald-100 text-emerald-700',
  converted:   'bg-purple-100 text-purple-700',
  'follow-up': 'bg-amber-100 text-amber-700',
  'not interested': 'bg-red-100 text-red-700',
}

function statusColor(status) {
  return STATUS_COLORS[status?.toLowerCase()] || 'bg-slate-100 text-slate-600'
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500',
  'bg-teal-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500',
]

export default function RecentActivity({ leads }) {
  const recent = [...(leads || [])].reverse().slice(0, 10)

  return (
    <div className="flex flex-col gap-1">
      {recent.length === 0 && (
        <p className="text-slate-400 text-sm text-center py-8">No leads yet</p>
      )}
      {recent.map((lead, i) => (
        <div
          key={lead.id || i}
          className="flex items-center gap-3 px-1 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0`}>
            {initials(lead.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 text-[13px] font-semibold truncate">{lead.full_name || '—'}</p>
            <p className="text-slate-400 text-[11px] truncate">{lead.company_name || 'Unknown company'}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(lead.status)}`}>
              {lead.status || 'New'}
            </span>
            <span className="text-slate-300 text-[10px]">#{lead.id?.replace('row-', '') || i + 1}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
