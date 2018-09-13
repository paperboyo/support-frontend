package admin

import config.FastlyConfig
import play.api.libs.ws.WSClient

import scala.concurrent.ExecutionContext

class FastlyService(config: FastlyConfig)(implicit ec: ExecutionContext, wsClient: WSClient) {

  def purgeSurrogateKey(key: String): Either[Throwable, Unit] = {
    val url = s"https://api.fastly.com/service/${config.serviceId}/purge/$key"
    val request = wsClient.url(url).withHttpHeaders("Fastly-Key" -> config.apiToken, "Accept" -> "application/json").withMethod("POST")
    val response = request.execute()
    ???
  }
  def purgeSettingDependentRoutes(): Either[Throwable, Unit] = purgeSurrogateKey(FastlyService.settingsDependentSurrogateKey)
}

object FastlyService {
  val settingsDependentSurrogateKey = "settings-dependent"
}
