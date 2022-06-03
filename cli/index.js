import * as commander from "commander";

import devCMD from "./dev";
import galleryCMD from "./gallery";
import lsCMD from "./ls";
import newCMD from "./new";
import renderCMD from "./render";
import { FILE_TYPES } from "./utils";
import pkg from "../package.json";

const { program } = commander;

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the current version");

program.command("dev").argument("<path>", "path to the sketch").action(devCMD);

program
  .command("gallery")
  .option(
    "-f, --filter <type>",
    `type of file to filter: ${FILE_TYPES.join(",")}`
  )
  .action(galleryCMD);

program
  .command("ls")
  .option(
    "-f, --filter <type>",
    `type of file to filter: ${FILE_TYPES.join(",")}`
  )
  .action(lsCMD);

program
  .command("new")
  .option("-t, --type <type>", "type of file to create", FILE_TYPES[0])
  .action(newCMD);

program
  .command("render")
  .argument("<path>", "path to the sketch")
  .option("-n, --number <number>", "render $number of outputs", "8")
  .action(renderCMD);

program.parse();
