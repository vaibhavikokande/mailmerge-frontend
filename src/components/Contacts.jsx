import React, { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { filterData } from '../utils/dataUtils'
import { sendLeadEmail } from '../utils/emailService'

const PAGE_SIZE = 15

const STATUS_COLORS = {
  new:              'bg-blue-100 text-blue-700 border-blue-200',
  interested:       'bg-emerald-100 text-emerald-700 border-emerald-200',
  converted:        'bg-purple-100 text-purple-700 border-purple-200',
  'follow-up':      'bg-amber-100 text-amber-700 border-amber-200',
  'not interested': 'bg-red-100 text-red-700 border-red-200',
}

function statusClass(status) {
  return STATUS_COLORS[status?.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200'
}

function SendEmailBtn({ lead, onSent }) {
  const [state, setState] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  const alreadySent = lead.email_sent?.toLowerCase() === 'yes' ||
                      lead.status?.toLowerCase() === 'sent'
  const noEmail     = !lead.work_email

  if (alreadySent) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
        Sent
      </span>
    )
  }

  const handleSend = async () => {
    if (state === 'sending') return
    setState('sending')
    try {
      await sendLeadEmail(lead)
      setState('sent')
      onSent(lead.work_email)
    } catch (err) {
      setState('error')
      setErrMsg(err.message)
      setTimeout(() => setState('idle'), 3500)
    }
  }

  if (state === 'sent') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
        Sent!
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span title={errMsg} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 cursor-help">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Failed
      </span>
    )
  }

  return (
    <button
      onClick={handleSend}
      disabled={noEmail || state === 'sending'}
      title={noEmail ? 'No email address' : `Send email to ${lead.work_email}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150
        ${noEmail
          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white cursor-pointer active:scale-95'
        }`}
    >
      {state === 'sending' ? (
        <>
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Sending…
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Send Email
        </>
      )}
    </button>
  )
}

const COLS = [
  { key: 'full_name',     label: 'Name'           },
  { key: 'work_email',    label: 'Email'          },
  { key: 'phone_number',  label: 'Phone'          },
  { key: 'company_name',  label: 'Company'        },
  { key: 'service',       label: 'Service Needed' },
  { key: 'platform',      label: 'Platform'       },
  { key: 'campaign_name', label: 'Campaign'       },
  { key: 'status',        label: 'Status'         },
  { key: 'send',          label: 'Send Email', noSort: true },
]

export default function Contacts({ leads }) {
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState('full_name')
  const [sortDir, setSortDir]   = useState('asc')
  const [page, setPage]         = useState(1)
  const [sentEmails, setSentEmails] = useState(new Set())
  const [toast, setToast]       = useState(null)

  const filtered = useMemo(() => filterData(leads, search), [leads, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a[sortKey] || '').toLowerCase()
      const bv = (b[sortKey] || '').toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function handleSent(email) {
    setSentEmails(prev => new Set([...prev, email]))
    setToast(`✅ Email sent to ${email}`)
    setTimeout(() => setToast(null), 4000)
  }

  function SortIcon({ col }) {
    if (col !== sortKey) return <ChevronUp size={12} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-blue-600" />
      : <ChevronDown size={12} className="text-blue-600" />
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-xl font-bold">Contacts</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} of {leads.length} leads</p>
        </div>
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, company…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-slate-400 text-slate-800 shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => !col.noSort && handleSort(col.key)}
                    className={`text-left px-4 py-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap select-none
                      ${!col.noSort ? 'cursor-pointer hover:text-slate-800' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {!col.noSort && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={COLS.length} className="text-center py-16 text-slate-400 text-sm">
                    No results found
                  </td>
                </tr>
              )}
              {paginated.map((lead, i) => {
                const justSent = sentEmails.has(lead.work_email)
                return (
                  <tr
                    key={lead.id || i}
                    className={`border-b border-slate-50 transition-colors
                      ${justSent ? 'bg-emerald-50/50' : 'hover:bg-slate-50/70'}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{lead.full_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{lead.work_email || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{lead.phone_number || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lead.company_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{lead.service || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{lead.platform || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{lead.campaign_name || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusClass(lead.status)}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SendEmailBtn
                        lead={{ ...lead, email_sent: justSent ? 'yes' : lead.email_sent }}
                        onSent={handleSent}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-slate-400 text-[12px]">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} className="text-slate-600" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const n = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-medium transition-colors
                    ${n === page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
                  {n}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-colors">
              <ChevronRight size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
