import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        install(CORS) {
            allowHost("localhost:5173")
            allowHost("127.0.0.1:5173")
            allowHeader(HttpHeaders.ContentType)
        }

        routing {
            get("/events") {
                call.response.cacheControl(CacheControl.NoCache(null))
                call.respondTextWriter(contentType = ContentType.Text.EventStream) {
                    EventBus.events.collect { event ->
                        write("id: ${event.id}\n")
                        write("event: ${event.metric}\n")
                        write("data: ${Json.encodeToString(MetricEvent.serializer(), event)}\n")
                        write("\n")
                        flush()
                    }
                }
            }
        }
    }.start(wait = true)
}
