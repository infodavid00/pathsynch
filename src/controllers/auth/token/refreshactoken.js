import Validator from "validator";
import { Accesstoken, Refreshtoken } from "../../../.config/etc/tokens.js";
import Response from "../../../utils/response.js";

export default async function refreshactoken(rq, rs, pass) {
  const { refreshtoken } = await rq.params;
  const response = (message) => new Response(message);

  try {
    if (Validator.isJWT(refreshtoken)) {
      const { sub, type } = await new Refreshtoken().verify(refreshtoken);
      const accesstoken = await new Accesstoken().sign(sub, type);
      rs.status(200).json(response("ok").success({ accesstoken }));
    } else {
      let message = "cannot validate signature";
      rs.status(401).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// refresh accesstoken
