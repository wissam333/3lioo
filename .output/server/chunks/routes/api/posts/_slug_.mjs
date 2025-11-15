import { c as defineEventHandler, e as createError } from '../../../_/nitro.mjs';
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

const _slug_ = defineEventHandler((event) => {
  const { slug } = event.context.params;
  const postsDir = path.resolve("./content/posts");
  const filePath = path.join(postsDir, `${slug}.md`);
  console.log("Looking for post file:", filePath);
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    ...data,
    body: content,
    _path: `/blog/${slug}`
  };
});

export { _slug_ as default };
//# sourceMappingURL=_slug_.mjs.map
