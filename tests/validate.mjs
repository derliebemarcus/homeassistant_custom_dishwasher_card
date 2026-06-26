import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/homeassistant_custom_dishwasher_card.js", "utf8");
const distribution = await readFile("dist/homeassistant_custom_dishwasher_card.js", "utf8");
const manifest = JSON.parse(await readFile("hacs.json", "utf8"));
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const packageLock = JSON.parse(await readFile("package-lock.json", "utf8"));
const releaseManifest = JSON.parse(await readFile(".release-please-manifest.json", "utf8"));

assert.equal(distribution, source, "dist file must match the source build");
assert.equal(manifest.name, "Home Connect Dishwasher Card");
assert.equal(manifest.filename, "homeassistant_custom_dishwasher_card.js");
assert.match(packageJson.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, "package version must be valid SemVer");
assert.equal(packageLock.version, packageJson.version, "package-lock version must match package.json");
assert.equal(packageLock.packages[""].version, packageJson.version, "root package-lock version must match package.json");
assert.equal(releaseManifest["."], packageJson.version, "Release Please manifest version must match package.json");

for (const expected of [
  'customElements.define("dishwasher-card"',
  'type: "dishwasher-card"',
  'config/entity_registry/list_for_display',
  '_operation_state',
  '_program_progress',
  'select_option',
  'set_value',
  'window.confirm',
  'prefers-reduced-motion',
  'getEntitySuggestion',
]) {
  assert.ok(source.includes(expected), `missing required feature: ${expected}`);
}

console.log("Dishwasher card validation passed");
