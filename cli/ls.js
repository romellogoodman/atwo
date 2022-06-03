import columns from "cli-columns";
import fs from "fs";

const command = (options) => {
  let files = fs.readdirSync(process.cwd());

  // Note: Check options.filter against array of valid file types
  if (options.filter) {
    const fileExtension = `.${options.filter}.js`;

    files = files.filter((name) => name.includes(fileExtension));
  }

  console.log(columns(files));
};

export default command;
