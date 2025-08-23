// model/Page.js
const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["internal", "external"], required: true },
});

const pageSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true },
  // html: { type: String },
  outgoingLinks: [linkSchema],
  incomingLinks: [{ type: String }],
  lastModified: { type: Date }, // <lastmod> from sitemap
  changeFrequency: { type: String }, // <changefreq> from sitemap
  lastCrawledAt: { type: Date, default: Date.now },
});

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
