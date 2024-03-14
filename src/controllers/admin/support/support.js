import { querygetsupport } from "../../../models/admin/get.js";
import { querymarksupportasResponded } from "../../../models/admin/set.js";
import sendemail from "../../../services/sendemail.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function getsupport(rq, rs, pass) {
  const { page: pageq, size: sizeq } = await rq.query;
  const size = Number(sizeq) || 10;
  const page = Number(pageq) * size || 0;

  try {
    const docs = await querygetsupport(page, size);
    rs.status(200).json(response("ok").success(docs));
  } catch (err) {
    pass(err);
  }
}
// get support

export async function responseToSupport(rq, rs, pass) {
  const { id, email, supportId, body } = await rq.body;
  try {
    if (id && email && supportId && body) {
      let template = `<p> ${body} </p>`;
      await sendemail(template, email, `Pathsynch Response@ ${supportId}`);
      await querymarksupportasResponded(id);
      rs.status(200).json(response("ok").success({ supportId }));
    } else {
      let message = "id , email, supportId and body must be present";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// respond to support messages
