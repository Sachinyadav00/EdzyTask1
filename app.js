const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const html = fs.readFileSync("edzy.html", "utf8");
const base = "https://www.edzy.ai";

const $ = cheerio.load(html);

const urls = [];

$("a").each((i, el) => {
  const href = $(el).attr("href");
  const title = $(el).html();
  if (href) {
    const absUrl = new URL(href, base).href; // makes it absolute
    urls.push(absUrl);
  }
});

console.log(urls, title);
