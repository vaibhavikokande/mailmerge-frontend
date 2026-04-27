import React, { useMemo } from 'react'
import {
  Users, UserPlus, Building2, Megaphone, Star, Zap, RefreshCw
} from 'lucide-react'
import StatCard       from './StatCard'
import EngagementChart from './EngagementChart'
import RecentActivity  from './RecentActivity'
import { computeKPIs, getEngagementData } from '../utils/dataUtils'

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-green" />
      Live
    </span>
  )
}

export default function Dashboard({ leads, loading, lastUpdated, connected, refetch }) {
  const kpis         = useMemo(() => computeKPIs(leads),          [leads])
  const chartData    = useMemo(() => getEngagementData(leads, 12), [leads])

  const cards = [
    {
      title: 'Total Leads',
      value: kpis.total,
      icon: Users,
      color: 'bg-blue-600',
      trend: 'All time',
    },
    {
      title: 'New Leads',
      value: kpis.newLeads,
      icon: UserPlus,
      color: 'bg-indigo-500',
      trend: 'Pending review',
    },
    {
      title: 'Unique Companies',
      value: kpis.uniqueCompanies,
      icon: Building2,
      color: 'bg-violet-500',
      trend: 'Distinct accounts',
    },
    {
      title: 'Active Campaigns',
      value: kpis.activeCampaigns,
      icon: Megaphone,
      color: 'bg-amber-500',
      trend: 'Running now',
    },
    {
      title: 'Interested Leads',
      value: kpis.interestedLeads,
      icon: Star,
      color: 'bg-emerald-500',
      trend: 'High intent',
    },
    {
      title: 'Top Platform',
      value: kpis.topPlatform,
      icon: Zap,
      color: 'bg-rose-500',
      sub: 'Most traffic source',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-xl font-bold">Lead Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {lastUpdated
              ? `Last updated ${lastUpdated.toLocaleTimeString()}`
              : 'Connecting to Google Sheets…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {connected && <LiveBadge />}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-[13px] font-medium transition-colors disabled:opacity-40"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Engagement Chart */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-800 font-semibold text-[14px]">Lead Growth</h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Leads over time · simulated from row order</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />New / period
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500" />Cumulative
              </span>
            </div>
          </div>
          <EngagementChart data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-800 font-semibold text-[14px]">Recent Activity</h2>
            <span className="text-[11px] text-slate-400">Last 10 entries</span>
          </div>
          <RecentActivity leads={leads} />
        </div>
      </div>
    </div>
  )
}
