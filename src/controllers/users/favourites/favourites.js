/* All ids of users in this section is the pubId and not internalId */

import Response from "../../../utils/response.js";
import dates from "../../../utils/dates.js";
import {
  favouriteslookupmodel,
  favouriteslookupmodelcampaigns,
  returnusersinfoSL,
  returnusersinfoSLCampaign,
} from "../../../models/users/get.js";
import {
  addfavouritemodel,
  addfavouritemodelcampaign,
  removefavouritemodel,
  removefavouritemodelcampaigns,
} from "../../../models/users/set.js";

const response = (message) => new Response(message);

export async function addfavourite(rq, rs, pass) {
  try {
    const { userid } = await rq.params;
    const { id } = await rq.body;
    const schema = { userid, timestamp: dates(new Date()) };
    const favouritelookup = await favouriteslookupmodel(id);
    const arr = favouritelookup.user.favourites.users;
    const existingUser = arr.find((element) => element.userid === userid);
    if (!existingUser) {
      await addfavouritemodel(id, schema);
      let message = "ok";
      rs.status(200).json(response(message).success());
    } else {
      let message = "the selected user was already found on the list";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// add favoutite

export async function addfavouriteCampaigns(rq, rs, pass) {
  try {
    const { campaignId } = await rq.params;
    const { id } = await rq.body;
    const schema = { campaignId, timestamp: dates(new Date()) };
    const favouritelookup = await favouriteslookupmodelcampaigns(id);
    const arr = favouritelookup.user.favourites.campaigns;
    const existingCampaign = arr.find(
      (element) => element.campaignId === campaignId
    );
    if (!existingCampaign) {
      await addfavouritemodelcampaign(id, schema);
      let message = "ok";
      rs.status(200).json(response(message).success());
    } else {
      let message = "the selected campaign was already found on the list";
      rs.status(400).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// add favoutite campaigns

export async function removefavourite(rq, rs, pass) {
  try {
    const { userid } = await rq.params;
    const { id } = await rq.body;
    const favouritelookup = await favouriteslookupmodel(id);
    const arr = favouritelookup.user.favourites.users;
    const existingUser = arr.find((element) => element.userid === userid);
    if (existingUser) {
      await removefavouritemodel(id, userid);
      /* remove user from favourites */
      let message = "ok";
      rs.status(200).json(response(message).success());
    } else {
      let message = "user not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// remove favourite

export async function removefavouritecampaigns(rq, rs, pass) {
  try {
    const { campaignId } = await rq.params;
    const { id } = await rq.body;
    const favouritelookup = await favouriteslookupmodelcampaigns(id);
    const arr = favouritelookup.user.favourites.campaigns;
    const existingCampaign = arr.find(
      (element) => element.campaignId === campaignId
    );
    if (existingCampaign) {
      await removefavouritemodelcampaigns(id, campaignId);
      /* remove campaign from favourites */
      let message = "ok";
      rs.status(200).json(response(message).success());
    } else {
      let message = "campaign not found";
      rs.status(404).json(response(message).warn());
    }
  } catch (err) {
    pass(err);
  }
}
// remove favourite campaign

export async function getfavourites(rq, rs, pass) {
  const { snapshot, index } = await rq.query;
  try {
    const { id } = await rq.body;
    const getuserfavourites = await favouriteslookupmodel(id);
    const resultforfindingfavs = await getuserfavourites.user.favourites.users;
    if (resultforfindingfavs !== null) {
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
      for (let x = 0; x < resultforfindingfavs.length; x++) {
        if (newarray[workingindex].length < snapshot) {
          newarray[workingindex].push(resultforfindingfavs[x]);
        } else {
          newarray.push([]);
          workingindex = workingindex + 1;
          newarray[workingindex].push(resultforfindingfavs[x]);
        }
      }
      let finalresultforfavs = newarray[index];
      /* it returns an array containing the value of the specific lists of favourites we
         need, eg : [{},{}], now we need to get the lists of the merchant ids we will
         be using to query for thier profile info (pic and name). */
      let userids = [];
      if (finalresultforfavs && finalresultforfavs.length > 0) {
        finalresultforfavs.forEach(
          (element) => userids.push(element.userid)
          /* do something with the merchant id. */
        );
        // query db to retrieve the users info (profile as menu, logo and name) based on their ids
        const data = await returnusersinfoSL(userids);
        let message = "ok";
        rs.status(203).json(response(message).success(data));
      } else {
        let message = "nothing to return";
        rs.status(200).json(response(message).success());
      }
    } else {
      let message = "no user found";
      rs.status(404).json(response(message).success());
    }
  } catch (err) {
    pass(err);
  }
}
// get favourites

export async function getfavouritescampaigns(rq, rs, pass) {
  const { snapshot, index } = await rq.query;
  try {
    const { id } = await rq.body;
    const getcampaignfavourites = await favouriteslookupmodelcampaigns(id);
    const resultforfindingfavs = await getcampaignfavourites.user.favourites
      .campaigns;
    if (resultforfindingfavs !== null) {
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
      for (let x = 0; x < resultforfindingfavs.length; x++) {
        if (newarray[workingindex].length < snapshot) {
          newarray[workingindex].push(resultforfindingfavs[x]);
        } else {
          newarray.push([]);
          workingindex = workingindex + 1;
          newarray[workingindex].push(resultforfindingfavs[x]);
        }
      }
      let finalresultforfavs = newarray[index];
      /* it returns an array containing the value of the specific lists of favourites we
         need, eg : [{},{}], now we need to get the lists of the campaign ids we will
         be using to query for thier profile info (pic and name). */
      let campaignids = [];
      if (finalresultforfavs && finalresultforfavs.length > 0) {
        finalresultforfavs.forEach(
          (element) => campaignids.push(element.campaignId)
          /* do something with the campaign id. */
        );
        // query db to retrieve the campaign info (cover and title) based on their ids
        const data = await returnusersinfoSLCampaign(campaignids);
        let message = "ok";
        rs.status(203).json(response(message).success(data));
      } else {
        let message = "nothing to return";
        rs.status(200).json(response(message).success());
      }
    } else {
      let message = "no campaign found";
      rs.status(404).json(response(message).success());
    }
  } catch (err) {
    pass(err);
  }
}
// get favourites campaigns
