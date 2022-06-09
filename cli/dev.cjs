const history = require("connect-history-api-fallback");
const express = require("express");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const utils = require("./utils.cjs");

const { getSketch } = utils;

const STATUS_IDLE = "idle";
const STATUS_STARTED = "started";
const TEMP_PATH = path.resolve(process.cwd(), ".atwo");

let status = STATUS_IDLE;

function statusMiddleware(req, res, next) {
  if (status === STATUS_STARTED) {
    next();
  } else {
    res.format({
      default: () =>
        res.sendFile(path.resolve(__dirname, "./assets/loading.html")),
      "image/png": () =>
        res.sendFile(path.resolve(__dirname, "./assets/favicon.png")),
      "text/html": () =>
        res.sendFile(path.resolve(__dirname, "./assets/loading.html")),
      "application/json": () => res.json({ loading: true, status }),
    });
  }
}

function getTemplateContent(sketch) {
  const { name, script } = sketch;

  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>${name} | atwo</title>
    <link rel="icon" href="./favicon.png" type="image/png" />
    <script src="${script}"></script>
  </head>

  <body>
    <div id="root"></div>
  </body>

  </html>
  `;
}

function createFrameworkFile(filename, renderFrameworkFile) {
  const filepath = path.join(TEMP_PATH, filename);

  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
  }

  if (fs.existsSync(filepath)) {
    fs.rmSync(filepath);
  }

  const content = renderFrameworkFile(filename);

  fs.writeFileSync(filepath, content);

  return { filename, filepath };
}

function getWebpackConfig(sketch, modeParam) {
  const { filename, library, name, renderFrameworkFile } = sketch;
  const mode = modeParam === "dev" ? "development" : "production";
  const isProduction = mode === "production";
  const { filepath: tempFilepath } = createFrameworkFile(
    filename,
    renderFrameworkFile
  );

  return {
    entry: {
      easel: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client"]),
        path.resolve(__dirname, "./easel/index.jsx"),
      ],
      [name]: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client?reload=true"]),
        path.resolve(tempFilepath),
      ],
    },
    output: {
      publicPath: "",
    },
    mode,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./assets/index.html"),
        chunks: ["easel"],
      }),
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        chunks: [name],
        templateContent: getTemplateContent(sketch),
      }),
      new webpack.BannerPlugin({
        include: "easel",
        banner: `window.SKETCH = ${JSON.stringify(sketch)};\n`,
        entryOnly: true,
        raw: true,
      }),
      ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: ["last 2 versions", "ie >= 11"],
                    },
                    modules: false,
                  },
                ],
              ],
              plugins: [
                "react-hot-loader/babel",
                "@babel/plugin-transform-runtime",
              ],
              env: {
                test: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          },
        },
      ],
    },
  };
}

const command = async (filenameParam, options) => {
  const port = options.port || 3000;
  const sketch = getSketch(filenameParam);
  const { filename, name } = sketch;
  const filepath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filepath)) {
    console.log(`Cannot find file: ${name}. Path: ${filepath}`);
    process.exit(1);
  }

  const app = express();

  app.use(statusMiddleware);
  app.get("/favicon.png", (req, res) =>
    res.sendFile(path.resolve(__dirname, "./assets/favicon.png"))
  );

  await new Promise((resolve, reject) => {
    const server = app.listen(port, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve({ server });
    });
  });

  const webpackConfig = getWebpackConfig(sketch, options.mode || "dev");
  const compiler = webpack(webpackConfig);

  // https://stackoverflow.com/questions/43921770/webpack-dev-middleware-pass-through-for-all-routes
  app.use(history());

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler, { log: null }));

  status = STATUS_STARTED;

  console.log(
    `Running at 0.0.0.0:${port}, url: http://localhost:${port}\n\nAll other logs are from webpack. Press CTRL+C to stop the server.\n`
  );
};

module.exports = command;
