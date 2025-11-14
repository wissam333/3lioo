import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler((event) => {
  const currentSlug = event.context.params?.slug; // the post we are in
  const postsDir = path.resolve("./content/posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const slug = file.replace(".md", "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data, content } = matter(raw);

      return {
        ...data,
        body: content,
        _path: `/blog/${slug}`,
        slug,
        visits: data.visits || 0, // read visits from MD frontmatter
      };
    })
    .filter((p) => p.slug !== currentSlug) // exclude current post
    .sort((a, b) => b.visits - a.visits) // sort by visits descending
    .slice(0, 4); // return at most 4

  return posts;
});
