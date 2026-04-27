import React from 'react'

const SELECT_CLS =
  'bg-[#0F2236] border border-[#1A56A0]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1A56A0] transition-colors cursor-pointer'
const LABEL_CLS = 'block text-gray-400 text-xs mb-1.5 font-medium uppercase tracking-wide'

export default function Filters({ filters, setFilters, services }) {
  const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))
  const clear = () =>
    setFilters({ search: '', status: 'all', platform: 'all', service: 'all', dateFrom: '', dateTo: '' })

  return (
    <div className="bg-[#132C48] border border-[#1A56A0]/20 rounded-2xl p-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className={LABEL_CLS}>Search</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
            </svg>
            <input
              type="text"
              placeholder="Name, email, or company…"
              value={filters.search}
              onChange={e => set('search', e.target.value)}
              className="w-full bg-[#0F2236] border border-[#1A56A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1A56A0] transition-colors"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={LABEL_CLS}>Status</label>
          <select value={filters.status} onChange={e => set('status', e.target.value)} className={SELECT_CLS}>
            <option value="all">All Status</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className={LABEL_CLS}>Platform</label>
          <select value={filters.platform} onChange={e => set('platform', e.target.value)} className={SELECT_CLS}>
            <option value="all">All Platforms</option>
            <option value="fb">Facebook</option>
            <option value="ig">Instagram</option>
          </select>
        </div>

        {/* Service */}
        <div>
          <label className={LABEL_CLS}>Service</label>
          <select value={filters.service} onChange={e => set('service', e.target.value)} className={SELECT_CLS}>
            <option value="all">All Services</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Date from */}
        <div>
          <label className={LABEL_CLS}>From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => set('dateFrom', e.target.value)}
            className={SELECT_CLS}
          />
        </div>

        {/* Date to */}
        <div>
          <label className={LABEL_CLS}>To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => set('dateTo', e.target.value)}
            className={SELECT_CLS}
          />
        </div>

        {/* Clear */}
        <button
          onClick={clear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-[#1A56A0]/20 hover:border-[#1A56A0]/50 transition-colors bg-[#0F2236]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>
    </div>
  )
}
