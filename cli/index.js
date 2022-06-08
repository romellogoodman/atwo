import * as commander from "commander";

import devCMD from "./dev";
import galleryCMD from "./gallery";
import lsCMD from "./ls";
import newCMD from "./new";
import renderCMD from "./render";
import { DEFAULT_FILETYPE, FILE_TYPES } from "./utils";
import pkg from "../package.json";

const { program } = commander;

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the current version");

program
  .command("dev")
  .argument("<name>", "name of the sketch")
  .option(
    "-p, --port <port>",
    "port number on which to start the server",
    "3000"
  )
  .option("-o, --open", "open the browser once the server is started")
  .action(devCMD);

// program
//   .command("gallery")
//   .option(
//     "-f, --filter <type>",
//     `type of file to filter: ${FILE_TYPES.join(",")}`
//   )
//   .action(galleryCMD);

program
  .command("ls")
  .option(
    "-f, --filter <type>",
    `type of file to filter: ${FILE_TYPES.join(",")}`
  )
  .action(lsCMD);

program
  .command("new")
  .argument("<name>", "name of the sketch")
  .option("-t, --type <type>", "type of file to create", DEFAULT_FILETYPE)
  .action(newCMD);

// program
//   .command("render")
//   .argument("<name>", "name of the sketch")
//   .option("-n, --number <number>", "render $number of outputs", "8")
//   .action(renderCMD);

program.parse();
