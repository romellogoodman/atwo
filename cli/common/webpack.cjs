const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const TEMP_PATH = path.resolve(process.cwd(), ".atwo");

function getTemplateContent(sketch) {
  const { body = "", name, script = "" } = sketch;

  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>${name} | atwo</title>
    <link rel="icon" href="/public/favicon.png" type="image/png" />
    <style>
        * { margin: 0; }
    </style>
    ${script ? `<script src="${script}"></script>` : ""}
  </head>

  <body>
    ${body}
  </body>

  </html>
  `;
}

function createConfigFile(sketch) {
  const { filename } = sketch;
  const filepath = path.join(TEMP_PATH, `_config-${filename}`);

  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
  }

  if (fs.existsSync(filepath)) {
    fs.rmSync(filepath);
  }

  const content = `
    import config from '../${filename}';

    window.CONFIG = JSON.stringify(config);\n
    window.SKETCH = ${JSON.stringify(sketch)};\n
  `;

  fs.writeFileSync(filepath, content);

  return { filename, filepath };
}

function createFrameworkFile(sketch) {
  const { filename, renderFrameworkFile } = sketch;
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

function getWebpackConfig(sketch, options = { mode: "dev" }) {
  const { filename, library, name, renderFrameworkFile } = sketch;
  const mode = options.mode === "dev" ? "development" : "production";
  const isProduction = mode === "production";
  const { filepath: frameworkFile } = createFrameworkFile(sketch);
  const { filepath: stateFilePath } = createConfigFile(sketch);

  return {
    entry: {
      editor: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client"]),
        path.resolve(stateFilePath),
        path.resolve(__dirname, "../editor/app.jsx"),
      ],
      [name]: [
        ...(isProduction ? [] : ["webpack-hot-middleware/client?reload=true"]),
        path.resolve(__dirname, "../editor/state.js"),
        path.resolve(frameworkFile),
      ],
    },
    output: {
      publicPath: options.publicPath || "",
    },
    mode,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../assets/index.html"),
        title: `${name} | atwo`,
        chunks: ["editor"],
      }),
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        chunks: [name],
        templateContent: getTemplateContent(sketch),
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

module.exports = {
  getWebpackConfig,
};
