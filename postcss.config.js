/* eslint-disable @typescript-eslint/no-var-requires */
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss-import");

module.exports = {
	plugins: [postcss, tailwindcss("./tailwind.config.js"), autoprefixer]
};