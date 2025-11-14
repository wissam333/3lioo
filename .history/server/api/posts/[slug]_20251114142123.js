import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler((event) => {
  const { slug } = event.context.params;

  const postsDir = path.resolve("./content/posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  console.log("Looking for post file:", filePath); // <-- debug

  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath); // <-- debug
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
