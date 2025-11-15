import { c as defineEventHandler } from '../../../_/nitro.mjs';
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

const mostWatched = defineEventHandler((event) => {
  var _a;
  const currentSlug = (_a = event.context.params) == null ? void 0 : _a.slug;
  const postsDir = path.resolve("./content/posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(".md", "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      ...data,
      body: content,
      _path: `/blog/${slug}`,
      slug,
      visits: data.visits || 0
      // read visits from MD frontmatter
    };
  }).filter((p) => p.slug !== currentSlug).sort((a, b) => b.visits - a.visits).slice(0, 4);
  return posts;
});

export { mostWatched as default };
//# sourceMappingURL=most-watched.mjs.map
