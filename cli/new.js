import fs from "fs";
import path from "path";

import { DEFAULT_FILETYPE, FILE_TYPES } from "./utils";

const goodgraphicsTemplate = `
function sketch(svg, state) {
  // code here
}
`;

const p5Template = `
function sketch(p5, state) {
  // code here
}
`;

const templates = {
  p5: p5Template,
  goodgraphics: goodgraphicsTemplate,
};

const trimTemplate = (template) =>
  template.charAt(0) === "\n" ? template.slice(1) : template;

const command = (name, options) => {
  const fileType =
    options.type && FILE_TYPES.includes(options.type)
      ? options.type
      : DEFAULT_FILETYPE;
  const fileTemplate = trimTemplate(
    templates[fileType] || templates[DEFAULT_FILETYPE]
  );
  const fileName = `${name}.${fileType}.js`;
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFileSync(filePath, fileTemplate);

  console.log(`created: ${fileName}`);
};

export default command;
