'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { fmtShortDate } from '@/lib/utils/formatters'
import { calcRollingAverage } from '@/lib/utils/statsCalc'
import type { GameLogEntry } from '@/types'

interface StatTrendChartProps {
  data: GameLogEntry[]
  stat?: keyof Pick<GameLogEntry, 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'to'>
  label?: string
  color?: string
}

export function StatTrendChart({
  data,
  stat = 'pts',
  label = 'Points',
  color = '#f97316',
}: StatTrendChartProps) {
  const [rollingWindow, setRollingWindow] = useState<5 | 10 | null>(5)

  const rollingData = calcRollingAverage(data, stat, rollingWindow ?? 5)
  const chartData = rollingData
    .slice(-20)
    .map((d) => ({
      date:    fmtShortDate(d.date),
      value:   d.value,
      rolling: rollingWindow ? (d.rolling != null ? +d.rolling.toFixed(1) : null) : null,
    }))

  const avg = chartData.length
    ? chartData.reduce((s, d) => s + d.value, 0) / chartData.length
    : 0

  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {label} — Last {chartData.length} Games
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Avg: <span className="font-semibold text-hoop-orange">{avg.toFixed(1)}</span>
          </span>
          <div className="flex items-center gap-1 ml-2">
            {([null, 5, 10] as const).map((w) => (
              <button
                key={String(w)}
                onClick={() => setRollingWindow(w)}
                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
                  rollingWindow === w
                    ? 'bg-hoop-orange text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {w == null ? 'Off' : `${w}G`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d0d1a',
              border: '1px solid #1c1c30',
              borderRadius: '8px',
              fontSize: 12,
              color: '#f8fafc',
            }}
            formatter={(v: number, name: string) => [v, name === 'rolling' ? `${rollingWindow}G Avg` : label]}
          />
          <ReferenceLine y={avg} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            strokeOpacity={0.7}
            name={label}
          />
          {rollingWindow && (
            <Line
              type="monotone"
              dataKey="rolling"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }}
              connectNulls
              name="rolling"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ShootingChartProps {
  fgPct?: number
  fg3Pct?: number
  ftPct?: number
  tsPct?: number
  efgPct?: number
}

export function ShootingChart({ fgPct, fg3Pct, ftPct, tsPct, efgPct }: ShootingChartProps) {
  const data = [
    { label: 'FG%',  value: fgPct  ? fgPct  * 100 : 0, fill: '#f97316' },
    { label: '3P%',  value: fg3Pct ? fg3Pct * 100 : 0, fill: '#fb923c' },
    { label: 'FT%',  value: ftPct  ? ftPct  * 100 : 0, fill: '#fdba74' },
    { label: 'TS%',  value: tsPct  ? tsPct  * 100 : 0, fill: '#60a5fa' },
    { label: 'eFG%', value: efgPct ? efgPct * 100 : 0, fill: '#a78bfa' },
  ].filter((d) => d.value > 0)

  if (data.length === 0) return null

  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Shooting Splits</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-semibold tabular-nums">{d.value.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-hoop-dark-border overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(d.value, 100)}%`, backgroundColor: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
