import { useEffect, useRef, useState } from 'react'

export function useEventStream<T>(url: string, eventTypes: string[]) {
  const [events, setEvents] = useState<T[]>([])
  const [connected, setConnected] = useState(false)
  const sourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const source = new EventSource(url)
    sourceRef.current = source

    source.onopen = () => setConnected(true)
    source.onerror = () => setConnected(false)

    const handlers = eventTypes.map((type) => {
      const handler = (e: MessageEvent) => {
        const parsed = JSON.parse(e.data) as T
        setEvents((prev) => [parsed, ...prev].slice(0, 200))
      }
      source.addEventListener(type, handler)
      return { type, handler }
    })

    return () => {
      handlers.forEach(({ type, handler }) =>
        source.removeEventListener(type, handler)
      )
      source.close()
      setConnected(false)
    }
  }, [url])

  return { events, connected }
}
