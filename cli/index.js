import * as commander from "commander";

import devCMD from "./dev";
import galleryCMD from "./gallery";
import lsCMD from "./ls";
import newCMD from "./new";
import renderCMD from "./render";
import pkg from "../package.json";

const { program } = commander;

const TYPES = ["p5", "goodgraphics"];

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.command("dev").argument("<path>", "path to the sketch").action(devCMD);

program
  .command("gallery")
  .option("-f, --filter <type>", `type of file to filter: ${TYPES.join(",")}`)
  .action(galleryCMD);

program
  .command("ls")
  .option("-f, --filter <type>", `type of file to filter: ${TYPES.join(",")}`)
  .action(lsCMD);

program
  .command("new")
  .option("-t, --type <type>", "type of file to create", TYPES[0])
  .action(newCMD);

program
  .command("render")
  .argument("<path>", "path to the sketch")
  .option("-n, --number <number>", "render $number of outputs", "8")
  .action(renderCMD);

program.parse();
