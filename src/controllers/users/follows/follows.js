/*
   when the following process occurs, it takes the user id, generates a timestamp and
   firstly inserts it in the [following] sub collection of the user making the request,
   before inserting on the user's (the person in which the user is trying to follow)
   [followers] sub collection.
   EVERYTHING ABOUT THE FORIEGN USER ON THIS SECTION WORKS WITH THEIR PUBLIC IDS ONLY
 */

import {
  findfollowers,
  findfollowing,
  getrequestinguserpubid,
  returnusersinfoSL,
} from "../../../models/users/get.js";
import {
  queryfollowerA,
  queryfollowerB,
  unfollowA,
  unfollowB,
} from "../../../models/users/set.js";
import dates from "../../../utils/dates.js";
import Response from "../../../utils/response.js";

const response = (message) => new Response(message);

export async function followuser(rq, rs, pass) {
  try {
    const { userid } = await rq.params;
    const { id } = await rq.body;
    let timestamp = dates(new Date());

    /* get my public id */
    const getmypubid = await getrequestinguserpubid(id);
    if (getmypubid !== null) {
      const mypubid = getmypubid.meta.pubId;
      const schema = { userid, timestamp };
      const schema_ = { userid: mypubid, timestamp };
      /* when i follow someone, it first checks if the user is in my following list ,
         if so, you warn that am already following the user else grant request
      */
      const followinglookup = await findfollowing(id);
      const arr = followinglookup.user.followers.following.users;
      const isuserfollowing = arr.find((element) => element.userid === userid);
      if (!isuserfollowing) {
        await queryfollowerA(id, schema); //add to your following list
        await queryfollowerB(userid, schema_); //add to user's following list
        let message = "ok";
        rs.status(200).json(response(message).success());
      } else {
        let message = "the selected user is already in your following lists";
        rs.status(400).json(response(message).warn());
      }
    } else {
      let message = "requesting user does not exists.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// follow user

export async function unfollowuser(rq, rs, pass) {
  try {
    const { userid } = await rq.params;
    const { id } = await rq.body;

    /* get my public id */
    const getmypubid = await getrequestinguserpubid(id);
    if (getmypubid !== null) {
      const mypubid = getmypubid.meta.pudId;

      const followinglookup = await findfollowing(id);
      const arr = followinglookup.user.followers.following.users;
      const isuserfollowing = arr.find((element) => element.userid === userid);
      if (isuserfollowing) {
        await unfollowB(userid, mypubid); //remove id from user's following list
        await unfollowA(id, userid); //remove id from your following list
        let message = "ok";
        rs.status(200).json(response(message).success());
      } else {
        let message = "the selected user was not found on your following lists";
        rs.status(400).json(response(message).warn());
      }
    } else {
      let message = "requesting user does not exists.";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// unfollow user

export async function getfr_fg(rq, rs, pass) {
  const { snapshot, index } = await rq.query;
  const { type } = await rq.params;
  /* followers or following */
  try {
    const { id } = await rq.body;
    const getfollwersorfollowing =
      type === "followers"
        ? await findfollowers(id)
        : type === "following"
        ? await findfollowing(id)
        : null;
    const resultforGetfrOrfg = await getfollwersorfollowing.user.followers[
      type === "followers" ? "followers" : "following"
    ];
    const numberoffollows_fr_fg = resultforGetfrOrfg.count;
    const resultsarrayneeded = resultforGetfrOrfg.users;
    if (numberoffollows_fr_fg > 0) {
      /* now we have to group the arrays in sub arrays based on the snapshot size eg :
         if the snapshot is 3 then we have to create sub arrays where each contains 3 elements
         each, and the last one with rest available values resulting to:
         database return = [{},{},{},{},{},{},{},{},{},{},{}]
         after cleaning, return new array like this :
         new arr = [[{},{},{}], [{},{},{}], [{},{},{}], [{},{}]]
         then we can get the rigth portion simply by = [new arr[index]]
      */
      let newarray = []; // the actal array storing the new format
      let workingindex; // the variable holding the current array work is done on
      if (newarray.length < 1) {
        newarray.push([]);
        workingindex = 0;
      }
      for (let x = 0; x < resultsarrayneeded.length; x++) {
        if (newarray[workingindex].length < snapshot) {
          newarray[workingindex].push(resultsarrayneeded[x]);
        } else {
          newarray.push([]);
          workingindex = workingindex + 1;
          newarray[workingindex].push(resultsarrayneeded[x]);
        }
      }
      let finalresultforlists = newarray[index];
      /* it returns an array containing the value of the specific lists of favourites we
         need, eg : [{},{}], now we need to get the lists of the merchant ids we will
         be using to query for thier profile info (pic and name).
      */
      let usersids = [];
      if (finalresultforlists && finalresultforlists.length > 0) {
        finalresultforlists.forEach(
          (element) => usersids.push(element.userid)
          /* do something with the users ids. */
        );
        // query db to retrieve the users info (profile and name) based on their ids
        const data = await returnusersinfoSL(usersids);
        let message = "ok";
        rs.status(200).json(
          response(message).success({ count: numberoffollows_fr_fg, data })
        );
      } else {
        let message = "nothing to return";
        rs.status(203).json(response(message).success());
      }
    } else {
      let message = "nothing to return";
      rs.status(404).json(response(message).success());
    }
  } catch (err) {
    pass(err);
  }
}
// get followers or following
