# Fleet Console — Dashboard & Visualisation

Hey! This is a React-centered dashboard I built, modeled as a real-time fleet monitoring interface for InGen Dynamics' Sentinel Prime AI and Aido Rover platforms. It connects to two live backend services aido-bridge (for rover telemetry over WebSocket) and sentinel-events (for anomaly event data over REST), and displays them together in a unified three-panel interface.

## How to run it

(Do note that you must have Git, Node.js 20 LTS, and Docker installed on your system before you can run these commands)

### A: Run as part of the full stack (recommended)

The easiest way to run fleet-console is via shaun-stack, which brings up all the services together with one command.

1. Clone all the required repos as siblings in the directory that you plan to run the dashboard from.

```bash
git clone https://github.com/ShaunTheSheep25/shaun-stack.git
git clone https://github.com/ShaunTheSheep25/fleet-console.git
git clone https://github.com/ShaunTheSheep25/sentinel-events.git
git clone https://github.com/ShaunTheSheep25/aido-bridge.git
git clone https://github.com/ShaunTheSheep25/aido-telemetry.git
```

2. Enter into shaun-stack and run all the services simultaneously with `make up`.

```bash
git clone https://github.com/ShaunTheSheep25/shaun-stack.git
cd shaun-stack
make up
```

Then, open `http://localhost:3000` in your browser to view the dashboard.

### B: Run standalone in dev mode

1. Clone the repo:

```bash
git clone https://github.com/ShaunTheSheep25/fleet-console.git
cd fleet-console
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

Note: In standalone mode, the telemetry panel will show a "disconnected" banner and the events panel will show an error unless aido-bridge (port 8000) and sentinel-events (port 8003) are also running locally.

## How to test it

To verify the build compiles cleanly with no type errors:

```bash
npm run build
```

To run the linter:

```bash
npm run lint
```

The CI workflow runs both on every push/pull request. There are no Jest/Vitest unit tests at this stage: the components are exercised end-to-end via the running stack.

## Limitations + How I'd fix them

There are a few limitations I've observed while working on this project that I'd like to address:

- The robot list is hard-coded to three Aido Rovers with no per-robot filtering on the telemetry feed: I'd add a real fleet endpoint to aido-bridge that returns active robot IDs dynamically, and pass the selected robot ID as a proper filter so each rover streams its own data
- The `VITE_` environment variables are baked into the bundle at build time, meaning the Docker image is environment-specific and requires a rebuild to point at a different backend. A proper fix would be to serve a small `config.json` from nginx at a known URL and fetch it at app startup, so the same image works across environments without rebuilding
- There is no auto-reconnect on the WebSocket (if the connection drops mid-session, the user sees a yellow banner but has to manually refresh to reconnect). I'd add exponential backoff retry logic to the `useWebSocket` hook
- There are no Vitest unit tests for the custom hooks or components — I'd add tests for the `useWebSocket` hook's cleanup behaviour and the `EventsPanel` error states as a priority