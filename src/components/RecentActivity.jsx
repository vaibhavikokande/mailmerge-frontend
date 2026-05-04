import React, { useState } from 'react'
import { sendLeadEmail } from '../utils/emailService'

const STATUS_COLORS = {
  new:         'bg-blue-100 text-blue-700',
  interested:  'bg-emerald-100 text-emerald-700',
  converted:   'bg-purple-100 text-purple-700',
  'follow-up': 'bg-amber-100 text-amber-700',
  'not interested': 'bg-red-100 text-red-700',
  sent:        'bg-emerald-100 text-emerald-700',
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

function SendBtn({ lead, onSent }) {
  const [state, setState] = useState('idle')

  const alreadySent = lead.email_sent?.toLowerCase() === 'yes' ||
                      lead.status?.toLowerCase() === 'sent'
  const noEmail = !lead.work_email

  if (alreadySent) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
        Sent
      </span>
    )
  }

  if (state === 'sent') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
        Sent!
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-500 border border-red-200">
        Failed
      </span>
    )
  }

  const handleSend = async () => {
    if (state === 'sending' || noEmail) return
    setState('sending')
    try {
      await sendLeadEmail(lead)
      setState('sent')
      onSent(lead.work_email)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={noEmail || state === 'sending'}
      title={noEmail ? 'No email address' : `Send to ${lead.work_email}`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all
        ${noEmail
          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white cursor-pointer'
        }`}
    >
      {state === 'sending' ? (
        <>
          <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Sending…
        </>
      ) : (
        <>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Send
        </>
      )}
    </button>
  )
}

export default function RecentActivity({ leads }) {
  const [sentEmails, setSentEmails] = useState(new Set())
  const [toast, setToast] = useState(null)

  const recent = [...(leads || [])].reverse().slice(0, 10)

  function handleSent(email) {
    setSentEmails(prev => new Set([...prev, email]))
    setToast(`Email sent to ${email}`)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="flex flex-col gap-1 relative">

      {/* Toast */}
      {toast && (
        <div className="absolute -top-2 left-0 right-0 z-10 flex items-center gap-2 bg-emerald-600 text-white text-[11px] font-medium px-3 py-2 rounded-lg shadow-lg">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
          {toast}
        </div>
      )}

      {recent.length === 0 && (
        <p className="text-slate-400 text-sm text-center py-8">No leads yet</p>
      )}

      {recent.map((lead, i) => {
        const justSent = sentEmails.has(lead.work_email)
        return (
          <div
            key={lead.id || i}
            className={`flex items-center gap-3 px-1 py-2.5 rounded-lg transition-colors
              ${justSent ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
          >
            <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0`}>
              {initials(lead.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-[13px] font-semibold truncate">{lead.full_name || '—'}</p>
              <p className="text-slate-400 text-[11px] truncate">{lead.company_name || 'Unknown company'}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(justSent ? 'sent' : lead.status)}`}>
                {justSent ? 'Sent' : (lead.status || 'New')}
              </span>
              <SendBtn
                lead={{ ...lead, email_sent: justSent ? 'yes' : lead.email_sent }}
                onSent={handleSent}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
