import Response from "../../utils/response.js";

export default function error(err, rq, rs, pass) {
  const res = new Response(
    err.message || err || "Internal server error"
  ).warn();
  rs.status(500).json(res);
}
