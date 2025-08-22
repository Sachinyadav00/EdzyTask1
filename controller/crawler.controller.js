const axios = require("axios");
const cheerio = require("cheerio");
const Url = require("../model/UrlSchema");

async function UrlInsidePage(sitemapUrl) {
  try {
    const { data } = await axios.get(sitemapUrl);
    const $ = cheerio.load(data, { xmlMode: true });

    const urls = [];
    $("url").each((i, el) => {
      urls.push({
        url: $(el).find("loc").text(),
        lastModified: $(el).find("lastmod").text(),
        changeFrequency: $(el).find("changefreq").text(),
      });
    });

    for (const urlObj of urls) {
      await Url.findOneAndUpdate({ url: urlObj.url }, urlObj, {
        upsert: true,
        new: true,
      });
    }

    return urls;
  } catch (error) {
    console.error("❌ Error fetching sitemap:", error);
    throw error;
  }
}

module.exports = { UrlInsidePage };
