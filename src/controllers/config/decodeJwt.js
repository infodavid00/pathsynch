import jwt from "jsonwebtoken";
import Response from "../../utils/response.js";

export default async function decodeJwt(rq, rs, pass) {
  const { token } = await rq.params;
  const response = (message) => new Response(message);

  try {
    const payload = jwt.decode(token);
    await rs.status(200).json(response("ok").success({ payload }));
  } catch (err) {
    pass(err);
  }
}
// decode jwt
