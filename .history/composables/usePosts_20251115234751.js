// composables/useAllPosts.js
import matter from "gray-matter";

const CMS_REPO = "wissam333/3lioo";
const CMS_BRANCH = "master";
const POSTS_PATH = "content/posts/";

export const useAllPosts = () => {
  const githubBase = `https://raw.githubusercontent.com/${CMS_REPO}/${CMS_BRANCH}/`;

  const getAllPosts = async () => {
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
          };
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return { getAllPosts };
};
