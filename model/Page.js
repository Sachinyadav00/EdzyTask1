 
const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true, index: true },
  html: { type: String }, // raw HTML of the page
  outgoingLinks: [{ type: String }], // links this page points to
  incomingLinks: [{ type: String }], // links pointing TO this page
  crawledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Page", pageSchema);
