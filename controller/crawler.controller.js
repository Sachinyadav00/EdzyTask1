const axios = require("axios");
const cheerio = require("cheerio");
const Url = require("../model/UrlSchema");

const getUrlsofPage = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Fetch page
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Collect links
    const links = [];
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();

      if (href) {
        links.push({
          text: text || "(no text)",
          href: href,
          absoluteURL: new URL(href, url).href, // ✅ matches schema
        });
      }
    });

    // Save to DB
    const savedDoc = await Url.create({
      url,
      outlinks: links,
    });

    // Return saved doc
    return res.json(savedDoc);
  } catch (error) {
    console.error("Error crawling:", error.message);
    return res.status(500).json({ error: "Failed to crawl the URL" });
  }
};

module.exports = { getUrlsofPage };
