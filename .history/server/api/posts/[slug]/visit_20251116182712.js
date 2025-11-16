import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default defineEventHandler(async (event) => {
  try {
    const slug = event.context.params.slug;

    const postsDir = path.resolve("./content/posts");
    const files = fs.readdirSync(postsDir);

    // Find file matching slug
    const fileName = files.find((f) => f.replace(".md", "") === slug);
    if (!fileName) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    const filePath = path.join(postsDir, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");

    const { data, content } = matter(raw);

    // increment visits
    const visits = (data.visits || 0) + 1;

    // update frontmatter
    const newFrontmatter = matter.stringify(content, {
      ...data,
      visits,
    });

    fs.writeFileSync(filePath, newFrontmatter);

    return {
      success: true,
      slug,
      visits,
    };
  } catch (err) {
    console.error("Visit API ERROR:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    });
  }
});
