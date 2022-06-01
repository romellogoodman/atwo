const json = require("@rollup/plugin-json");
const shebang = require("rollup-plugin-preserve-shebang");

export default {
  input: "cli.js",
  output: {
    dir: "dist",
    format: "umd",
  },
  plugins: [shebang(), json()],
};
