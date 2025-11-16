import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "data",
      source: "posts/*.md",
      schema: z.object({
        date: z.string(),
      }),
    }),
  },
});
