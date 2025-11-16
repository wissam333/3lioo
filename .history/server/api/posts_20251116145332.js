import { promises as fs } from "fs";
import path from "path";

export default defineEventHandler(async () => {
  const postsDir = path.join(process.cwd(), "server/assets/posts");

  const exists = await fs
    .access(postsDir)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    return {
      error: true,
      message: `Posts directory not found: ${postsDir}`,
    };
  }

  const files = await fs.readdir(postsDir);

  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, "utf8");

      return {
        slug: file.replace(".md", ""),
        content,
      };
    })
  );

  return posts;
});
