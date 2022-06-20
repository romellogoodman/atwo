const fs = require("fs");
const open = require("open");
const path = require("path");
const puppeteer = require("puppeteer");

const { getSketch } = require("./common/libraries.cjs");

const command = async (filenameParam, options) => {
  const { number, seed = "foo" } = options;

  const port = options.port || 3000;
  const url = `http://localhost:${port}`;

  const sketch = getSketch(filenameParam);
  const { filename, name } = sketch;

  console.log("-", sketch);

  const sketchUrl = `${url}/${sketch.name}.html?seed=${seed}`;
  const folderPath = path.join(process.cwd(), "output");
  const savePath = path.join(folderPath, `${filenameParam}.png`);
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
};

module.exports = command;
