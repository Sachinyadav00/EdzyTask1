// crawler/crawlPage.js
const axios = require("axios");
const cheerio = require("cheerio");
const Page = require("../model/Page");
const urlLib = require("url");

const BASE_DOMAIN = "edzy.ai";

async function crawlPage({ url, lastModified, changeFrequency }) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript")) return;

      const absoluteUrl = urlLib.resolve(url, href);
      const type = absoluteUrl.includes(BASE_DOMAIN) ? "internal" : "external";
      links.push({ url: absoluteUrl, type });
    });

    const page = await Page.findOneAndUpdate(
      { url },
      {
        url,
        // html,
        outgoingLinks: links,
        lastModified: lastModified ? new Date(lastModified) : null,
        changeFrequency: changeFrequency || null,
        lastCrawledAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return page;
  } catch (err) {
    console.error(`❌ Failed to crawl ${url}:`, err.message);
  }
}

module.exports = { crawlPage };
