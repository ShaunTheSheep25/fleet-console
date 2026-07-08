import { useEffect, useState } from 'react'
import type { TelemetryMsg, BatteryDataPoint } from '../types'
import { useWebSocket } from '../hooks/useWebSocket'
import { BatteryChart } from './BatteryChart'

interface Props {
  robotId: string
}

export function TelemetryPanel({ robotId }: Props) {
  const [telemetry, setTelemetry] = useState<TelemetryMsg | null>(null)
  const [batteryHistory, setBatteryHistory] = useState<BatteryDataPoint[]>([])

  // Each robot gets its own WS URL — when robotId changes,
  // the hook closes the old socket and opens a new one
  const wsUrl = `ws://localhost:8000/ws/telemetry?robot=${robotId}`
  const { lastMessage, status } = useWebSocket(wsUrl)

  // Parse incoming messages
  useEffect(() => {
    if (!lastMessage) return
    try {
      const data: TelemetryMsg = JSON.parse(lastMessage)
      setTelemetry(data)
      setBatteryHistory(prev => {
        const next = [...prev, { time: Date.now(), value: data.battery }]
        return next.slice(-60)  // keep last 60 data points
      })
    } catch {
      console.error('Failed to parse telemetry message')
    }
  }, [lastMessage])

  // Reset when robot changes
  useEffect(() => {
    setTelemetry(null)
    setBatteryHistory([])
  }, [robotId])

  return (
    <div className="flex-1 p-4 border-b border-gray-700 overflow-auto">
      
      {/* Header + connection status */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Live Telemetry — {robotId}
        </h2>
        <StatusBadge status={status} />
      </div>

      {/* Connection banners */}
      {status === 'disconnected' && (
        <div className="mb-3 px-3 py-2 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-300 text-sm">
          ⚠ Disconnected — showing last known values
        </div>
      )}
      {status === 'error' && (
        <div className="mb-3 px-3 py-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
          ✕ Connection failed — is aido-bridge running?
        </div>
      )}
      {status === 'connecting' && !telemetry && (
        <div className="mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-400 text-sm">
          Connecting…
        </div>
      )}

      {/* Telemetry readouts */}
      {telemetry ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <ReadoutCard label="Position" value={telemetry.position.toFixed(2)} unit="m" />
          <ReadoutCard label="Heading" value={telemetry.heading.toFixed(1)} unit="°" />
          <ReadoutCard
            label="Battery"
            value={telemetry.battery.toFixed(1)}
            unit="%"
            highlight={telemetry.battery < 20 ? 'red' : telemetry.battery < 40 ? 'yellow' : 'green'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['Position X', 'Position Y', 'Heading', 'Battery'].map(label => (
            <div key={label} className="bg-gray-800 rounded-lg p-3 animate-pulse">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <div className="h-6 bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Battery chart */}
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-2">Battery % — last 60 readings</p>
        <BatteryChart data={batteryHistory} />
      </div>

    </div>
  )
}

// Small helper components

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    connected: 'bg-green-900/50 text-green-400 border-green-700',
    connecting: 'bg-gray-700 text-gray-400 border-gray-600',
    disconnected: 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
    error: 'bg-red-900/50 text-red-400 border-red-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${styles[status] ?? styles.connecting}`}>
      {status}
    </span>
  )
}

function ReadoutCard({
  label, value, unit, highlight
}: {
  label: string
  value: string
  unit: string
  highlight?: 'green' | 'yellow' | 'red'
}) {
  const valueColor = highlight === 'red' ? 'text-red-400'
    : highlight === 'yellow' ? 'text-yellow-400'
    : highlight === 'green' ? 'text-green-400'
    : 'text-white'

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-mono font-semibold ${valueColor}`}>
        {value}<span className="text-sm text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  )
}