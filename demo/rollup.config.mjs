import { nodeResolve } from "@rollup/plugin-node-resolve";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import fg from "fast-glob";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import preserveDirectives from "rollup-preserve-directives";

const tailwindConfig = require("./tailwind.config.js");

export default [
  {
    input: "app/index.tsx",
    cache: false,
    logLevel: "debug",
    onwarn: function (message, warn) {
      // https://rollupjs.org/troubleshooting/#error-this-is-undefined
      if (message.code == "THIS_IS_UNDEFINED") return;
      warn(message);
    },
    onLog(level, log, handler) {
      handler(level, log);
    },
    output: {
      format: "iife",
      file: "dist/app.js",
      sourcemap: true,
    },
    plugins: [
      // https://github.com/rollup/rollup/issues/4699
      preserveDirectives.default(),
      // Rollup plugin for resolving tsconfig paths so we can do import { foo } from "~lib/"
      tsConfigPaths(),
      typescript({
        tsconfig: "./tsconfig.json",
        noEmitOnError: false,
      }),
      {
        name: "watch-external",
        async buildStart() {
          const files = await fg(["app/**"]);
          for (let file of files) {
            console.log(`watching ${file}`);
            this.addWatchFile(file);
          }
        },
      },
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      postcss({
        plugins: [postcssImport(), tailwindcss(tailwindConfig), autoprefixer(), postcssNested()],
        extensions: [".css"],
        extract: true,
        minimize: true,
      }),
      commonjs(),
      nodeResolve({ browser: true }),
      copy({
        targets: [{ src: "common/static/**/*", dest: "dist" }],
      }),
      json(),
    ],
  },
];
