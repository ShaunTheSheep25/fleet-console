import type { Robot } from '../types'

interface Props {
  robots: Robot[]
  selectedId: string
  onSelect: (id: string) => void
}

export function Sidebar({ robots, selectedId, onSelect }: Props) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold text-white">Fleet Console</h1>
        <p className="text-xs text-gray-400">InGen Dynamics</p>
      </div>

      {/* Robot list */}
      <div className="p-3 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">Robots</p>
        {robots.map(robot => (
          <button
            key={robot.id}
            onClick={() => onSelect(robot.id)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
              selectedId === robot.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Status dot */}
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                robot.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
              }`} />
              <div>
                <p className="text-sm font-medium">{robot.name}</p>
                <p className={`text-xs ${
                  robot.status === 'online' ? 'text-green-400' : 'text-gray-500'
                }`}>
                  {robot.status}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}