// crawler/buildIncomingLinks.js
const Page = require("../model/Page");
const { normalizeUrl } = require("../utils/normalizeUrl");

async function buildIncomingLinks() {
  console.log("🔄 Building incoming links...");

  const pages = await Page.find();

  // Reset incoming links
  await Page.updateMany({}, { $set: { incomingLinks: [] } });

  for (const page of pages) {
    for (const link of page.outgoingLinks) {
      if (link.type === "internal") {
        const normalized = normalizeUrl(link.url);

        await Page.updateOne(
          { url: normalized },
          { $push: { incomingLinks: normalizeUrl(page.url) } }
        );
      }
    }
  }

  console.log("✅ Incoming links updated");
}

module.exports = { buildIncomingLinks };
