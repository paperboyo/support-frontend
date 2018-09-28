package codecs

import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.scalatest.{MustMatchers, WordSpec}

class CookieResponseTest extends WordSpec with MustMatchers {

  "Cookie response" should {
    "decode time" in {
      val time = "2018-12-27T12:51:26+00:00"
      val dt = DateTime.parse(time)
    }
  }
}

