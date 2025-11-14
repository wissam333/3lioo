import fs from "fs";
import path from "path";

const visitsFile = path.resolve("./server/data/visits.json");

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;

  // Read current visits
  let visits = {};
  if (fs.existsSync(visitsFile)) {
    visits = JSON.parse(fs.readFileSync(visitsFile, "utf-8"));
  }

  // Increment visits
  visits[slug] = (visits[slug] || 0) + 1;

  // Save back to file
  fs.writeFileSync(visitsFile, JSON.stringify(visits, null, 2));

  return { slug, visits: visits[slug] };
});
