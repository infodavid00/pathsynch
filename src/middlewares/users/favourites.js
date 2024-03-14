import Validator from "validator";
import Response from "../../utils/response.js";

const response = (message) => new Response(message);

export async function getfavouritesMW(rq, rs, pass) {
  try {
    const { accesstoken } = await rq.params;
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
      pass();
    } else {
      const message = "Err validating token";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get favourites
