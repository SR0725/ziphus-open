import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "crypto";
import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import pdfExport from "@/common/pdf-export";

const pump = util.promisify(pipeline);
export default async function getMarkdownFromPdf(
  file: MultipartFile | undefined
): Promise<string[]> {
  if (!file) {
    return [];
  }
  const filename = `${Date.now()}-${randomUUID()}.pdf`;
  await pump(file.file, fs.createWriteStream(filename));
  // TODO: 測試階段只取前 100 頁
  const text = (await pdfExport(filename)).splice(0, 100);
  await fs.unlinkSync(filename);
  await fs.writeFileSync("output.md", text.join("\n"));
  return text;
}
