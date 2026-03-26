import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch

object EventBus {
    private val scope = CoroutineScope(Dispatchers.Default)
    private val _events = MutableSharedFlow<MetricEvent>(replay = 10)
    val events: SharedFlow<MetricEvent> = _events.asSharedFlow()

    init {
        scope.launch {
            jvmMetricFlow().collect { _events.emit(it) }
        }
    }
}
