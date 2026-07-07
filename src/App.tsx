import { useState } from 'react'
import { ROBOTS } from './data/robots'
import { Sidebar } from './components/Sidebar'

function App() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(ROBOTS[0].id)

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      
      <Sidebar
        robots={ROBOTS}
        selectedId={selectedRobotId}
        onSelect={setSelectedRobotId}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 p-4 border-b border-gray-700 overflow-auto">
          <p className="text-gray-400 text-sm">Telemetry — {selectedRobotId}</p>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-gray-400 text-sm">Events panel</p>
        </div>
      </div>

    </div>
  )
}

export default App