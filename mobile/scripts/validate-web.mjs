import { readFile } from "node:fs/promises";
import vm from "node:vm";

const pages = ["index.html", "businesses.html", "submit-business.html", "claim-business.html", "admin.html"];
let checked = 0;
const errors = [];

for (const page of pages) {
  const html = await readFile(new URL("../../" + page, import.meta.url), "utf8");
  const blocks = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, match] of blocks.entries()) {
    const source = match[1].trim();
    if (!source) continue;
    try {
      new vm.Script(source, { filename: page + "#script-" + (index + 1) });
      checked++;
    } catch (error) {
      errors.push(page + " script " + (index + 1) + ": " + error.message);
    }
  }
}

try {
  const serviceWorker = await readFile(new URL("../../service-worker.js", import.meta.url), "utf8");
  new vm.Script(serviceWorker, { filename: "service-worker.js" });
  checked++;
} catch (error) {
  errors.push("service-worker.js: " + error.message);
}

if (errors.length) {
  console.error("Website JavaScript syntax validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("Validated " + checked + " inline JavaScript blocks across " + pages.length + " website pages.");
