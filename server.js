const express = require("express");

const dbConnection = require("./config/dbConfig");
const { UrlInsidePage } = require("./controller/crawler.controller");

const app = express();

app.get("/", UrlInsidePage("https://www.edzy.ai/sitemap.xml"));

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
