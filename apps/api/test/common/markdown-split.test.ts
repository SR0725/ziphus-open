import markdownSplit from "@/common/markdown-split";
import fs from "fs";

describe("Markdown Split", () => {
  beforeEach(() => {});

  it(`
    Given A markdown with a single word
    When split the markdown
    Then it should return the markdown
  `, async () => {
    const exampleMarkdown = `不能信任那些Terminal或Editor用白底的人`;
    const cleanedMarkdown = markdownSplit(exampleMarkdown);

    expect(cleanedMarkdown).toEqual([
      "不能信任那些 Terminal 或 Editor 用白底的人",
    ]);
  });
});
