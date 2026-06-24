import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "src/homeassistant_custom_dishwasher_card.js");
const targetPath = resolve(root, "dist/homeassistant_custom_dishwasher_card.js");

const source = await readFile(sourcePath, "utf8");
if (!source.includes('customElements.define("dishwasher-card"')) {
  throw new Error("Source does not register custom:dishwasher-card");
}

await mkdir(dirname(targetPath), { recursive: true });
await writeFile(targetPath, source, "utf8");
console.log(`Built ${targetPath}`);
