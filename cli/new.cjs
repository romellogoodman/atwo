const fs = require("fs");
const path = require("path");

const utils = require("./utils.cjs");

const { FILE_TYPES } = utils;

const command = (name, options) => {
  const { extension, template } = getFileType(options.type);
  const filename = `${name}.${extension}.js`;
  const filePath = path.join(process.cwd(), filename);

  fs.writeFileSync(filePath, template);

  console.log(`created: ${filename}`);
};

module.exports = command;
