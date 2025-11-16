import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        date: z.string()
      })
    })
  }
})
