import fs from "fs";

function fileToGenerativeBufferPart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export default fileToGenerativeBufferPart;
