import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/homeassistant_custom_dishwasher_card.js", "utf8");
const distribution = await readFile("dist/homeassistant_custom_dishwasher_card.js", "utf8");
const readme = await readFile("README.md", "utf8");
const manifest = JSON.parse(await readFile("hacs.json", "utf8"));
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const packageLock = JSON.parse(await readFile("package-lock.json", "utf8"));
const changesetsConfig = JSON.parse(await readFile(".changeset/config.json", "utf8"));

const supportedHomeAssistant = "2026.6.0";
const versionPattern = /const VERSION = "([^"\n]+)";/;
const sourceVersion = source.match(versionPattern)?.[1];
const distributionVersion = distribution.match(versionPattern)?.[1];

assert.equal(distribution, source, "dist file must match the source build");
assert.equal(manifest.name, "Home Connect Dishwasher Card");
assert.equal(manifest.filename, "homeassistant_custom_dishwasher_card.js");
assert.equal(manifest.homeassistant, supportedHomeAssistant);
assert.match(manifest.homeassistant, /^\d{4}\.\d{1,2}\.0$/);
assert.ok(readme.includes("Home Assistant " + supportedHomeAssistant + " or newer"));
assert.match(packageJson.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
assert.equal(packageLock.version, packageJson.version);
assert.equal(packageLock.packages[""].version, packageJson.version);
assert.equal(changesetsConfig.baseBranch, "main");
assert.equal(changesetsConfig.privatePackages.version, true);
assert.equal(changesetsConfig.privatePackages.tag, false);
assert.equal(sourceVersion, packageJson.version);
assert.equal(distributionVersion, packageJson.version);

for (const expected of [
  'customElements.define("dishwasher-card"',
  'type: "dishwasher-card"',
  'config/entity_registry/list_for_display',
  '_operation_state',
  '_program_progress',
  'select_option',
  'set_value',
  'globalThis.confirm',
  'prefers-reduced-motion',
  'getEntitySuggestion',
  'globalThis.customCards',
]) {
  assert.ok(source.includes(expected), `missing required feature: ${expected}`);
}

console.log("Dishwasher card validation passed");
