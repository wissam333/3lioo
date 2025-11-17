import { serverQueryContent } from "#content/server";

export default defineEventHandler(async (event) => {
  const posts = await serverQueryContent(event).where({ _dir: "posts" }).find();

  const base = "https://3lioo.netlify.app";

  const urls = posts
    .map((p) => `<url><loc>${base}${p._path}</loc></url>`)
    .join("");

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `.trim();
});
