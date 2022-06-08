const columns = require("cli-columns");
const fs = require("fs");

const utils = require("./utils.cjs");

const { FILE_TYPES } = utils;

const command = (options) => {
  let files = fs.readdirSync(process.cwd());

  files = files.filter((name) => name.endsWith(".js"));

  if (options.filter && FILE_TYPES.includes(options.filter)) {
    const fileExtension = `.${options.filter}.js`;

    files = files.filter((name) => name.includes(fileExtension));
  }

  console.log(columns(files));
};

module.exports = command;
