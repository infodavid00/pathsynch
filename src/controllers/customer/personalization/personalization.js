//
import {
  getiscompletedstatus,
  querygetpersonalization,
} from "../../../models/customer/get.js";
import {
  checkiffirstpersonalization,
  querypersonalization,
  queryuserafpers,
  reupdatepersonalization,
} from "../../../models/customer/set.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function updatepersonalizion(rq, rs, pass) {
  const { data, id } = await rq.body;
  try {
    if (data && typeof data === "object" && data.length > 1) {
      /* firstly check if personalization is first. */
      let isfirstpersonalization = await checkiffirstpersonalization(id);
      if (isfirstpersonalization !== null) {
        const addpersonalization = await querypersonalization(id, data);
        if (addpersonalization) {
          const finduserpoints = await getiscompletedstatus(id);
          const points = finduserpoints.metrics.profilestatus;
          if (points === 100) {
            await queryuserafpers(id);
            rs.status(200).json(response("ok").success());
          } else {
            rs.status(200).json(response("ok").success());
          }
          // toping up path ponits is left for v2 of the project.
        } else {
          const message = "process cannot be completed : user not found.";
          rs.status(403).json(response(message).warn());
        }
      } else {
        const reupdatep = await reupdatepersonalization(id, data);
        if (reupdatep) {
          let message = "ok";
          rs.status(200).json(response(message).success());
        } else {
          let message = "user not found";
          rs.status(404).json(response(message).warn());
        }
      }
    } else {
      const message =
        "cannot validate data : type must be array, length must be more than 1 element.";
      rs.status(401).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// update personalization

export async function getpersonalization(rq, rs, pass) {
  const { id } = await rq.body;
  try {
    const getpersonalization = await querygetpersonalization(id);
    /* get the personalizations */
    if (getpersonalization !== null) {
      const personalization = getpersonalization?.user?.personalization;
      let message = "ok";
      rs.status(200).json(response(message).success(personalization));
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// get personalization
