import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler((event) => {
  const { slug } = event.context.params;

  const postsDir = path.resolve("./content/posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...data,
    body: content,
    _path: `/blog/${slug}`,
  };
});
