import * as commander from "commander";
import path from "path";
import pkg from "./package.json";

const { program } = commander;

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument("<path>", "path to the sketch")
  .option("-r, --render <number>", "render $number of outputs", "");

program.parse();

const options = program.opts();
const sketchPath = program.args[0];
const fullSketchPath = path.join(process.cwd(), sketchPath);

console.log("atwo.", fullSketchPath, options);
