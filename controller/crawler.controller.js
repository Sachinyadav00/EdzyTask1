const axios = require("axios");
const cheerio = require("cheerio");
const Url = require("../model/UrlSchema");
const Inlink = require("../models/inlink");

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
          absoluteURL: new URL(href, url).href,
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

const getInlinksOfPage = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Find all inlink docs where targetUrl = requested url
    const inlinks = await Inlink.find({ targetUrl: url });

    return res.json({
      targetUrl: url,
      inlinksCount: inlinks.length,
      inlinks: inlinks.map((link) => ({
        fromUrl: link.fromUrl,
        anchorText: link.anchorText,
      })),
    });
  } catch (error) {
    console.error("Error finding inlinks:", error.message);
    return res.status(500).json({ error: "Failed to fetch inlinks" });
  }
};

module.exports = { getUrlsofPage, getInlinksOfPage };
