const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastModified: {
      type: Date,
    },
    changeFrequency: {
      type: String,
      enum: [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ],
      default: "daily",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
