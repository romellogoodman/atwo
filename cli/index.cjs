#!/usr/bin/env node
const commander = require("commander");

const devCMD = require("./dev.cjs");
const galleryCMD = require("./gallery.cjs");
const lsCMD = require("./ls.cjs");
const newCMD = require("./new.cjs");
const renderCMD = require("./render.cjs");
const { DEFAULT_FILETYPE, FILE_TYPES } = require("./utils.cjs");
const pkg = require("../package.json");

const { program } = commander;

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the current version");

program
  .command("dev")
  .argument("<filename>", "name of the sketch")
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
//   .argument("<filename>", "name of the sketch")
//   .option("-n, --number <number>", "render $number of outputs", "8")
//   .action(renderCMD);

program.parse();
