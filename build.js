import { build } from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: process.env.DEV ? false : true,
  watch: process.env.DEV ? true : false,
  format: "esm",
  platform: "node",
  target: "es2020",
  outfile: "dist/index.js",
  plugins: [NodeModulesPolyfillPlugin()],
});

console.log("✅ build complete");
if (process.env.DEV) {
  console.log("👀 watching for changes...");
}
