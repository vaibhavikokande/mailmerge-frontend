import React, { useState } from 'react'
import { sendLeadEmail } from '../utils/emailService'

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

function SendEmailBtn({ lead, onSent }) {
  const [state, setState] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  const alreadySent = lead.email_sent?.toLowerCase() === 'yes'
  const noEmail     = !lead.work_email

  if (alreadySent) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-800/40 cursor-default">
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
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-800/40">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
        Sent!
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span title={errMsg} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-800/40 cursor-help">
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
      title={noEmail ? 'No email address' : `Send to ${lead.work_email}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150
        ${noEmail
          ? 'bg-gray-800/30 text-gray-600 border-gray-700/20 cursor-not-allowed'
          : 'bg-[#1A56A0]/20 text-blue-300 border-[#1A56A0]/40 hover:bg-[#1A56A0]/50 hover:text-white cursor-pointer active:scale-95'
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
          Send
        </>
      )}
    </button>
  )
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
  { key: 'email_sent',   label: 'Send Email', noSort: true },
]

export default function LeadsTable({ data, newRowIds }) {
  const [sort, setSort]           = useState({ key: 'created_time', dir: 'desc' })
  const [sentEmails, setSentEmails] = useState(new Set())
  const [toast, setToast]         = useState(null)

  const toggleSort = key =>
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))

  const handleSent = (email) => {
    setSentEmails(prev => new Set([...prev, email]))
    setToast(`Email sent to ${email}`)
    setTimeout(() => setToast(null), 4000)
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sort.key] ?? ''
    const bv = b[sort.key] ?? ''
    return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  return (
    <div className="bg-[#132C48] border border-[#1A56A0]/20 rounded-2xl overflow-hidden relative">

      {/* Toast notification */}
      {toast && (
        <div className="absolute top-3 right-3 z-50 flex items-center gap-2 bg-green-900/90 border border-green-700 text-green-300 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
          ✅ {toast}
        </div>
      )}

      {/* Header */}
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
                  onClick={() => !col.noSort && toggleSort(col.key)}
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none whitespace-nowrap
                    ${!col.noSort ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                >
                  {col.label}
                  {!col.noSort && <SortIcon active={sort.key === col.key} dir={sort.dir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A56A0]/10">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-600 py-16 text-sm">
                  No leads match your filters
                </td>
              </tr>
            ) : (
              sorted.map(lead => {
                const justSent = sentEmails.has(lead.work_email)
                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-[#1A56A0]/10 transition-colors duration-150
                      ${newRowIds.has(lead.id) ? 'animate-highlight-row' : ''}
                      ${justSent ? 'bg-green-900/10' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap max-w-[160px] truncate">{lead.full_name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap max-w-[140px] truncate">{lead.company_name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-blue-300 whitespace-nowrap max-w-[180px] truncate">{lead.work_email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{lead.phone_number || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap max-w-[150px] truncate">{lead.service || '—'}</td>
                    <td className="px-4 py-3"><PlatformBadge platform={lead.platform} /></td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{fmtDate(lead.created_time)}</td>
                    <td className="px-4 py-3">
                      <SendEmailBtn
                        lead={{ ...lead, email_sent: justSent ? 'yes' : lead.email_sent }}
                        onSent={handleSent}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
