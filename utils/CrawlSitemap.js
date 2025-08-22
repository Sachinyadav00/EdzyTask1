// crawlSitemap.js
const axios = require("axios");
const xml2js = require("xml2js");
const { crawlPage } = require("./crawler");

async function crawlSitemap(sitemapUrl) {
  const response = await axios.get(sitemapUrl);
  const xml = response.data;

  const result = await xml2js.parseStringPromise(xml);
  const urls = result.urlset.url.map((u) => u.loc[0]);

  for (const url of urls) {
    await crawlPage(url);
  }
}

module.exports = { crawlSitemap };
