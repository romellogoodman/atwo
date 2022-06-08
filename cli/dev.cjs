const history = require("connect-history-api-fallback");
const express = require("express");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const STATUS_IDLE = "idle";
const STATUS_STARTED = "started";

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

function getWebpackConfig(options) {
  const { filePath, fileType, fileName, mode: modeParameter } = options;
  const mode = modeParameter === "dev" ? "development" : "production";
  const isProduction = mode === "production";
  const sketch = { filePath, fileType, fileName };

  return {
    entry: {
      easel: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client"]),
        path.resolve(__dirname, "./easel/index.jsx"),
      ],
      [fileName]: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client?reload=true"]),
        filePath,
      ],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "",
    },
    mode,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./assets/index.html"),
        chunks: ["easel"],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./assets/${fileType}.html`),
        filename: `${fileName}.html`,
        chunks: [fileName],
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

const command = async (name, options) => {
  const port = options.port || 3000;
  const [fileName, fileType] = name.split(".");
  const filePath = path.join(process.cwd(), name);
  const config = { filePath, fileType, fileName, mode: options.mode || "dev" };

  if (!fs.existsSync(filePath)) {
    console.log(`Cannot find file: ${name}. Path: ${filePath}`);
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

  const webpackConfig = getWebpackConfig(config);
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
    `Running at 0.0.0.0:${port}, url: http://localhost:${port}\n\nAll other logs are from webpack (it bundles your code). Press CTRL+C to stop the server.\n`
  );
};

module.exports = command;
