const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");
const express = require("express");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const open = require("open");
const path = require("path");
const puppeteer = require("puppeteer");
const { MersenneTwister19937, Random } = require("random-js");
const seedrandom = require("seedrandom");
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

function inputMiddleware(req, res) {
  const seeder = seedrandom();
  const { controls = {} } = req.body || {};
  const seed = req.body.seed || seeder.int32();
  const random = new Random(MersenneTwister19937.seed(seed));
  const input = Object.keys(controls).reduce((result, key) => {
    const controlConfig = controls[key];

    if (Array.isArray(controlConfig)) {
      result[key] = random.pick(controlConfig);
      // I used to pick the first index
      // result[key] = controlConfig[0];
    } else {
      const { max, min, value } = controlConfig;

      if (typeof max !== "undefined" && typeof min !== "undefined") {
        (result[key] = random.integer(min, max)), 10;
      } else {
        result[key] = value;
      }
    }

    return result;
  }, {});

  input.seed = seed;

  res.json(input);
}

function exportMiddleware(options) {
  const { port, sketch, type: exportType } = options;

  return async function (req, res, next) {
    const { input, seed, url: sketchUrl } = req.body;
    const url = `http://localhost:${port}${sketchUrl}`;
    const folderPath = path.join(process.cwd(), "output");
    const exportFilename = `${sketch.name}${
      seed ? `-${seed}` : ""
    }.${exportType}`;
    const savePath = path.join(folderPath, exportFilename);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("open to", url);

    await page.setViewport({
      width: input.width,
      height: input.height,
    });
    await page.goto(url);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    if (exportType === "png") {
      await page.screenshot({ path: savePath });
    } else if (exportType === "svg") {
      const content = await page.content();
      const dom = new JSDOM(content);
      const markup = dom.window.document.querySelector("body").innerHTML;

      fs.writeFileSync(savePath, markup);
    }

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
  app.use(bodyParser.json());
  app.use(
    "/public",
    express.static(path.resolve(__dirname, "./assets/public"))
  );
  app.post("/input", inputMiddleware);
  app.post("/export/png", exportMiddleware({ port, sketch, type: "png" }));
  app.post("/export/svg", exportMiddleware({ port, sketch, type: "svg" }));

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
