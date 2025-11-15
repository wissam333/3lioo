const CMS_REPO = 'wissam333/3lioo' // your GitHub repo
const CMS_BRANCH = 'master'
const POSTS_PATH = 'content/posts/'

export const usePosts = () => {
  const githubBase = `https://raw.githubusercontent.com/${CMS_REPO}/${CMS_BRANCH}/`

  const getPosts = async () => {
    // 1. Fetch list of files from GitHub API
    const filesRes = await fetch(
      `https://api.github.com/repos/${CMS_REPO}/contents/${POSTS_PATH}?ref=${CMS_BRANCH}`
    )
    const files = await filesRes.json()

    // 2. Fetch content of each Markdown file
    const posts = await Promise.all(
      files
        .filter((f) => f.name.endsWith('.md'))
        .map(async (file) => {
          const rawRes = await fetch(file.download_url)
          const rawText = await rawRes.text()

          // simple frontmatter parse
          const fmMatch = rawText.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
          let frontmatter = {}
          let body = rawText
          if (fmMatch) {
            body = fmMatch[2]
            frontmatter = Object.fromEntries(
              fmMatch[1]
                .split('\n')
                .map((line) => line.split(':').map((v) => v.trim()))
            )
          }

          return {
            ...frontmatter,
            body,
            _path: `/blog/${file.name.replace('.md', '')}`,
          }
        })
    )

    // 3. Sort by date descending
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  const getPostBySlug = async (slug) => {
    const posts = await getPosts()
    return posts.find((p) => p.slug === slug)
  }

  return { getPosts, getPostBySlug }
}
