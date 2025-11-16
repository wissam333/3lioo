import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler(() => {
  try {
    // Use Nitro helper to get the serverAssets path we configured above
    const postsDir = serverAssetsDir("posts");

    // Defensive check
    if (!fs.existsSync(postsDir)) {
      return {
        error: true,
        message: `postsDir not found at: ${postsDir}`,
      };
    }

    const files = fs.readdirSync(postsDir);

    const posts = files
      .filter((f) => f.endsWith(".md"))
      .map((file) => {
        const filePath = path.join(postsDir, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);

        // Validate minimal required frontmatter (avoid crashes)
        if (!data || !data.date) {
          throw new Error(
            `Missing or invalid frontmatter in ${file} — 'date' is required`
          );
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
    // Temporary debugging output so you can see the real error in the browser.
    // Remove the stack in production.
    return {
      error: true,
      message: err.message,
      stack: err.stack?.split("\n").slice(0, 10).join("\n"), // first 10 lines
    };
  }
});
