// composables/usePopularPosts.js
import matter from "gray-matter";

const CMS_REPO = "wissam333/3lioo";
const CMS_BRANCH = "master";
const POSTS_PATH = "content/posts/";

export const usePopularPosts = () => {
  const getPopularPosts = async (currentSlug) => {
    const res = await fetch(
      `https://api.github.com/repos/${CMS_REPO}/contents/${POSTS_PATH}?ref=${CMS_BRANCH}`
    );
    const files = await res.json();

    const posts = await Promise.all(
      files
        .filter((f) => f.name.endsWith(".md"))
        .map(async (file) => {
          const rawRes = await fetch(file.download_url);
          const rawText = await rawRes.text();
          const { data, content } = matter(rawText);
          return {
            ...data,
            body: content,
            _path: `/blog/${file.name.replace(".md", "")}`,
            slug: file.name.replace(".md", ""),
            visits: Number(data.visits || 0),
          };
        })
    );

    return posts
      .filter((p) => p.slug !== currentSlug)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 4);
  };

  return { getPopularPosts };
};
