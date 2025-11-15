// composables/usePostDetails.js
import matter from "gray-matter";

const CMS_REPO = "wissam333/3lioo";
const CMS_BRANCH = "master";
const POSTS_PATH = "content/posts/";

export const usePostDetails = () => {
  const getPost = async (slug) => {
    const url = `https://raw.githubusercontent.com/${CMS_REPO}/${CMS_BRANCH}/${POSTS_PATH}${slug}.md`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Post not found");

    const rawText = await res.text();
    const { data, content } = matter(rawText);

    return {
      ...data,
      body: content,
      _path: `/blog/${slug}`,
      slug,
      visits: data.visits || 0, // static visits from MD frontmatter
    };
  };

  return { getPost };
};
