#!/usr/bin/env node
const { program, Option } = require("commander");

const devCMD = require("./dev.cjs");
const newCMD = require("./new.cjs");
const { DEFAULT_LIBRARY, VALID_LIBRARIES } = require("./common/libraries.cjs");
const pkg = require("../package.json");

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the current version");

program
  .command("dev")
  .description("Start the dev server and render the sketch")
  .argument("<filename>", "name of the sketch")
  .option(
    "-p, --port <port>",
    "port number on which to start the server",
    "3000"
  )
  .option("-o, --open", "open the browser once the server is started")
  .action(devCMD);

program
  .command("new")
  .description("Create a new sketch")
  .argument("<filename>", "name of the sketch")
  .addOption(
    new Option("-l, --lib <library>", "the coding library of the script")
      .default(DEFAULT_LIBRARY)
      .choices(VALID_LIBRARIES)
  )
  .action(newCMD);

program.parse();
