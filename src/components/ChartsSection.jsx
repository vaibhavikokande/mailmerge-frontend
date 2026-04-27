import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
} from 'recharts'

const CARD = 'bg-[#132C48] border border-[#1A56A0]/20 rounded-2xl p-5'
const GRID_STROKE = '#1A56A0'
const TICK = { fill: '#6B7280', fontSize: 11 }

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0F2236] border border-[#1A56A0]/40 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-gray-400 mb-0.5">{label || payload[0]?.name}</p>
      <p className="text-white font-bold">{payload[0]?.value}</p>
    </div>
  )
}

export default function ChartsSection({ platformData, serviceData, dailyData }) {
  const PIE_COLORS = { Facebook: '#1877F2', Instagram: '#E1306C' }

  const hasData = (arr) => arr.some(d => (d.value ?? d.count ?? 0) > 0)

  const EmptyState = () => (
    <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
      No data yet
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pie — Platform */}
      <div className={CARD}>
        <h3 className="text-white font-semibold mb-1 text-sm">Leads by Platform</h3>
        <p className="text-gray-500 text-xs mb-3">FB vs IG distribution</p>
        {!hasData(platformData) ? <EmptyState /> : (
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={82}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {platformData.map(e => (
                  <Cell key={e.name} fill={PIE_COLORS[e.name] ?? '#1A56A0'} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => <span style={{ color: '#9CA3AF', fontSize: 12 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar — Service */}
      <div className={CARD}>
        <h3 className="text-white font-semibold mb-1 text-sm">Leads by Service</h3>
        <p className="text-gray-500 text-xs mb-3">Top service types</p>
        {!hasData(serviceData) ? <EmptyState /> : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={serviceData} margin={{ top: 4, right: 8, bottom: 36, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} opacity={0.15} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ ...TICK, fontSize: 9 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={TICK} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(26,86,160,0.1)' }} />
              <Bar dataKey="count" fill="#1A56A0" radius={[4, 4, 0, 0]}>
                {serviceData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`hsl(${210 + i * 12}, 70%, ${45 + i * 3}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Area — Daily */}
      <div className={CARD}>
        <h3 className="text-white font-semibold mb-1 text-sm">Leads Last 7 Days</h3>
        <p className="text-gray-500 text-xs mb-3">Daily lead volume trend</p>
        {!hasData(dailyData) ? <EmptyState /> : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={dailyData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1A56A0" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1A56A0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} opacity={0.15} vertical={false} />
              <XAxis dataKey="date" tick={TICK} />
              <YAxis tick={TICK} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#1A56A0', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#lineGrad)"
                dot={{ fill: '#2563EB', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#60A5FA', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
