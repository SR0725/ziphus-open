import pangu from "pangu";
import fs from "fs";

const punctuationMap: Record<
  string,
  {
    half: string;
    full: string;
  }
> = {
  ",": { half: ",", full: "，" },
  ".": { half: ".", full: "。" },
  "?": { half: "?", full: "？" },
  "!": { half: "!", full: "！" },
  ":": { half: ":", full: "：" },
  ";": { half: ";", full: "；" },
  '"': { half: '"', full: "”" },

  "，": { half: ",", full: "，" },
  "。": { half: ".", full: "。" },
  "？": { half: "?", full: "？" },
  "！": { half: "!", full: "！" },
  "：": { half: ":", full: "：" },
  "；": { half: ";", full: "；" },
  "”": { half: '"', full: "”" },
};

function formatPunctuation(input: string): string {
  // 檢查字符是否為中文.
  const isEnglish = (char: string) => /^[a-zA-Z]$/.test(char);
  const isChinese = (char: string) => /[\u4e00-\u9fa5]/.test(char);

  // 主處理函數
  let result = "";
  let languageSection: "chinese" | "english" = "chinese";
  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    const isPunctuation = Boolean(punctuationMap?.[char]);

    if (isPunctuation) {
      const punctuation = punctuationMap[char]!;
      // 如果是中文區塊則使用全形標點符號
      if (languageSection === "chinese") {
        result += punctuation.full;
      }
      // 如果是英文區塊則使用半形標點符號，並嘗試在標點符號前後加空格
      if (languageSection === "english") {
        const nextCharIsSpace = input[i + 1] === " ";
        result += nextCharIsSpace ? punctuation.half : `${punctuation.half} `;
      }
    } else {
      const isChineseChar = isChinese(char);
      const isEnglishChar = isEnglish(char);
      // 如果是中文字符則設定為中文區塊，如果是英文字符則設定為英文區塊，反之則保持原狀
      languageSection = isChineseChar
        ? "chinese"
        : isEnglishChar
          ? "english"
          : languageSection;
      result += char;
    }
  }

  return result;
}

function formatBulletList(input: string): string {
  // 匯總所有半形和全形標點符號到一個正則表達式中
  const punctuationRegex = new RegExp(
    `[${Object.values(punctuationMap)
      .map((v) => `${v.half}${v.full}`)
      .join("")}]`
  );

  // 分割輸入文本以檢查每個頓號（、）之間是否存在其他標點符號
  const segments = input.split("、");
  let result = segments[0]; // 初始化結果為第一個段落

  let inListAdding = false;
  for (let i = 0; i < segments.length; i++) {
    // 如果不處在列表添加模式中，則檢查是否需要進入該模式
    if (!inListAdding) {
      // 如果下一段文本不包含其他標點符號，則進入列表添加模式
      if (i + 1 < segments.length && !punctuationRegex.test(segments[i + 1]!)) {
        // 下一段項目的字數
        const nextSegment = segments[i + 1]!;
        const nextSegmentLength = nextSegment.length;
        // 取得上一段與本段相同字數的最後部分
        const currentSegment = segments[i]!;
        const currentSegmentStart = currentSegment.slice(0, -nextSegmentLength);
        const currentSegmentEnd = currentSegment.slice(-nextSegmentLength);
        result += `${currentSegmentStart}：`;
        result += `\n- ${currentSegmentEnd}`;
        inListAdding = true;
      } else {
        result += `、${segments[i]}`;
      }
    } else {
      result += `\n- ${segments[i]}`;
      if (punctuationRegex.test(segments[i]!)) {
        inListAdding = false;
      }
    }
  }
  return result || "";
}

interface LevelContent {
  content: string;
  level: number;
}

export function parseMarkdownToLevel(markdownText: string): LevelContent[] {
  // 使用正規表達式來匹配全形句號、問號、換行號
  const sentences = markdownText
    .split(/。|？|\n/)
    .filter((sentence) => sentence.length > 0);
  fs.writeFileSync("sentences.json", JSON.stringify(sentences, null, 2));
  return sentences
    .map((sentence, index) => {
      // 如果這個句子是 ** 開頭但不存在 ** 結尾，則將其合併到下一個句子
      if (sentence.startsWith(" **") && !sentence.endsWith("**")) {
        if (sentences[index + 1]?.startsWith("**")) {
          sentence += "**";
          sentences[index + 1] = sentences[index + 1]?.slice(2) ?? "";
        }
      }
      let level = 0;
      let content = sentence.trim();

      // 檢查 Markdown 標題和格式
      if (content.startsWith("# ")) level = 8;
      else if (content.startsWith("## ")) level = 7;
      else if (content.startsWith("### ")) level = 6;
      else if (content.startsWith("#### ")) level = 5;
      else if (content.startsWith("##### ")) level = 4;
      else if (content.startsWith("###### ")) level = 3;
      else if (content.startsWith("**")) level = 2;
      else if (content.startsWith("*")) level = 1;

      // 將結果以物件形式返回
      return {
        content,
        level,
      };
    })
    .filter((item) => item.content.length > 0); // 過濾空字串
}

export function formatLevelContentHeader(
  levelContent: LevelContent[]
): LevelContent[] {
  // 將所有 level >= 3 的 content，中的粗體標記 ** 去除
  return levelContent.map((item) => {
    if (item.level >= 3) {
      item.content = item.content.replace(/\*\*/g, "");
    }
    return item;
  });
}

function parseMarkdownToSection(
  levelContent: { content: string; level: number }[]
): string[] {
  let sections: string[] = [];
  let currentSectionRow = 0;
  let lastLevel = 0;
  for (const item of levelContent) {
    // 如果項目級別為 6 以上，獨立為一個段落
    if (item.level >= 6 && lastLevel <= item.level) {
      sections.push(item.content);
      currentSectionRow = 1;
      lastLevel = item.level;
    }
    // 如果項目級別為 1 以上，且當前段落行數大於 8，則獨立為一個段落
    else if (item.level >= 1 && currentSectionRow > 2) {
      sections.push(item.content);
      currentSectionRow = 1;
    }
    // 如果當前段落行數大於 6，則獨立為一個段落
    else if (item.level >= 1 && currentSectionRow > 1) {
      sections.push(item.content);
      currentSectionRow = 1;
    }
    // 如果項目級別小於 6 ，則與上一個項目合併為一個段落
    else {
      sections[sections.length - 1] += `\n\n${item.content}`;
      currentSectionRow += 1;
    }
  }
  return sections;
}

function markdownSplit(rawMarkdown: string | string[]): string[] {
  const fullMarkdown =
    rawMarkdown instanceof Array ? rawMarkdown.join("\n") : rawMarkdown;

  // // 規則三：子彈列表（難以分析邏輯，測試性邏輯可能存在問題）
  // const fullMarkdownWithBulletList = formatBulletList(
  //   fullMarkdownWithFormatPunctuation
  // );
  // 規則一：分段
  const levelContent = parseMarkdownToLevel(fullMarkdown);
  // 規則二：標題格式化
  const levelContentWithHeader = formatLevelContentHeader(levelContent);
  // 規則三：分段
  const sections = parseMarkdownToSection(levelContentWithHeader);
  // 規則四：中英文之間需要有空格
  const sectionsWithPanguSpace = sections.map((section) =>
    pangu.spacing(section)
  );

  return sectionsWithPanguSpace;
}

export default markdownSplit;
