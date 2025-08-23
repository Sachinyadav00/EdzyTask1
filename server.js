const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { fetchSitemap } = require("./crawler/fetchSitemap");
const { crawlPage } = require("./crawler/crawlPage");
const { buildIncomingLinks } = require("./crawler/buildIncomingLinks");
const crawlerRoutes = require("./routes/crawler.routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, { dbName: "edzyCrawler" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

app.use("/crawler", crawlerRoutes);

async function crawlSitemapAndPages() {
  console.log("🌍 Fetching sitemap...");
  const urls = await fetchSitemap();

  for (const pageData of urls) {
    await crawlPage(pageData); // pageData = {url, lastModified, changeFrequency}
  }

  await buildIncomingLinks();
}

// crawlSitemapAndPages();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
