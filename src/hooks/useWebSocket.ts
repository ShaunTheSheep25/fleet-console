import { useEffect, useRef, useState } from 'react'
import type { WsStatus } from '../types'

interface UseWebSocketResult {
  lastMessage: string | null
  status: WsStatus
}

export function useWebSocket(url: string): UseWebSocketResult {
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<WsStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    setStatus('connecting')
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setStatus('connected')
    ws.onmessage = (e) => setLastMessage(e.data)
    ws.onerror = () => setStatus('error')
    ws.onclose = () => setStatus('disconnected')

    // Cleanup: close the socket when the component unmounts
    // or when the url changes (i.e. different robot selected)
    return () => {
      ws.close()
    }
  }, [url])  // re-runs if url changes

  return { lastMessage, status }
}