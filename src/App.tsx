import { useState } from 'react'
import { ROBOTS } from './data/robots'

function App() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(ROBOTS[0].id)

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold text-white">Fleet Console</h1>
          <p className="text-xs text-gray-400">InGen Dynamics</p>
        </div>
        <p className="p-4 text-gray-400 text-sm">Sidebar goes here</p>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Telemetry panel - top half */}
        <div className="flex-1 p-4 border-b border-gray-700 overflow-auto">
          <p className="text-gray-400 text-sm">Telemetry panel goes here — selected: {selectedRobotId}</p>
        </div>

        {/* Events panel - bottom half */}
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-gray-400 text-sm">Events panel goes here</p>
        </div>

      </div>
    </div>
  )
}

export default App