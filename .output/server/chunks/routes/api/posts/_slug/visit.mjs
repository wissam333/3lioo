import { c as defineEventHandler, e as createError } from '../../../../_/nitro.mjs';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@primevue/core/base/style';
import '@primeuix/styles/tooltip';
import '@primeuix/styles/ripple';
import '@primeuix/styled';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';

const visit = defineEventHandler(async (event) => {
  try {
    const slug = event.context.params.slug;
    const postsDir = path.resolve("./content/posts");
    const files = fs.readdirSync(postsDir);
    const fileName = files.find((f) => f.replace(".md", "") === slug);
    if (!fileName) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found"
      });
    }
    const filePath = path.join(postsDir, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const visits = (data.visits || 0) + 1;
    const newFrontmatter = matter.stringify(content, {
      ...data,
      visits
    });
    fs.writeFileSync(filePath, newFrontmatter);
    return {
      success: true,
      slug,
      visits
    };
  } catch (err) {
    console.error("Visit API ERROR:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    });
  }
});

export { visit as default };
//# sourceMappingURL=visit.mjs.map
