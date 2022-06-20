const express = require("express");
const fs = require("fs");
const open = require("open");
const path = require("path");
const puppeteer = require("puppeteer");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const { getSketch } = require("./common/libraries.cjs");
const { getWebpackConfig } = require("./common/webpack.cjs");

const command = async (filenameParam, options) => {
  const port = 8080;
  const url = `http://localhost:${port}`;
  const app = express();

  app.use(
    "/public",
    express.static(path.resolve(__dirname, "./assets/public"))
  );

  const sketch = getSketch(filenameParam);
  const webpackConfig = getWebpackConfig(sketch, {
    filename: "[name].js",
    mode: "production",
  });
  const compiler = await webpack(webpackConfig);

  console.log("compile start");

  await new Promise((resolve) => {
    compiler.run((err, stats) => {
      // console.log("compile end", stats);
      console.log("compile end");
      resolve();

      compiler.close((closeErr) => {});
    });
  });

  // app.use(
  //   webpackDevMiddleware(compiler, {
  //     publicPath: webpackConfig.output.publicPath,
  //   })
  // );

  app.listen(port, (error) => {
    if (error) {
      console.log(error);
    }

    console.log(`server listening at: ${url}`);
  });

  const { number, seed = "foo" } = options;
  const sketchUrl = `${url}/${filenameParam}.html?seed=${seed}`;
  const folderPath = path.join(process.cwd(), "output");
  const savePath = path.join(folderPath, `${filenameParam}.png`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(sketchUrl);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  await page.screenshot({ path: savePath });
  await browser.close();

  open(folderPath);
};

module.exports = command;
