import Response from "../../../utils/response.js";
import { Admintoken } from "../../../.config/etc/tokens.js";
import { _adminpassword } from "../../../.config/var/private.js";

export default async function signupadmin(rq, rs, pass) {
  const response = (message) => new Response(message);
  const { password } = await rq.body;

  try {
    if (password === _adminpassword) {
      const token = await new Admintoken().sign();
      rs.status(200).json(response("ok").success({ token }));
    } else {
      let message = "access denied";
      rs.status(401).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
