import { useMemo } from 'react'
import { useEventStream } from '../hooks/useEventStream'
import { METRIC_LABELS, METRIC_TYPES, type MetricEvent, type MetricType } from '../types'

const ACCENT = '#40E0D0'

function MetricCard({ metric, value, unit }: { metric: MetricType; value: number; unit: string }) {
  const pct = metric === 'heap_used_pct' || metric === 'cpu_load_pct' ? value : null

  return (
    <div style={{
      background: '#111',
      border: '1px solid #222',
      borderRadius: 10,
      padding: '16px 20px',
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {METRIC_LABELS[metric]}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>
        {value.toFixed(1)}
        <span style={{ fontSize: 13, color: '#555', marginLeft: 4 }}>{unit}</span>
      </div>
      {pct !== null && (
        <div style={{ marginTop: 8, height: 4, background: '#222', borderRadius: 2 }}>
          <div style={{
            height: '100%',
            width: `${Math.min(pct, 100)}%`,
            background: pct > 80 ? '#ff4d4d' : ACCENT,
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}
    </div>
  )
}

export function MetricsDashboard() {
  const { events, connected } = useEventStream<MetricEvent>(
    'http://localhost:8080/events',
    [...METRIC_TYPES]
  )

  const latest = useMemo(() => {
    const map = new Map<string, MetricEvent>()
    for (const e of events) {
      if (!map.has(e.metric)) map.set(e.metric, e)
    }
    return map
  }, [events])

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: '#0a0a0a', minHeight: '100vh', padding: 32, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: connected ? '#4ade80' : '#ef4444',
          boxShadow: connected ? '0 0 8px #4ade80' : undefined,
        }} />
        <span style={{ fontSize: 13, color: '#555' }}>
          {connected ? 'streaming from localhost:8080' : 'disconnected - start the backend'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
        {METRIC_TYPES.map((metric) => {
          const event = latest.get(metric)
          if (!event) return (
            <div key={metric} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '16px 20px', minWidth: 140 }}>
              <div style={{ fontSize: 11, color: '#333', textTransform: 'uppercase' }}>{METRIC_LABELS[metric]}</div>
              <div style={{ fontSize: 28, color: '#222', marginTop: 6 }}>--</div>
            </div>
          )
          return <MetricCard key={metric} metric={metric} value={event.value} unit={event.unit} />
        })}
      </div>

      <div style={{ fontSize: 12, color: '#444', marginBottom: 12 }}>Event log</div>
      <div style={{
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
        borderRadius: 8,
        maxHeight: 400,
        overflowY: 'auto',
      }}>
        {events.length === 0 ? (
          <div style={{ padding: 20, color: '#333' }}>Waiting for events...</div>
        ) : events.map((event) => (
          <div key={event.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '6px 16px',
            borderBottom: '1px solid #111',
            fontSize: 12,
          }}>
            <span style={{ color: '#333', minWidth: 80 }}>
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
            <span style={{ color: ACCENT, minWidth: 130 }}>{event.metric}</span>
            <span style={{ color: '#eee', fontVariantNumeric: 'tabular-nums' }}>
              {event.value.toFixed(2)} {event.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
