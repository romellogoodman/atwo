const fs = require("fs");
const path = require("path");

const utils = require("./utils.cjs");

const { getSketch, VALID_LIBRARIES } = utils;

const command = (name, options) => {
  let sketchName = `${name}`;

  if (VALID_LIBRARIES.includes(options.lib)) sketchName += `.${options.lib}.js`;

  const { filename, template } = getSketch(sketchName);
  const filePath = path.join(process.cwd(), filename);

  fs.writeFileSync(filePath, template);

  console.log(`created: ${filename}`);
};

module.exports = command;
