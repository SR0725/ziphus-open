import assert from "assert";
import fs from "fs";
import path from "path";
import pdf2md from "@repo/pdf-to-markdown";

async function GetTextFromPDF(pathStr: any): Promise<string[]> {
  assert(fs.existsSync(pathStr), `Path does not exist ${pathStr}`);
  const pdfFile = path.resolve(pathStr);
  const dataBuffer = fs.readFileSync(pdfFile);
  const data = await pdf2md(dataBuffer);

  return data;
}
export default GetTextFromPDF;
