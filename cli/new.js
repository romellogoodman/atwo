import fs from "fs";
import path from "path";
import { getFileType } from "./utils";

const command = (name, options) => {
  const { extension, template } = getFileType(options.type);
  const fileName = `${name}.${extension}.js`;
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFileSync(filePath, template);

  console.log(`created: ${fileName}`);
};

export default command;
