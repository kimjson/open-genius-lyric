const path = require("path");
const WebExtPlugin = require('web-ext-plugin');

const sourceDir = path.resolve(__dirname, "addon");

module.exports = {
    mode: 'production',
    entry: {
        background: "./background.js",
        content: "./content.js",
    },
    output: {
        path: sourceDir,
        filename: "[name]/index.js"
    },
    plugins: [new WebExtPlugin({sourceDir, browserConsole: true})],
};
