import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler(() => {
  const postsDir = path.resolve("./content/posts");
  const visitsFile = path.resolve("./data/visits.json");

  // Read visits
  let visits = {};
  if (fs.existsSync(visitsFile)) {
    visits = JSON.parse(fs.readFileSync(visitsFile, "utf-8"));
  }

  // Read all posts
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(".md", "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      ...data,
      body: content,
      _path: `/blog/${slug}`,
      visits: visits[slug] || 0,
    };
  });

  // Sort by visits descending
  posts.sort((a, b) => b.visits - a.visits);

  return posts;
});
