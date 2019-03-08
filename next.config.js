
// use "next-antd-aza-less" in .next.config.js

const antdLessLoader = require("next-antd-aza-less")

if (typeof require !== 'undefined') {
    require.extensions['.less'] = (file) => { }
}

/* Without CSS Modules, with PostCSS */
module.exports = antdLessLoader({
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
    }
});