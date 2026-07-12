# Fleet Console — Design Notes

## 1. State Management Approach

I used React's `useState` and `useEffect` throughout rather than a global store like Zustand or Redux. The only shared state in the app is `selectedRobotId`, which is owned by the app and passed down two levels via props to `Sidebar` and `TelemetryPanel`. Everything else (telemetry data, battery history, anomaly events, and WebSocket connection status) is local to the panel that uses it.

A global store solves the problem of sharing state between components that are far apart in the component tree without prop drilling. This app doesn't have that problem: the deepest prop chain is two levels, and no two sibling panels need to read each other's data. Adding Zustand or Redux here would require more files + boilerplate, so to avoid unnecessary complications I just stuck with `useSate` and `useEffect`.

## 2. WebSocket Lifecycle

Live telemetry is handled by a custom `useWebSocket` hook rather than inline in `TelemetryPanel`. The hook owns the WebSocket object in a `useRef` and manages the open/message/error/close event handlers, exposing only `lastMessage` and `status` to the component.

The critical detail is the `useEffect` cleanup function: `ws.close()` runs when the component unmounts or when the URL changes (i.e. when a different robot is selected from the sidebar). Without this cleanup, switching between robots would leave the old socket open and still firing `onmessage` events, causing the UI to update twice per message and the battery chart to receive data from the wrong robot. Getting this wrong was one of the hardest bugs of the week to diagnose because the symptom looked like a rendering issue rather than a stale connection issue.

The WebSocket URL includes the robot ID as a query parameter (`ws://localhost:8000/ws/telemetry?robot=rover-001`) so that the `useEffect` dependency array correctly detects a robot change and re-runs, closing the old socket and opening a new one.

## 3. Error Handling

Every async data source in the app has three explicit UI states beyond the happy path:

- **Connecting/loading** — skeleton pulse animation using Tailwind's `animate-pulse`, giving the user a clear signal that data is expected rather than absent
- **Error** — red banner with a human-readable message and a diagnostic hint (e.g. "is aido-bridge running?") so a developer can act on it immediately
- **Disconnected** — yellow banner on the telemetry panel; last known values remain visible rather than disappearing, because stale data is more useful than a blank panel

The reason why I implemeted like this is because a user staring at empty boxes has no way to know whether the service is down, the data hasn't arrived yet, or the UI has a bug. Here, every possible failure mode is named explicitly, enabling the user to remedy the issue faster.

For the events panel, there is also a fourth state, "empty but healthy", which shows "No events yet - run the simulator to generate some" rather than nothing. This distinguishes "connected but idle" from "failed to connect", which would otherwise look identical.

## 4. Component Boundaries

The component tree is structured as follows:

App                          # owns selectedRobotId, renders layout
├── Sidebar                  # robot list, selection, status dots
└── MainContent (inline)
├── TelemetryPanel           # WebSocket connection, telemetry readouts, battery chart
│   └── BatteryChart         # Recharts line chart, receives batteryHistory as props
└── EventsPanel              # REST polling, anomaly event list

`TelemetryPanel` owns its own WebSocket connection rather than lifting it to the app. The alternative (connecting at the app level and passing telemetry data down as props) would mean that the App is managing connection state for a panel it has no other reason to know about. Each panel is responsible for its own data fetching, which makes them independently testable and replaceable.

`BatteryChart` is a separate component from `TelemetryPanel` because it has a distinct props interface (`BatteryDataPoint[]`) and could be reused in a future summary view. Keeping the Recharts rendering logic out of the data-fetching component also makes both easier to read in isolation.

## 5. Lighthouse

Scores: Performance = 99 / Accessibility = 93 / Best Practices = 100

All three scores exceeded the 90+ threshold without any targeted optimisation, which reflects the simplicity of the app's architecture - a single HTML entry point, minimal dependencies, no heavy framework overhead, and CSS handled entirely by Tailwind's utility classes.

### What should I have changed to get 100 on Accessibility?:

- I would add `aria-label` attributes to the robot selection buttons in the sidebar. They are `<button>` elements with only visual content, which screen readers cannot describe without an explicit label
- Add a descriptive `<title>` element to `index.html` beyond the Vite default
- Verify colour contrast on `text-gray-400` against `bg-gray-900` for small text elements such as the "online" / "offline" status labels

### Why Performance scored 99 and not 100:

The single deduction is likely the Recharts bundle, which is the largest chunk in the build. Dynamic importing the BatteryChart component or switching to a lighter library like uPlot would likely push this to 100, but the trade-off in development complexity is
not justified for a dashboard of this scale.