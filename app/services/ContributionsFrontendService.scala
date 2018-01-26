package services

import java.io.IOException

import cats.data.EitherT
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.mvc.RequestHeader
import play.api.libs.json.JsSuccess
import scala.concurrent.{ExecutionContext, Future}

object ContributionsFrontendService {
  case class Email(value: String)
  object Email {
    def fromResponse(resp: WSResponse): Either[Throwable, Option[Email]] = {
      if (resp.status == 200) {
        Right((resp.json \ "email").validate[String].asOpt.map(Email.apply))
      } else {
        Left(new IOException(resp.toString))
      }
    }
  }
}

class ContributionsFrontendService(wsClient: WSClient, contributionsFrontendUrl: String) {
  import ContributionsFrontendService._

  def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  def execute(queryString: Map[String, Seq[String]])(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, Throwable, Option[Email]] = {
    import cats.syntax.applicativeError._
    import cats.instances.future._
    val endpoint = "/paypal/uk/execute"
    wsClient.url(s"$contributionsFrontendUrl/$endpoint")
      .withHttpHeaders("Content-Type" -> "application/json")
      .withQueryStringParameters(convertQueryString(queryString): _*)
      .withMethod("GET")
      .execute()
      .attemptT
      .subflatMap(Email.fromResponse)
  }
}
