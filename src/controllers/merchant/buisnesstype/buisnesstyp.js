import { queryupdatebuisnesstype } from "../../../models/merchant/set.js";
import { querygetbuisnesstype } from "../../../models/merchant/get.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function updatebuisnesstype(rq, rs, pass) {
  const body = await rq.body;
  const { id } = body;
  try {
    await queryupdatebuisnesstype(id, body);
    rs.status(200).json(response("ok").success());
  } catch (err) {
    pass(err);
  }
}
// update buisnesstype

export async function getbuisnesstype(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const qgbuisnesstype = await querygetbuisnesstype(id);
    if (qgbuisnesstype !== null) {
      const data = qgbuisnesstype?.meta?.buisnessType;
      let message = "ok";
      rs.status(200).json(response(message).success(data));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get buisnesstype
