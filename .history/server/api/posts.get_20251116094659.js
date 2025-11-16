import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler(() => {
  try {
    // Nitro bundles serverAssets here in Netlify:
    const postsDir = path.join(process.cwd(), "server/assets/posts");

    if (!fs.existsSync(postsDir)) {
      return {
        error: true,
        message: `Posts directory not found: ${postsDir}`,
      };
    }

    const files = fs.readdirSync(postsDir);

    const posts = files
      .filter((f) => f.endsWith(".md"))
      .map((file) => {
        const filePath = path.join(postsDir, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);

        if (!data?.date) {
          throw new Error(`Missing 'date' in frontmatter: ${file}`);
        }

        return {
          ...data,
          body: content,
          _path: `/blog/${file.replace(".md", "")}`,
        };
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return posts;
  } catch (err) {
    return {
      error: true,
      message: err.message,
      stack: err.stack,
    };
  }
});
