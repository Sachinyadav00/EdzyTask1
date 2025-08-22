const axios = require("axios");
const cheerio = require("cheerio");
const Url = require("../model/UrlSchema");

const UrlInsidePage = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    const $ = cheerio.load(response.data);
    const links = [];

    $("a[href]").each((index, element) => {
      const href = $(element).attr("href");
      if (href && !links.includes(href)) {
        links.push(href);
      }
    });

    // Save the URL to the database
    const urlDoc = new Url({ url });
    await urlDoc.save();

    return res.status(200).json({ links });
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ error: "Failed to fetch URL" });
  }
};

module.exports = { UrlInsidePage };
