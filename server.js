const express = require("express");
const app = express();
const dbConnection = require("./config/dbConfig");
const {
  UrlInsidePage,
  getUrlsofPage,
  OutURL,
} = require("./controller/crawler.controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/out-links", getUrlsofPage);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
