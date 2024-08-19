import { parseString } from "xml2js";

const fragmentMap: Record<string, string> = {
  blockgroup: "div",
  blockcontainer: "div",
  heading: "h",
  numberedlistitem: "li",
  bulletlistitem: "li",
  table: "table",
  tablerow: "tr",
  tablecell: "td",
  codeblock: "code",
  paragraph: "p",
};

function convertXmlToHtml(xml: string): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const html = convertToHtml(result);
          resolve(html);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function convertToHtml(obj: any): string {
  let html = "";

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any) => {
        html += convertElementToHtml(key, item);
      });
    } else if (typeof obj[key] === "object") {
      html += convertToHtml(obj[key]);
    }
  }

  return html;
}

function convertElementToHtml(tag: string, obj: any): string {
  let html = "";

  const tagname = fragmentMap[tag] || "p";
  const tagnameWithLevel =
    tagname === "h" ? `${tagname}${obj.$.level}` : tagname;
  html += `<${tagnameWithLevel}>`;

  if (typeof obj === "object") {
    if (obj._) {
      html += obj._;
    }
    html += convertToHtml(obj);
  } else {
    html += obj;
  }

  html += `</${tagnameWithLevel}>`;

  return html;
}

export default convertXmlToHtml;
