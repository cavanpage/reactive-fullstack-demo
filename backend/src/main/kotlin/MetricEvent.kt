import kotlinx.serialization.Serializable

@Serializable
data class MetricEvent(
    val id: String,
    val timestamp: Long,
    val metric: String,
    val value: Double,
    val unit: String
)
