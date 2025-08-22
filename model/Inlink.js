const mongoose = require("mongoose");

const inlinkSchema = new mongoose.Schema(
  {
    targetUrl: {
      type: String, // the page being linked TO
      required: true,
      trim: true,
    },
    fromUrl: {
      type: String, // the page linking OUT
      required: true,
      trim: true,
    },
    anchorText: {
      type: String, // optional: text of the link
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inlink", inlinkSchema);
