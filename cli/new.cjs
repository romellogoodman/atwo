const fs = require("fs");
const path = require("path");

const utils = require("./utils.cjs");

const { FILE_TYPES } = utils;

const command = (name, options) => {
  const { extension, template } = getFileType(options.type);
  const fileName = `${name}.${extension}.js`;
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFileSync(filePath, template);

  console.log(`created: ${fileName}`);
};

module.exports = command;
