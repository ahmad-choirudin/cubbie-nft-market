// Verifies image and model references.  Run from nft-market:  npm run check:assets
//  - every asset path used in code must exist (error)
//  - every asset file should be used somewhere (warning)
//  - every character image needs a thumbnail (error)
//  - big files are listed (warning)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const ASSETS = join(SRC, "assets");
const ASSET_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg", ".glb", ".gltf"]);
const CODE_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".css"]);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const rel = (p) => relative(SRC, p).split("\\").join("/");
const files = walk(SRC);
const assets = files.filter((f) => f.startsWith(ASSETS) && ASSET_EXT.has(extname(f)));
const code = files.filter((f) => CODE_EXT.has(extname(f)));

const used = new Set();
const missing = [];

const globToRegex = (g) =>
  new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*") + "$");

for (const file of code) {
  const text = readFileSync(file, "utf8");

  // Direct references such as import x from "../assets/a/b.webp"
  for (const m of text.matchAll(/["'`(]([^"'`()\s$*]*assets\/[^"'`()\s$*]+\.(?:webp|png|jpe?g|svg|glb|gltf))/g)) {
    const target = resolve(dirname(file), m[1]);
    if (existsSync(target)) used.add(target);
    else missing.push(`${rel(file)} -> ${m[1]}`);
  }

  // import.meta.glob("pattern") patterns
  for (const m of text.matchAll(/import\.meta\.glob(?:<[^>]+>)?\(\s*["'`]([^"'`]+)["'`]/g)) {
    const re = globToRegex(resolve(dirname(file), m[1]).split("\\").join("/"));
    assets.forEach((a) => re.test(a.split("\\").join("/")) && used.add(a));
  }
}

const unused = assets.filter((a) => !used.has(a));

// Every full character image needs a thumbnail.
const noThumb = assets
  .filter((a) => /assets\/characters\/cubbie-[^/]+\.webp$/.test(a.split("\\").join("/")))
  .filter((a) => !existsSync(join(dirname(a), "thumbs", a.split(/[\\/]/).pop())))
  .map(rel);

const big = assets
  .map((a) => [rel(a), statSync(a).size])
  .filter(([n, s]) => (n.endsWith(".glb") ? s > 5e6 : s > 300e3));

console.log(`${assets.length} asset files, ${used.size} referenced.`);

const section = (title, list) => list.length && console.log(`\n${title}\n  ${list.join("\n  ")}`);

section("ERROR: referenced file does not exist", missing);
section("ERROR: character image without thumbnail (run scripts/make-thumbs.py)", noThumb);
section("Warning: asset file not used in code", unused.map(rel));
section("Warning: large file", big.map(([n, s]) => `${n} (${Math.round(s / 1024)} KB)`));

if (missing.length || noThumb.length) process.exit(1);
console.log("\nAll image references are valid.");
