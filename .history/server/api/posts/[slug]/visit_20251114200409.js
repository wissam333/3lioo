import fs from "fs";
import path from "path";

export default defineEventHandler((event) => {
  const { slug } = event.context.params;
  const visitsFile = path.resolve("./data/visits.json");

  // Read current visits
  let visits = {};
  if (fs.existsSync(visitsFile)) {
    visits = JSON.parse(fs.readFileSync(visitsFile, "utf-8"));
  }

  // Increment visit count
  visits[slug] = (visits[slug] || 0) + 1;

  // Save back
  fs.writeFileSync(visitsFile, JSON.stringify(visits, null, 2));

  return { slug, visits: visits[slug] };
});
