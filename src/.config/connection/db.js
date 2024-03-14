import { MongoClient } from "mongodb";
import { _dbname, _dbstring } from "../var/connection.js";

class Connectionconfig {
  constructor() {
    this.client = new MongoClient(_dbstring);
  }

  async connect() {
    await this.client.connect();
  }

  async close() {
    await this.client.close();
  }

  pipeline(coll) {
    return this.client.db(_dbname).collection(coll);
  }

  static Connection() {
    if (!Connectionconfig.instance) {
      Connectionconfig.instance = new Connectionconfig();
    }
    return Connectionconfig.instance;
  }
}

export default Connectionconfig.Connection();
