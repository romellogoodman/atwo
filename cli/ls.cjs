const columns = require("cli-columns");
const fs = require("fs");

const utils = require("./utils.cjs");

const { VALID_LIBRARIES } = utils;

const command = (options) => {
  let files = fs.readdirSync(process.cwd());

  files = files.filter((name) => name.endsWith(".js"));

  if (options.filter && VALID_LIBRARIES.includes(options.filter)) {
    const fileExtension = `.${options.filter}.js`;

    files = files.filter((name) => name.includes(fileExtension));
  }

  console.log(columns(files));
};

module.exports = command;
