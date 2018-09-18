package admin

import config.FastlyConfig
import play.api.libs.ws.{WSClient, WSResponse}

import scala.concurrent.{ExecutionContext, Future}

class FastlyService(config: FastlyConfig)(implicit ec: ExecutionContext, wsClient: WSClient) {

  def purgeSurrogateKey(key: String): Future[WSResponse] = {
    val url = s"https://api.fastly.com/service/${config.serviceId}/purge/$key"
    val request = wsClient.url(url).withHttpHeaders("Fastly-Key" -> config.apiToken, "Accept" -> "application/json").withMethod("POST")
    val response = request.execute()
    response
  }
}

object FastlyService {
  val settingsDependentSurrogateKey = "settings-dependent"
}
