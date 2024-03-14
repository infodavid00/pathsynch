import Response from "../../utils/response.js";
import { senddownloadLink } from "../../services/sendsms.js";

export default async function sendapkurl(rq, rs, pass) {
  const mobile = await rq.params.mobile;
  const response = (message) => new Response(message);

  if (
    mobile &&
    mobile.length <= 13 &&
    /[a-z]/.test(mobile) === false &&
    /[A-Z]/.test(mobile) === false
  ) {
    try {
      await senddownloadLink(`+${mobile}`);
      rs.status(200).json(response("Ok").success());
    } catch (err) {
      pass(err);
    }
  } else {
    rs.status(400).json(response("cannot validate mobile").warn());
  }
}
