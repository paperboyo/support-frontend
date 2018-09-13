package admin

import config.FastlyConfig

import scala.concurrent.ExecutionContext

class FastlyService(config: FastlyConfig)(implicit ec: ExecutionContext) {

  def purgeSurrogateKey(key: String): Either[Throwable, Unit] = ???
}
