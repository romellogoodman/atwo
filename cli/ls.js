import columns from "cli-columns";
import fs from "fs";

import { FILE_TYPES } from "./utils";

const command = (options) => {
  let files = fs.readdirSync(process.cwd());

  files = files.filter((name) => name.endsWith(".js"));

  if (options.filter && FILE_TYPES.includes(options.filter)) {
    const fileExtension = `.${options.filter}.js`;

    files = files.filter((name) => name.includes(fileExtension));
  }

  console.log(columns(files));
};

export default command;
