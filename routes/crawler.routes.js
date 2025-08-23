// routes/crawler.routes.js
const express = require("express");
const router = express.Router();
const Page = require("../model/Page");
const { fetchSitemap } = require("../crawler/fetchSitemap");
const {crawlPage} = require("../crawler/crawlPage");
const {buildIncomingLinks} = require("../crawler/buildIncomingLinks");


// 0 crawl all url's

/* v1
router.post("/recrawl", async (req, res) => {
  try {
    const urls = await fetchSitemap();

    for (const pageData of urls) {
      await crawlPage(pageData);
    }

    await buildIncomingLinks();

    res.json({
      message: "✅ Sitemap recrawled successfully",
      count: urls.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

*/

/*v2*/
router.post("/recrawl", async (req, res) => {
    try {
      const { sitemapUrl } = req.body;
      if (!sitemapUrl) {
        return res.status(400).json({ error: "sitemapUrl is required" });
      }
  
      // Fetch sitemap URLs
      const urls = await fetchSitemap(sitemapUrl);
  
      // Respond immediately
      res.json({ message: "✅ Sitemap crawl started", totalUrls: urls.length });
  
      // Fire-and-forget crawl
      (async () => {
        for (const pageData of urls) {
          await crawlPage(pageData);
        }
        await buildIncomingLinks();
        console.log("✅ Sitemap crawl completed");
      })();
    } catch (err) {
      console.error("❌ Recrawl error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  



// 1. Incoming links
router.post("/incoming", async (req, res) => {
  const { url } = req.body;
  const page = await Page.findOne({ url });
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json({ url: page.url, incomingLinks: page.incomingLinks });
});

// 2. Outgoing links
router.post("/outgoing", async (req, res) => {
  const { url } = req.body;
  const page = await Page.findOne({ url });
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json({ url: page.url, outgoingLinks: page.outgoingLinks });
});

// 3. Top N most linked pages
router.post("/top-linked", async (req, res) => {
  const { n } = req.body;
  const pages = await Page.aggregate([
    { $project: { url: 1, incomingCount: { $size: "$incomingLinks" } } },
    { $sort: { incomingCount: -1 } },
    { $limit: parseInt(n) || 10 },
  ]);
  res.json(pages);
});

module.exports = router;
