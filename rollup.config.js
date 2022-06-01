import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "cli.js",
  output: {
    banner: "#!/usr/bin/env node",
    dir: "dist",
    format: "umd",
  },
  plugins: [nodeResolve(), commonjs(), json()],
};
