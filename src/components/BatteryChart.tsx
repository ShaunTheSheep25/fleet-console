import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { BatteryDataPoint } from '../types'

interface Props {
  data: BatteryDataPoint[]
}

export function BatteryChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-gray-500 text-sm">
        Waiting for data…
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={96}>
      <LineChart data={data}>
        <YAxis domain={[0, 100]} width={30} tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '6px' }}
          labelFormatter={() => 'Battery %'}
          formatter={(val: number) => [`${val.toFixed(1)}%`, '']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#22c55e"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}