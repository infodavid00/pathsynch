/* can edit fname, lname, zip, dob and profile */
/* if not profile, query new user info and end request, else if profile,
   check firstly if profile is equal to null in the db, if its not equal to null,
   do same step as the above, and end request, else if its null :
   re update the data and set profile points to +20, after that, check once again
   if profile iscompletedstatus is 100 if so, update isCUI and credit 1 $path for
   completely completing user profile,
*/

import Response from "../../../utils/response.js";
import dates from "../../../utils/dates.js";
import {
  insertLocationAcessSignup,
  queryeditprofile,
  queryuserafpers,
  setprofilepoints,
  topupPathPointsAfterFollowingModel,
} from "../../../models/customer/set.js";
import {
  cipetn,
  getiscompletedstatus,
  querygetlocationAccessSignup,
} from "../../../models/customer/get.js";

const response = (message) => new Response(message);

export async function editprofile(rq, rs, pass) {
  const { fname, lname, zip, dob, profile, id } = await rq.body;
  try {
    if (fname || lname || zip || dob || profile) {
      const originalset = {
        $set: { "meta.lastupdateAt": dates(new Date()) },
      }; //the data which will be updated to

      fname ? (originalset.$set["meta.name.fname"] = fname) : null;
      /* add fname to original set if found */
      lname ? (originalset.$set["meta.name.lname"] = lname) : null;
      /* add lname to original set if found */
      zip ? (originalset.$set["meta.zip"] = zip) : null;
      /* add zip to original set if found */
      dob ? (originalset.$set["meta.dob"] = dob) : null;
      /* add dob to original set if found */
      profile ? (originalset.$set["meta.profile"] = profile) : null;
      /* add profile to original set if found */

      if (profile) {
        // check firstly if profile is equal to null on db
        const checkforprofile = await cipetn(id);
        if (checkforprofile === null) {
          await queryeditprofile(id, originalset); //update the data
          await setprofilepoints(id); //set profilestatus to +20
          const finduserpoints = await getiscompletedstatus(id);
          /* get user profile points. */
          if (finduserpoints !== null) {
            const points = finduserpoints.metrics.profilestatus;
            // check if profilepoints is equal to 100
            if (points === 100) {
              await queryuserafpers(id); //update isCUI and $path
              rs.status(200).json(response("ok").success());
            } else {
              rs.status(200).json(response("ok").success());
            }
          } else {
            let message = "user not found";
            rs.status(404).json(response(message).warn());
          }
        } else {
          await queryeditprofile(id, originalset);
          rs.status(200).json(response("ok").success());
          /* since profile photo has once been uploaded */
        }
      } else {
        await queryeditprofile(id, originalset);
        rs.status(200).json(response("ok").success());
        /* since no profie update, query the rest and end the request */
      }
    } else {
      let message = "ERR : cannot validate body";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// edit profile

export async function locationAccess(rq, rs, pass) {
  const { longitude, latitude, id } = await rq.body;
  if (longitude && latitude) {
    try {
      const checkLocationAccess = await querygetlocationAccessSignup(id);
      if (checkLocationAccess !== null) {
        let LA = checkLocationAccess.user?.locationAccess;
        if (!LA) {
          let locationObect = {
            longitude,
            latitude,
            signupAccess: true,
            signinAccess: false,
          };
          // proceed with request
          /* signupAccess can only be set to true once. if fasle, path points is 
             incremented by 1 and if true it terminates the request.
          */
          await insertLocationAcessSignup(id, locationObect);
          rs.status(200).json(response("ok").success());
        } else {
          let message = "FORBIDEN: signupAccess already signed.";
          rs.status(403).json(response(message).warn());
        }
      } else {
        let message = "user not found";
        rs.status(404).json(response(message).warn());
      }
    } catch (err) {
      pass(err);
    }
  } else {
    let message = "ERR: required fields missing.";
    rs.status(400).json(response(message).warn());
  }
}
// location access [signup]

export async function topupPathPointsAfterFollowing_Social(rq, rs, pass) {
  const { id } = await rq.body;
  const { type } = await rq.params;
  try {
    if (
      type.toLowerCase() === "facebook" ||
      type.toLowerCase() === "x" ||
      type.toLowerCase() === "instagram"
    ) {
      await topupPathPointsAfterFollowingModel(id);
      rs.status(200).json(response("ok").success());
    } else {
      let message = "type can only be facebook, x or instagram";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// topup path point after following
