import Response from "../../utils/response.js";
import validator from "validator";
import { Accesstoken, Admintoken } from "../../.config/etc/tokens.js";
import {
  _usertypeA,
  _usertypeB,
  _appname,
} from "../../.config/var/application.js";

const respone = (message) => new Response(message);

export async function ATforM(rq, rs, pass) {
  const token = await rq.params.accesstoken;
  const ast = new Accesstoken(); //ast as accesstoken

  if (validator.isJWT(token)) {
    try {
      const { type, sub: id } = await ast.verify(token);
      if (type === _usertypeA) {
        const newbody = { id, ...(await rq.body) };
        rq.body = newbody;
        pass();
      } else {
        let message = "unauthorized";
        rs.status(401).json(respone(message).warn());
      }
    } catch (err) {
      rs.status(403).json(respone(err.message).warn());
    }
  } else {
    let message = "Err : invalid token";
    rs.status(403).json(respone(message).warn());
  }
}
// accesstoken verification for merchants

export async function ATforC(rq, rs, pass) {
  const token = await rq.params.accesstoken;
  const ast = new Accesstoken(); //ast as accesstoken

  if (validator.isJWT(token)) {
    try {
      const { type, sub: id } = await ast.verify(token);
      if (type === _usertypeB) {
        const newbody = { id, ...(await rq.body) };
        rq.body = newbody;
        pass();
      } else {
        let message = "unauthorized";
        rs.status(401).json(respone(message).warn());
      }
    } catch (err) {
      rs.status(403).json(respone(err.message).warn());
    }
  } else {
    let message = "Err : invalid token";
    rs.status(403).json(respone(message).warn());
  }
}
// accesstoken verification for customers

export async function ATforGeneral(rq, rs, pass) {
  const token = await rq.params.accesstoken;
  const ast = new Accesstoken(); //ast as accesstoken

  if (validator.isJWT(token)) {
    try {
      const { sub: id } = await ast.verify(token);
      const newbody = { id, ...(await rq.body) };
      rq.body = newbody;
      pass();
    } catch (err) {
      rs.status(403).json(respone(err.message).warn());
    }
  } else {
    let message = "Err : invalid token";
    rs.status(403).json(respone(message).warn());
  }
}
// accesstoken verification for general

export async function ATforAdmin(rq, rs, pass) {
  const token = await rq.params.accesstoken;
  const adt = new Admintoken(); //adt as admintoken

  if (validator.isJWT(token)) {
    try {
      const { iss, sub } = await adt.verify(token);
      if (
        iss === "REF64" &&
        sub === "-0RFJ0302WD0K_02EI20D02_0J0K20.30Q-W02--WA"
      ) {
        pass();
      } else {
        rs.status(401).json(respone("unauthorized").warn());
      }
    } catch (err) {
      rs.status(403).json(respone(err.message).warn());
    }
  } else {
    let message = "Err : invalid token";
    rs.status(403).json(respone(message).warn());
  }
}
// accesstoken verification for admin
