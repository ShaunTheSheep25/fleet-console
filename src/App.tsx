import { useState } from 'react'
import { ROBOTS } from './data/robots'
import { Sidebar } from './components/Sidebar'
import { TelemetryPanel } from './components/TelemetryPanel'
import { EventsPanel } from './components/EventsPanel'

function App() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(ROBOTS[0].id)

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar robots={ROBOTS} selectedId={selectedRobotId} onSelect={setSelectedRobotId} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TelemetryPanel robotId={selectedRobotId} />
        <EventsPanel />
      </div>
    </div>
  )
}

export default App