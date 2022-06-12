const goodgraphicsTemplate = `
function draw(state = {}) {
  const svg = new goodgraphics({
    attributes: {
      fill: "white",
      style: "background: #eeeeee",
    },
    height: 400,
    width: 400,
  });

  svg.square(200 - 50, 200 - 50, 100, {
    fill: state.fill || "red",
    stroke: "1px",
  });

  svg.draw();
}

export default { draw };
`;

const p5Template = `
function setup(p5, state = {}) {
  p5.createCanvas(400, 400);
}

function draw(p5, state = {}) {
  p5.background(state.color || "pink");
  p5.circle(200, 200, state.size || 100);
}

export default { draw, setup };
`;

const trimTemplate = (template) =>
  template.charAt(0) === "\n" ? template.slice(1) : template;

const LIBRARIES = {
  p5: {
    extension: "p5",
    globalVariable: "p5",
    script: "https://unpkg.com/p5@1.4.1/lib/p5.min.js",
    template: trimTemplate(p5Template),
    renderFrameworkFile: (filename) => {
      const content = `
      import config from '../${filename}';

      // TODO: remove before v1
      console.log(config);

      const state = window.STATE || {};
      const p5Config = function (sketch) {
        sketch.setup = () => config.setup(sketch, state)
        sketch.draw = () => config.draw(sketch, state)
      };

      new p5(p5Config);
      `;

      return content;
    },
  },
  goodgraphics: {
    extension: "goodgraphics",
    globalVariable: "goodgraphics",
    script: "https://unpkg.com/goodgraphics@0.15.0/dist/goodgraphics.umd.js",
    template: trimTemplate(goodgraphicsTemplate),
    renderFrameworkFile: (filename) => {
      const content = `
      import config from '../${filename}';

      // TODO: remove before v1
      console.log(config);

      const state = window.STATE || {};

      config.draw(state);
      `;

      return content;
    },
  },
};

const VALID_LIBRARIES = Object.keys(LIBRARIES);
const DEFAULT_LIBRARY = "p5";

const getSketch = (filename) => {
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
  getSketch,
};
