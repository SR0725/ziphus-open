import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const privateKey = process.env.JWT_SECRET || "k,o,u,r,4,p,r,c,f,s";

// TODO: 也許能改用原生地 Node.js 的 crypto 模組來產生 private key
function signToken<T extends object | string | Buffer>(payload: T) {
  return jwt.sign(payload, privateKey);
}

function decodeToken<T extends JwtPayload | string>(token?: string): T {
  if (!token) {
    throw new Error("Token is not provided");
  }
  return jwt.verify(token, privateKey) as T;
}

export { signToken, decodeToken };
