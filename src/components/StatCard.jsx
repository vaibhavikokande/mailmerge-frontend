import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, icon: Icon, color, trend, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{title}</p>
          <p className="text-slate-900 text-2xl font-bold mt-1 leading-none">{value}</p>
          {sub && <p className="text-slate-400 text-[11px] mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600 text-[12px] font-medium">
          <TrendingUp size={13} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}
