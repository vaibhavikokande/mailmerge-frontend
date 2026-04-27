import React, { useState } from 'react'
import Sidebar    from './components/Sidebar'
import Dashboard  from './components/Dashboard'
import Contacts   from './components/Contacts'
import Campaigns  from './components/Campaigns'
import Templates  from './components/Templates'
import Analytics  from './components/Analytics'
import Settings   from './components/Settings'
import { useLeadsData } from './hooks/useLeadsData'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-9 h-9 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Fetching leads from Google Sheets…</p>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
      <strong>Connection Error:</strong> {message}
      <br />
      <span className="text-red-500 text-xs mt-1 block">
        Make sure the backend is running: <code>cd backend && npm start</code>
      </span>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const { leads: data, loading, error, lastUpdated, connected, refetch } = useLeadsData()

  function renderPage() {
    // Pages that don't need live data can render immediately
    if (activePage === 'templates') return <Templates />
    if (activePage === 'settings')  return <Settings />

    // Pages that depend on live data
    if (loading && !data.length) return <Spinner />
    if (error   && !data.length) return <ErrorBanner message={error} />

    switch (activePage) {
      case 'dashboard':
        return <Dashboard leads={data} loading={loading} lastUpdated={lastUpdated} connected={connected} refetch={refetch} />
      case 'contacts':
        return <Contacts leads={data} />
      case 'campaigns':
        return <Campaigns leads={data} />
      case 'analytics':
        return <Analytics leads={data} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex-1 ml-60 min-h-screen">
        <main className="max-w-screen-xl mx-auto px-6 py-7">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
