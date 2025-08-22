// const express = require("express");
// const app = express();
// const dbConnection = require("./config/dbConfig");
// const {
//   getUrlsofPage,

//   getInlinksOfPage,
// } = require("./controller/crawler.controller");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/out-links", getUrlsofPage);
// app.post("/in-links", getInlinksOfPage);

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

const express = require("express");
const app = express();
const dbConnection = require("./config/dbConfig");
const cheerio = require("cheerio");
const { default: axios } = require("axios");
const CrawledURL = require("./model/CrawledURL");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fetchSitemap = async () => {
  try {
    const { data } = await axios.get("https://www.edzy.ai/sitemap.xml");
    const $ = cheerio.load(data, { xmlMode: true });

    const urls = [];
    $("url").each((i, el) => {
      urls.push({
        loc: $(el).find("loc").text(),
        lastmod: $(el).find("lastmod").text(),
        changefreq: $(el).find("changefreq").text(),
      });
    });

    console.log(`Found ${urls.length} URLs in sitemap`);

    for (const urlObj of urls) {
      let outLinks = [];
      try {
        // Fetch page HTML
        const { data: pageHtml } = await axios.get(urlObj.loc, {
          timeout: 10000,
        });
        const $$ = cheerio.load(pageHtml);

        // Extract all <a href="...">
        $$("a").each((i, el) => {
          const link = $$(el).attr("href");
          if (link && link.startsWith("http")) {
            outLinks.push(link);
          }
        });
      } catch (err) {
        console.warn(`Failed to crawl page: ${urlObj.loc} - ${err.message}`);
      }

      // Save/Update in DB
      await CrawledURL.findOneAndUpdate(
        { url: urlObj.loc },
        {
          url: urlObj.loc,
          lastModified: urlObj.lastmod,
          changeFrequency: urlObj.changefreq || "daily",
          outLinks,
        },
        { upsert: true, new: true }
      );
    }

    return urls;
  } catch (error) {
    console.error("Error fetching sitemap:", error.message);
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sitemap", async (req, res) => {
  const urls = await fetchSitemap();
  res.json({ urls });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
