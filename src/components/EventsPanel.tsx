import { useEffect, useState } from 'react'
import type { AnomalyEvent } from '../types'

const SENTINEL_URL = 'http://localhost:8003'

export function EventsPanel() {
  const [events, setEvents] = useState<AnomalyEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${SENTINEL_URL}/events?limit=10`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setEvents(data)
        setError(null)
      } catch (e) {
        setError('Could not reach sentinel-events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()                              // run immediately
    const id = setInterval(fetchEvents, 3000)  // then every 3s
    return () => clearInterval(id)             // cleanup
  }, [])

  return (
    <div className="flex-1 p-4 overflow-auto">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
        Recent Anomaly Events
      </h2>

      {/* Error state */}
      {error && (
        <div className="px-3 py-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm mb-3">
          ✕ {error} — is sentinel-events running?
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 animate-pulse h-14" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No events yet — run the simulator to generate some
        </div>
      )}

      {/* Event list */}
      {events.map(event => (
        <div key={event.id} className="bg-gray-800 rounded-lg p-3 mb-2 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium text-white">{event.event_type}</span>
              <span className="text-xs text-gray-400">cam: {event.camera_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <ConfidenceBadge confidence={event.confidence} />
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = pct >= 80 ? 'text-red-400 bg-red-900/40 border-red-800'
    : pct >= 50 ? 'text-yellow-400 bg-yellow-900/40 border-yellow-800'
    : 'text-gray-400 bg-gray-700 border-gray-600'
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border ${color}`}>
      {pct}% confidence
    </span>
  )
}