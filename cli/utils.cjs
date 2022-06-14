const trimTemplate = (template) =>
  template.charAt(0) === "\n" ? template.slice(1) : template;

const LIBRARIES = {
  canvas: {
    extension: "canvas",
    body: `<canvas width="400" height="400" id="canvas"></canvas>`,
    template: trimTemplate(``),
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
  p5: {
    extension: "p5",
    script: "https://unpkg.com/p5@1.4.1/lib/p5.min.js",
    template: trimTemplate(`
      function setup(p5, state = {}) {
        p5.createCanvas(400, 400);
      }

      function draw(p5, state = {}) {
        p5.background(state.color || "pink");
        p5.circle(200, 200, state.size || 100);
      }

      export default { draw, setup };
    `),
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
    script: "https://unpkg.com/goodgraphics@0.15.0/dist/goodgraphics.umd.js",
    template: trimTemplate(`
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
    `),
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
