// This creates index.browser.js, index.es.js and index.js files from a template
// Run as 'node createFiles.js'

const fs = require("fs")
const main = fs.readFileSync("main.js", "utf8")
const lines = main.split("\n")

let index_browser = ["function computedVariables(", ...lines.slice(1)].join("\n")
let index_es = ["export default function(", ...lines.slice(1)].join("\n")
let index = ["module.exports = function(", ...lines.slice(1)].join("\n")

fs.writeFileSync("index.browser.js", index_browser, "utf8")
fs.writeFileSync("index.es.js", index_es, "utf8")
fs.writeFileSync("index.js", index, "utf8")

