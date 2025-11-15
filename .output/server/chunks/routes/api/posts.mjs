import { c as defineEventHandler } from '../../_/nitro.mjs';
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

const posts = defineEventHandler(() => {
  const postsDir = path.resolve("./content/posts");
  const files = fs.readdirSync(postsDir);
  const posts = files.filter((f) => f.endsWith(".md")).map((file) => {
    const filePath = path.join(postsDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return {
      ...data,
      body: content,
      _path: `/blog/${file.replace(".md", "")}`
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
});

export { posts as default };
//# sourceMappingURL=posts.mjs.map
