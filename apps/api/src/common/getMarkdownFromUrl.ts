import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import loadUrlContent from "./loadUrlContent";

let turndownService = new TurndownService();

// 添加自定義轉換規則
turndownService
  .addRule("headings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node) {
      const rawHLevel = Math.floor(Number(node.nodeName.charAt(1)) / 2) + 1;
      const hLevel = rawHLevel > 3 ? 3 : rawHLevel;
      return "#".repeat(hLevel) + " " + content + "\n\n";
    },
  })
  .addRule("Picture", {
    filter: "picture",
    replacement: function (content, node: any) {
      // const src = node?.querySelector("source")?.srcset || "";
      // return `![${src}](${src})`;
      return "";
    },
  })
  .addRule("images", {
    filter: "img",
    replacement: function (content, node: any) {
      const src = node?.src || "";
      return "";
    },
  })
  .addRule("links", {
    filter: "a",
    replacement: function (content, node: any) {
      const href = node?.href || "";
      return `${href}`;
    },
  });

export default async function getMarkdownFromUrl(url: string): Promise<string> {
  let html = "";
  try {
    html = await loadUrlContent(url);
  } catch (e) {
    console.error(e);
    const response = await axios.get(url);
    html = response.data;
  }

  const $ = cheerio.load(html);

  $(
    'script, style, nav, header, footer, .nav, .ad, button, [href*="signin"], [href*="subscribe"], [href*="bookmark"]'
  ).remove();
  $("a").each(function () {
    let text = $(this).text();
    if (
      text.includes("Sign in") ||
      text.includes("Open in app") ||
      text.includes("Follow") ||
      text.includes("Write")
    ) {
      $(this).remove();
    }
  });
  $("img").each(function () {
    $(this).remove();
  });
  $('a[href="#"], a[rel="nofollow"], .comments').remove();

  const bodyHtml = $("body").html() || "";
  const rawMarkdown = turndownService.turndown(bodyHtml);

  return rawMarkdown;
}
