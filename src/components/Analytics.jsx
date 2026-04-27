import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Users, TrendingUp, Zap, Megaphone } from 'lucide-react'

// ── Palette ───────────────────────────────────────────────────────────────────
const PLATFORM_COLORS = {
  ig:       '#E1306C',
  fb:       '#1877F2',
  linkedin: '#0A66C2',
  google:   '#4285F4',
}
const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#94a3b8']

// ── Data derivation ───────────────────────────────────────────────────────────
function useDerived(leads) {
  return useMemo(() => {
    const total = leads.length

    // Platform breakdown
    const platMap = {}
    leads.forEach(l => {
      const p = l.platform?.trim() || 'Unknown'
      platMap[p] = (platMap[p] || 0) + 1
    })
    const platformData = Object.entries(platMap)
      .map(([name, count]) => ({ name, count, fill: PLATFORM_COLORS[name.toLowerCase()] || '#94a3b8' }))
      .sort((a, b) => b.count - a.count)

    // Status breakdown
    const statMap = {}
    leads.forEach(l => {
      const s = l.status?.trim() || 'New'
      statMap[s] = (statMap[s] || 0) + 1
    })
    const statusData = Object.entries(statMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Campaign performance
    const campMap = {}
    leads.forEach(l => {
      const c = l.campaign_name?.trim() || 'Unknown'
      campMap[c] = (campMap[c] || 0) + 1
    })
    const campaignData = Object.entries(campMap)
      .map(([name, leads]) => ({
        name: name.length > 22 ? name.slice(0, 22) + '…' : name,
        leads,
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 8)

    const interested   = leads.filter(l => l.status?.toLowerCase().includes('interest')).length
    const conversion   = total ? ((interested / total) * 100).toFixed(1) : '0.0'
    const topPlatform  = platformData[0]?.name || '—'
    const activeCamps  = new Set(leads.map(l => l.campaign_name?.trim()).filter(Boolean)).size

    return { total, platformData, statusData, campaignData, conversion, topPlatform, activeCamps }
  }, [leads])
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="text-slate-500 text-[11px] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-semibold text-slate-800">
          {p.value} <span className="text-slate-400 font-normal">leads</span>
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="font-semibold text-slate-800">{p.name}</p>
      <p className="text-slate-400 text-[12px]">{p.value} leads ({((p.value / p.payload.total) * 100).toFixed(1)}%)</p>
    </div>
  )
}

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-slate-900 text-2xl font-bold leading-none mt-0.5">{value}</p>
        {sub && <p className="text-slate-400 text-[11px] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Custom Pie Label ──────────────────────────────────────────────────────────
const RADIAN = Math.PI / 180
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5
  const x  = cx + r * Math.cos(-midAngle * RADIAN)
  const y  = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Analytics({ leads }) {
  const { total, platformData, statusData, campaignData, conversion, topPlatform, activeCamps } = useDerived(leads)

  // Attach total to each status entry for tooltip % calculation
  const statusWithTotal = useMemo(
    () => statusData.map(d => ({ ...d, total })),
    [statusData, total]
  )

  const metrics = [
    { title: 'Total Leads',      value: total,          sub: 'All time',       icon: Users,     color: 'bg-blue-600'   },
    { title: 'Conversion Rate',  value: `${conversion}%`, sub: 'Interested / Total', icon: TrendingUp, color: 'bg-emerald-500' },
    { title: 'Top Platform',     value: topPlatform,    sub: 'Most traffic',   icon: Zap,       color: 'bg-rose-500'   },
    { title: 'Active Campaigns', value: activeCamps,    sub: 'Unique campaigns', icon: Megaphone, color: 'bg-amber-500'  },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 text-xl font-bold">Analytics</h1>
        <p className="text-slate-400 text-sm mt-0.5">Insights from your live lead data</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => <MetricCard key={m.title} {...m} />)}
      </div>

      {/* Chart Row 1 — Platform + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Platform Bar Chart */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-slate-800 font-semibold text-[14px] mb-1">Leads per Platform</h2>
          <p className="text-slate-400 text-[11px] mb-4">Distribution by traffic source</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {platformData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-slate-800 font-semibold text-[14px] mb-1">Leads by Status</h2>
          <p className="text-slate-400 text-[11px] mb-2">Current pipeline breakdown</p>
          {statusWithTotal.length === 0
            ? <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data</div>
            : (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={statusWithTotal}
                    cx="50%"
                    cy="45%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {statusWithTotal.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={v => <span style={{ color: '#64748b', fontSize: 11 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* Chart Row 2 — Campaign Performance */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-slate-800 font-semibold text-[14px] mb-1">Campaign Performance</h2>
        <p className="text-slate-400 text-[11px] mb-4">Leads generated per campaign (top 8)</p>
        {campaignData.length === 0
          ? <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data</div>
          : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={campaignData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="leads" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>
    </div>
  )
}
