import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.lang.management.ManagementFactory

fun jvmMetricFlow(): Flow<MetricEvent> = flow {
    var seq = 0
    val mem     = ManagementFactory.getMemoryMXBean()
    val threads = ManagementFactory.getThreadMXBean()
    val gcBeans = ManagementFactory.getGarbageCollectorMXBeans()
    val osMxBean = ManagementFactory.getOperatingSystemMXBean()

    var lastGcTime = gcBeans.sumOf { it.collectionTime }

    while (true) {
        val heapUsed = mem.heapMemoryUsage.used / 1_048_576.0
        val heapMax  = mem.heapMemoryUsage.max  / 1_048_576.0
        val heapPct  = if (heapMax > 0) (heapUsed / heapMax) * 100.0 else 0.0

        val cpuLoad = when (osMxBean) {
            is com.sun.management.OperatingSystemMXBean -> osMxBean.processCpuLoad * 100.0
            else -> osMxBean.systemLoadAverage
        }.coerceIn(0.0, 100.0)

        val threadCount = threads.threadCount.toDouble()

        val gcTime  = gcBeans.sumOf { it.collectionTime }
        val gcDelta = (gcTime - lastGcTime).toDouble()
        lastGcTime  = gcTime

        val now = System.currentTimeMillis()
        listOf(
            MetricEvent("evt-${seq++}", now, "heap_used_mb",  heapUsed,     "MB"),
            MetricEvent("evt-${seq++}", now, "heap_used_pct", heapPct,      "%"),
            MetricEvent("evt-${seq++}", now, "cpu_load_pct",  cpuLoad,      "%"),
            MetricEvent("evt-${seq++}", now, "thread_count",  threadCount,  "threads"),
            MetricEvent("evt-${seq++}", now, "gc_pause_ms",   gcDelta,      "ms"),
        ).forEach { emit(it) }

        delay(1000)
    }
}
