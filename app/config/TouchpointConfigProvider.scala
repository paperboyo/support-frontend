package config

import com.typesafe.config.Config
import config.TouchPointEnvironments.{UAT, fromStage}
import services.touchpoint.TouchpointService

trait TouchpointConfig

abstract class TouchpointConfigProvider[T <: TouchpointConfig](config: Config, defaultEnvironment: TouchPointEnvironment) {

  private lazy val defaultConfig: T = fromConfig(getTouchpointBackend(defaultEnvironment))
  private lazy val uatConfig: T = fromConfig(getTouchpointBackend(UAT))

  def get(uatMode: Boolean = false): T =
    if (uatMode) uatConfig else defaultConfig

  protected def fromConfig(config: Config): T

  private def getTouchpointBackend(environment: TouchPointEnvironment) =
    config.getConfig(s"${environment.toString}")
}
