import crypto from "node:crypto";

export function digitGenerator(length) {
  let digit = [];
  for (let i = 0; i < length; i++) {
    digit.push(Math.floor(Math.random() * 10));
  }
  return digit.join("");
}

export function idGenerator(length) {
  return crypto.randomBytes(length).toString("hex");
}
