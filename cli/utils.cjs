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

const LIBRARIES = {
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

const VALID_LIBRARIES = Object.keys(LIBRARIES);
const DEFAULT_LIBRARY = "p5";

const parseFilename = (filename) => {
  // filename.type.ext, i.e hello.p5.js
  const [name, library = "p5", extension = "js"] = filename.split(".");
  const _filename = [name, library, extension].join(".");
  const sketch = {
    ...(LIBRARIES[library] || LIBRARIES[DEFAULT_LIBRARY]),
    filename: _filename,
    name,
    library,
    extension,
  };

  return sketch;
};

module.exports = {
  DEFAULT_LIBRARY,
  VALID_LIBRARIES,
  parseFilename,
};
