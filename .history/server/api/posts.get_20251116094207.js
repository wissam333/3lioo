import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default defineEventHandler(() => {
  try {
    // The correct Nitro path on Netlify:
    // import.meta.env.NITRO_ASSETS_DIR points to /var/task/server/assets
    const assetsRoot = import.meta.env.NITRO_ASSETS_DIR

    const postsDir = path.join(assetsRoot, 'posts')

    if (!fs.existsSync(postsDir)) {
      return {
        error: true,
        message: `Posts directory not found at: ${postsDir}`
      }
    }

    const files = fs.readdirSync(postsDir)

    const posts = files
      .filter((f) => f.endsWith('.md'))
      .map((file) => {
        const filePath = path.join(postsDir, file)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(raw)

        if (!data?.date) {
          throw new Error(`Missing required 'date' in frontmatter: ${file}`)
        }

        return {
          ...data,
          body: content,
          _path: `/blog/${file.replace('.md', '')}`
        }
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    return posts

  } catch (err) {
    return {
      error: true,
      message: err.message,
      stack: err.stack
    }
  }
})
