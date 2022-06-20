const history = require("connect-history-api-fallback");
const express = require("express");
const fs = require("fs");
const open = require("open");
const path = require("path");
const puppeteer = require("puppeteer");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { getSketch } = require("./common/libraries.cjs");
const { getWebpackConfig } = require("./common/webpack.cjs");

const STATUS_IDLE = "idle";
const STATUS_STARTED = "started";

let status = STATUS_IDLE;

function statusMiddleware(req, res, next) {
  if (status === STATUS_STARTED) {
    next();
  } else {
    res.format({
      default: () =>
        res.sendFile(path.resolve(__dirname, "./assets/public/loading.html")),
      "image/png": () =>
        res.sendFile(path.resolve(__dirname, "./assets/public/favicon.png")),
      "text/html": () =>
        res.sendFile(path.resolve(__dirname, "./assets/public/loading.html")),
      "application/json": () => res.json({ loading: true, status }),
    });
  }
}

function renderMiddleware(options) {
  const { port, sketch } = options;

  return async function (req, res, next) {
    const { seed = "no-seed" } = req.query;
    const url = `http://localhost:${port}`;
    const sketchUrl = `${url}/${sketch.name}.html?seed=${seed}`;
    const folderPath = path.join(process.cwd(), "output");
    const imageName = `${sketch.filename}${seed ? `-${seed}` : ""}.png`;
    const savePath = path.join(folderPath, imageName);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("open to", sketchUrl);

    await page.goto(sketchUrl);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    await page.screenshot({ path: savePath });
    await browser.close();

    open(folderPath);

    res.json({ sketch, seed, url: sketchUrl });
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
  app.use(
    "/public",
    express.static(path.resolve(__dirname, "./assets/public"))
  );
  app.get("/render", renderMiddleware({ port, sketch }));

  await new Promise((resolve, reject) => {
    const server = app.listen(port, (error) => {
      if (error) {
        return reject(error);
      }

      if (options.open) {
        open(`http://localhost:${port}`);
      }

      return resolve({ server });
    });
  });

  const webpackConfig = getWebpackConfig(sketch, { mode: "dev" });
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
