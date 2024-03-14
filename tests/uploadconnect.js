import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://ahmedrony:H95DjsCf2WpeUy2C@cluster0.ow7smv1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

console.log("started");

(async () => {
  try {
    await client.connect();
    const db = client.db("dbPathsynch").collection("col_users");
    const query = {
      "meta.pubId": "bb3db3f2fe24165e54df71193e73ceMTcwNjEyMzcxMDU0OA",
    };
    const options = { $set: { _connectedId: "acct_1OfkOwCpWx6cAe2c" } };
    const u = await db.updateOne(query, options);
    console.log("successfully ran code.");
    console.log(u);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("ended");
  }
})();
