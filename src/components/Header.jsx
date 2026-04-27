import React from 'react'

export default function Header({ connected, lastUpdated, onReconfigure }) {
  return (
    <header className="bg-[#132C48] border-b border-[#1A56A0]/30 px-4 md:px-6 py-3 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A56A0] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-none tracking-tight">Lead Dashboard</h1>
            <p className="text-blue-400 text-xs mt-0.5 font-medium">Real-time · Google Sheets</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="hidden sm:block text-gray-500 text-xs">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          {/* Live indicator */}
          <div className="flex items-center gap-2 bg-[#0F2236] border border-[#1A56A0]/30 rounded-full px-3 py-1.5">
            <span
              className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse-green' : 'bg-red-500'}`}
            />
            <span className={`text-xs font-semibold ${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>

          {onReconfigure && (
            <button
              onClick={onReconfigure}
              title="Reconfigure"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
