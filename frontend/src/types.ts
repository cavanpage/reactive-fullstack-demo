export interface MetricEvent {
  id: string
  timestamp: number
  metric: string
  value: number
  unit: string
}

export const METRIC_TYPES = [
  'heap_used_mb',
  'heap_used_pct',
  'cpu_load_pct',
  'thread_count',
  'gc_pause_ms',
] as const

export type MetricType = typeof METRIC_TYPES[number]

export const METRIC_LABELS: Record<MetricType, string> = {
  heap_used_mb:  'Heap Used',
  heap_used_pct: 'Heap %',
  cpu_load_pct:  'CPU Load',
  thread_count:  'Threads',
  gc_pause_ms:   'GC Pause',
}
