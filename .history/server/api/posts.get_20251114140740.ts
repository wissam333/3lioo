import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler(() => {
  const postsDir = path.resolve("./content/posts");
  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        ...data,
        body: content,
        _path: `/blog/${file.replace(".md", "")}`,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
});
