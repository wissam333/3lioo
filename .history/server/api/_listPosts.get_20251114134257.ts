import fs from 'fs'
import path from 'path'

export default defineEventHandler(() => {
  const base = path.resolve(process.cwd(), 'content', 'posts')
  let files = []
  try {
    files = fs.readdirSync(base).filter(f => f.endsWith('.md'))
  } catch (e: any) {
    return { ok: false, error: e.message, base }
  }
  const sample = files.slice(0,10)
  return { ok: true, base, count: files.length, sample }
})
