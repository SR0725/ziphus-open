import { subtle } from "node:crypto";

async function hash(data: string) {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export default hash;
