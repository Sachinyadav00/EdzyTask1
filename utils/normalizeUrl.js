// utils/normalizeUrl.js
function normalizeUrl(rawUrl) {
    try {
      const urlObj = new URL(rawUrl);
      let normalized = urlObj.origin + urlObj.pathname;
  
      if (normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
      }
      return normalized.toLowerCase();
    } catch {
      return rawUrl;
    }
  }
  
  module.exports = { normalizeUrl };
  