#!/usr/bin/env node
const { program } = require("commander");
const path = require("path");
const pkg = require("./package.json");

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument("<path>", "path to the sketch")
  .option("-r, --render <number>", "render $number of outputs", "");

program.parse();

const options = program.opts();
const sketchPath = program.args[0];
const fullSketchPath = path.join(__dirname, sketchPath);

console.log("atwo:", fullSketchPath, options);
