# reactive-fullstack-demo

A real-time JVM metrics dashboard built with Kotlin Flow + SSE on the backend and React on the frontend. Written as a companion to the blog post: [Kotlin Flow: Reactive Full-Stack Streaming](https://cavanpage.com/blog/kotlin-flow-reactive-fullstack/)

## What it does

The backend streams live JVM metrics (heap usage, CPU load, thread count, GC pauses) every second via Server-Sent Events. The frontend displays them as a live dashboard with connection status, metric cards with progress bars, and a scrolling event log.

## Prerequisites

- **JDK 21+** for the backend
- **Node.js 18+** for the frontend

## Getting started

You need two terminals: one for the backend, one for the frontend.

### 1. Start the backend

```bash
cd backend
./gradlew run
```

The server starts on [http://localhost:8080](http://localhost:8080). You can verify it's working:

```bash
curl http://localhost:8080/events
```

You should see a stream of JSON metric events in your terminal.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see the metrics dashboard connect and begin updating live.

## Project structure

```
├── backend/               # Kotlin/Ktor server
│   └── src/main/kotlin/
│       ├── Main.kt        # Server setup and /events SSE endpoint
│       ├── EventBus.kt    # Shared flow with replay buffer
│       ├── JvmMetricFlow.kt  # JMX metric collection
│       └── MetricEvent.kt # Data model
│
└── frontend/              # React/TypeScript frontend (Vite)
    └── src/
        ├── App.tsx
        ├── components/MetricsDashboard.tsx  # Main UI
        ├── hooks/useEventStream.ts          # SSE hook
        └── types.ts
```

## Ports

| Service  | URL                          |
|----------|------------------------------|
| Backend  | http://localhost:8080/events |
| Frontend | http://localhost:5173        |
