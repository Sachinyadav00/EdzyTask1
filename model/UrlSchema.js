const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    outlinks: [
      {
        text: {
          type: String,
          trim: true,
        },
        href: {
          type: String,
          trim: true,
        },
        absoluteURL: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
