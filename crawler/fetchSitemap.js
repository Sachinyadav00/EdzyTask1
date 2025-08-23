// crawler/fetchSitemap.js
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchSitemap(sitemapUrl) {
  try {
    const { data } = await axios.get(sitemapUrl);
    const $ = cheerio.load(data, { xmlMode: true });

    const urls = [];
    $("url").each((i, el) => {
      urls.push({
        url: $(el).find("loc").text().trim(),
        lastModified: $(el).find("lastmod").text().trim(),
        changeFrequency: $(el).find("changefreq").text().trim(),
      });
    });

    console.log("✅ Extracted URLs:", urls.length);
    return urls;
  } catch (err) {
    console.error("❌ Failed to fetch sitemap:", err.message);
    return [];
  }
}

module.exports = { fetchSitemap };
