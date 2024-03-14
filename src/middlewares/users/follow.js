import Validator from "validator";
import Response from "../../utils/response.js";

const response = (message) => new Response(message);

export async function gfr_fgMW(rq, rs, pass) {
  try {
    const { accesstoken, type } = await rq.params;
    let { snapshot, index } = await rq.query;
    if (Validator.isJWT(accesstoken)) {
      index ? (rq.query.index = Number(index)) : (rq.query.index = 0);
      snapshot === "x"
        ? (snapshot = 10)
        : snapshot === "m"
        ? (snapshot = 15)
        : snapshot === "l"
        ? (snapshot = 20)
        : (snapshot = 10);
      rq.query.snapshot = snapshot;
      if (type === "followers" || type === "following") {
        pass();
      } else {
        let message = "type can only be followers or following";
        rs.status(400).json(response(message).warn());
      }
    } else {
      const message = "Err validating token";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get followers or following middelware
