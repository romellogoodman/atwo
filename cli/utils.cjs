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

const trimTemplate = (template) =>
  template.charAt(0) === "\n" ? template.slice(1) : template;

const fileTypes = {
  p5: {
    extension: "p5",
    globalVariable: "p5",
    script: "https://unpkg.com/p5@1.4.1/lib/p5.min.js",
    template: trimTemplate(p5Template),
  },
  goodgraphics: {
    extension: "goodgraphics",
    globalVariable: "goodgraphics",
    script: "https://unpkg.com/goodgraphics@0.15.0/dist/goodgraphics.js",
    template: trimTemplate(goodgraphicsTemplate),
  },
};

const FILE_TYPES = Object.keys(fileTypes);
const DEFAULT_FILETYPE = "p5";

const extractFileType = (name) => {
  // filename.type.ext, i.e hello.p5.js
  const splitName = name.split(".");

  return splitName[1];
};

const getFileType = (type) => {
  return fileTypes[type] || fileTypes[DEFAULT_FILETYPE];
};

module.exports = {
  FILE_TYPES,
  DEFAULT_FILETYPE,
  extractFileType,
  getFileType,
};
