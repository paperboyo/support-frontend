package actions

import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class SettingsDependentAction(override val parser: BodyParser[AnyContent])
                             (override implicit val executionContext: ExecutionContext) extends ActionBuilder[Request, AnyContent] {


  override def invokeBlock[A](request: Request[A], block: Request[A] => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(
      "Surrogate-Key" -> "settings-dependent"
    ))
}
