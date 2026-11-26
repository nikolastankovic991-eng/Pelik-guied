import { readFile } from "node:fs/promises";

const places = JSON.parse(await readFile(new URL("../../data/gozo-places.json", import.meta.url), "utf8"));
const errors = [];

if (!Array.isArray(places) || places.length === 0) {
  errors.push("Destination data must be a non-empty array.");
} else {
  const names = new Set();
  for (const [index, place] of places.entries()) {
    const label = `Destination #${index + 1}`;
    if (!place || typeof place !== "object") {
      errors.push(`${label} is not an object.`);
      continue;
    }
    for (const field of ["name", "description", "mapUrl", "imageUrl", "imageAlt", "imageCredit", "imageCreditUrl"]) {
      if (typeof place[field] !== "string" || !place[field].trim()) errors.push(`${label} is missing ${field}.`);
    }
    if (place.name && names.has(place.name)) errors.push(`Duplicate destination name: ${place.name}`);
    if (place.name) names.add(place.name);
    for (const field of ["mapUrl", "imageUrl", "imageCreditUrl"]) {
      if (place[field]) {
        try {
          const url = new URL(place[field]);
          if (url.protocol !== "https:") errors.push(`${place.name}: ${field} must use HTTPS.`);
        } catch {
          errors.push(`${place.name}: ${field} is not a valid URL.`);
        }
      }
    }
    if (place.mapUrl && !place.mapUrl.includes("google.com/maps")) errors.push(`${place.name}: mapUrl must point to Google Maps.`);
    if (place.imageCreditUrl && !place.imageCreditUrl.includes("commons.wikimedia.org")) errors.push(`${place.name}: photo credit link must point to Wikimedia Commons.`);
  }
}

if (errors.length) {
  console.error("Destination content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Validated ${places.length} Gozo destinations: required details, unique names, HTTPS links, Maps links and photo-credit links.`);
