// crawler.js
const axios = require("axios");
const cheerio = require("cheerio");
const Page = require("./models/Page");

async function crawlPage(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract all links
    const links = [];
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href) {
        links.push(href);
      }
    });

    // Save to DB (upsert so duplicates are avoided)
    const page = await Page.findOneAndUpdate(
      { url },
      { url, html, outgoingLinks: links, crawledAt: new Date() },
      { upsert: true, new: true }
    );

    // Update incoming links for targets
    for (let link of links) {
      await Page.findOneAndUpdate(
        { url: link },
        { $addToSet: { incomingLinks: url } },
        { upsert: true }
      );
    }

    return page;
  } catch (err) {
    console.error(`Error crawling ${url}:`, err.message);
  }
}

module.exports = { crawlPage };
