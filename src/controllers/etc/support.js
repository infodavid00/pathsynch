import Response from "../../utils/response.js";
import Support from "../../schema/etc/support.js";
import querysupport from "../../models/etc/set.js";
import Validator from "validator";

export default async function support(rq, rs, pass) {
  const { name, email, mobile, message, company, natureOfwork } = await rq.body;
  const response = (message) => new Response(message);

  if (
    name &&
    email &&
    mobile &&
    message &&
    company &&
    natureOfwork &&
    Validator.isEmail(email) &&
    mobile.length <= 13 &&
    /[a-z]/.test(mobile) === false &&
    /[A-Z]/.test(mobile) === false
  ) {
    try {
      const schema = new Support(await rq.body).create();
      await querysupport(schema);
      let supportId = schema.supportId;
      rs.status(200).json(response("Ok").success({ supportId }));
    } catch (err) {
      pass(err);
    }
  } else {
    let message =
      "ERR : name, email, mobile, message, company and natureOfwork must be present in request body.";
    rs.status(403).json(response(message).warn());
  }
}
// send support
