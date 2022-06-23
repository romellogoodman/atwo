const trimTemplate = (template) =>
  template.charAt(0) === "\n" ? template.slice(1) : template;

const LIBRARIES = {
  canvas: {
    extension: "canvas",
    body: `<canvas width="400" height="400" id="canvas"></canvas>`,
    template: trimTemplate(`
      function draw(state = {}) {}

      export default {
        name: "_template-canvas",
        draw,
        height: 400,
        width: 400,
      };
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
  p5: {
    extension: "p5",
    script: "/public/p5.min.js",
    // script: "https://unpkg.com/p5@1.4.1/lib/p5.min.js",
    template: trimTemplate(`
      function setup(p5, state = {}) {
        p5.createCanvas(state.width, state.height);
      }

      function draw(p5, state = {}) {
        p5.background("white");
        p5.fill(state.color || "pink")
        p5.circle(state.width / 2, state.height / 2, state.size || 100);
      }

      export default {
        name: "_template-p5",
        draw,
        setup,
        height: 400,
        width: 400,
      };
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
    script: "/public/goodgraphics.js",
    // script: "https://unpkg.com/goodgraphics@0.15.0/dist/goodgraphics.umd.js",
    template: trimTemplate(`
      function draw(state = {}) {
        const svg = new goodgraphics({
          attributes: {
            fill: "white",
            style: "background: #eeeeee",
          },
          height: state.height,
          width: state.width,
        });

        const smallerSide = Math.min(state.width, state.height);

        svg.circle(state.width / 2, state.height / 2, smallerSide / 4, {
          fill: state.fill || "red",
          stroke: "1px",
        });

        svg.draw();
      }

      export default {
        name: "_template-goodgraphics",
        draw,
        height: 400,
        width: 400,
      };
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
