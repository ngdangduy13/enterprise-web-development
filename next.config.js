// use "next-antd-aza-less" in .next.config.js

const withCSS = require("@zeit/next-css");

if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

/* Without CSS Modules, with PostCSS */
module.exports = withCSS({
  target: 'serverless',
  webpack: function(config, { dev }) {
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  }
});
