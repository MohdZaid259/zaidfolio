const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build/start use its own folder while `next dev` keeps using .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack(config) {
    // @splinetool/react-spline only exports an "import" condition, which webpack's
    // server build can't resolve; point straight at the client component file.
    config.resolve.alias["@splinetool/react-spline$"] = path.join(
      __dirname,
      "node_modules/@splinetool/react-spline/dist/react-spline.js",
    );
    return config;
  },
};

module.exports = nextConfig;
