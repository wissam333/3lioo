// composables/usePopularPosts.js
const CMS_REPO = "wissam333/3lioo"; // your GitHub repo
const CMS_BRANCH = "master";
const POSTS_PATH = "content/posts/";

export const usePopularPosts = () => {
  const githubBase = `https://raw.githubusercontent.com/${CMS_REPO}/${CMS_BRANCH}/`;

  const getAllPosts = async () => {
    // Fetch list of posts from GitHub API
    const filesRes = await fetch(
      `https://api.github.com/repos/${CMS_REPO}/contents/${POSTS_PATH}?ref=${CMS_BRANCH}`
    );
    const files = await filesRes.json();

    const posts = await Promise.all(
      files
        .filter((f) => f.name.endsWith(".md"))
        .map(async (file) => {
          const rawRes = await fetch(file.download_url);
          const rawText = await rawRes.text();

          // Parse frontmatter
          const fmMatch = rawText.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
          let frontmatter = {};
          let body = rawText;
          if (fmMatch) {
            body = fmMatch[2];
            frontmatter = Object.fromEntries(
              fmMatch[1]
                .split("\n")
                .map((line) => line.split(":").map((v) => v.trim()))
            );
          }

          return {
            ...frontmatter,
            body,
            _path: `/blog/${file.name.replace(".md", "")}`,
            slug: file.name.replace(".md", ""),
            visits: Number(frontmatter.visits || 0),
          };
        })
    );

    return posts;
  };

  const getPopularPosts = async (currentSlug) => {
    const posts = await getAllPosts();
    return posts
      .filter((p) => p.slug !== currentSlug) // exclude current
      .sort((a, b) => b.visits - a.visits) // sort by visits
      .slice(0, 4); // top 4
  };

  return { getAllPosts, getPopularPosts };
};
