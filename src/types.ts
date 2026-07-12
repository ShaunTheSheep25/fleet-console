export interface Robot {
    id: string
    name: string
    status: "online" | "offline"
}

export interface TelemetryMsg {
    position: number
    battery: number
    heading: number
    timestamp: string
}

export interface AnomalyEvent {
    id: string
    camera_id: string
    event_type: string
    confidence: number
    timestamp: string
}

export type WsStatus = "connecting" | "connected" | "disconnected" | "error"

export interface BatteryDataPoint {
    time: number
    value: number
}
