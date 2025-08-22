const mongoose = require("mongoose");

const totalUrls = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  lastModified: {
    type: String,
    trim: true,
  },
  changeFrequency: {
    type: String,
    default: "daily",
  },
  outLinks: [
    {
      type: String, 
      trim: true,
    },
  ],
});

module.exports = mongoose.model("CrawledURL", totalUrls);
