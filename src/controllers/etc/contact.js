import Response from "../../utils/response.js";
import Validator from "validator";
import Contact from "../../schema/etc/contact.js";
import { querycontact } from "../../models/etc/set.js";

export default async function contact(rq, rs, pass) {
  const { fname, lname, email, mobile, message } = await rq.body;
  const response = (message) => new Response(message);

  if (
    fname &&
    lname &&
    mobile &&
    email &&
    /\W/.test(fname) === false &&
    /\W/.test(lname) === false &&
    message &&
    Validator.isEmail(email) &&
    mobile.length <= 13 &&
    /[a-z]/.test(mobile) === false &&
    /[A-Z]/.test(mobile) === false
  ) {
    try {
      const schema = new Contact(await rq.body).create();
      await querycontact(schema);
      rs.status(200).json(response("Ok").success());
    } catch (err) {
      pass(err);
    }
  } else {
    let message =
      "ERR : fname, lname, email, mobile and message must be present in request body.";
    rs.status(403).json(response(message).warn());
  }
}
