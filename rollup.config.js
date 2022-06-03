import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "cli/index.js",
  output: {
    banner: "#!/usr/bin/env node",
    file: "dist/cli.js",
    format: "cjs",
  },
  plugins: [nodeResolve(), commonjs(), json()],
};
