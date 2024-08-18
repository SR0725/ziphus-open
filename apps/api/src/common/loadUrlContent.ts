import puppeteer, { Browser } from "puppeteer";
import delay from "./delay";

let localBrowser: Browser;

const BROWERSERLESS_ENDPOINT = process.env.BROWERSERLESS_ENDPOINT;

async function loadByLocalBrowserService(url: string) {
  localBrowser = localBrowser ? localBrowser : await puppeteer.launch();
  const page = await localBrowser.newPage();
  await page.goto(url, { waitUntil: "load" });
  await delay(1000);
  const html = await page.content();
  await page.close();
  return html;
}

async function loadUrlContentWithBrowserless(url: string) {
  const response = await fetch(BROWERSERLESS_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      waitForTimeout: 1000,
    }),
  });
  const html = await response.text();

  return html;
}

export default async function loadUrlContent(url: string) {
  if (BROWERSERLESS_ENDPOINT) {
    return loadUrlContentWithBrowserless(url);
  } else {
    return loadByLocalBrowserService(url);
  }
}
