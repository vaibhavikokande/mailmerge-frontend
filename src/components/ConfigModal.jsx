import React, { useState } from 'react'

const APPS_SCRIPT_CODE = `function doGet() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Sheet1');
  const values = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify(values))
    .setMimeType(ContentService.MimeType.JSON);
}`

const STEPS = [
  { label: 'Open your Google Sheet → click Extensions → Apps Script' },
  { label: 'Delete any existing code and paste the code shown below' },
  { label: 'Click Deploy → New deployment → Web app' },
  { label: 'Set "Execute as" → Me  ·  "Who has access" → Anyone' },
  { label: 'Click Deploy, copy the Web app URL, and paste it below' },
]

export default function ConfigModal({ onSave, initialValues }) {
  const [url, setUrl]         = useState(initialValues?.sheetUrl ?? '')
  const [copied, setCopied]   = useState(false)
  const [err, setErr]         = useState('')

  const copyCode = async () => {
    await navigator.clipboard.writeText(APPS_SCRIPT_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (!url.trim()) { setErr('Please paste your Web App URL.'); return }
    setErr('')
    onSave({ sheetUrl: url.trim() })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#132C48] border border-[#1A56A0]/40 rounded-2xl p-7 w-full max-w-xl shadow-2xl my-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 bg-[#1A56A0] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Connect Google Sheets (Live)</h2>
            <p className="text-gray-400 text-sm mt-0.5">One-time setup · refreshes instantly</p>
          </div>
        </div>

        {/* Steps */}
        <ol className="space-y-2 mb-5">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#1A56A0] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-300 text-sm">{s.label}</span>
            </li>
          ))}
        </ol>

        {/* Code block */}
        <div className="relative bg-[#0A1929] border border-[#1A56A0]/30 rounded-xl mb-5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A56A0]/20">
            <span className="text-gray-500 text-xs font-mono">Apps Script · Code.gs</span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#1A56A0]/30 hover:bg-[#1A56A0]/60 text-blue-300 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy code
                </>
              )}
            </button>
          </div>
          <pre className="text-green-300 text-xs font-mono px-4 py-3 overflow-x-auto leading-relaxed">
{APPS_SCRIPT_CODE}
          </pre>
        </div>

        {/* URL input */}
        <div className="mb-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Paste your Web App URL
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/…/exec"
            className="w-full bg-[#0F2236] border border-[#1A56A0]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1A56A0] transition-colors"
          />
        </div>

        {/* Fallback note */}
        <p className="text-gray-600 text-xs mb-4">
          Also accepts a regular Google Sheets share link — but may have a small delay due to Google caching.
        </p>

        {err && (
          <p className="mb-4 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-[#1A56A0] hover:bg-[#2563EB] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all duration-150 shadow-lg"
        >
          Connect Live Dashboard →
        </button>

        <p className="text-center text-gray-600 text-xs mt-4">
          URL is stored only in your browser's localStorage.
        </p>
      </div>
    </div>
  )
}
