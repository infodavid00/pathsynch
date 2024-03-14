import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  _accesstokensecrete,
  _adminpassword,
  _refreshtokensecrete,
} from "../var/private.js";

class Accesstoken {
  async sign(sub, type) {
    const payload = {
      sub,
      type,
    };
    try {
      let signature = jwt.sign(payload, _accesstokensecrete, {
        expiresIn: "730d",
      });
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // sign accesstoken

  async verify(token) {
    try {
      let signature = jwt.verify(token, _accesstokensecrete);
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // verify accesstoken
}

class Refreshtoken {
  async sign(sub, type) {
    const payload = {
      sub,
      type,
    };
    try {
      let signature = jwt.sign(payload, _refreshtokensecrete, {
        expiresIn: "730d",
      });
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // sign refreshtoken

  async verify(token) {
    try {
      let signature = jwt.verify(token, _refreshtokensecrete);
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // verify refreshtoken
}

class Hash {
  constructor(token) {
    this.token = token;
  }
  async sign() {
    try {
      const result = await bcrypt.hash(this.token, 10);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async compare(hashedstr) {
    try {
      const result = await bcrypt.compare(this.token, hashedstr);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

class Admintoken {
  async sign() {
    const payload = {
      iss: "REF64",
      sub: "-0RFJ0302WD0K_02EI20D02_0J0K20.30Q-W02--WA",
    };
    try {
      let signature = jwt.sign(payload, _accesstokensecrete, {
        expiresIn: "2d",
      });
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // sign admintoken
  async verify(token) {
    try {
      let signature = jwt.verify(token, _accesstokensecrete);
      return signature;
    } catch (err) {
      throw err;
    }
  }
  // verify admintoken
}

export { Accesstoken, Refreshtoken, Admintoken, Hash };
