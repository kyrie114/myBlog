# Astro-web blog API wire-up

Applies Spring Boot public article API to Astro-star `/blog` routes.

## Apply on Windows

```powershell
cd D:\code\python_code\myBlog\_trash
# after copying this folder from the agent box:
python D:\path\to\patches\astro-web-blog-api\apply_to_astro_web.py D:\code\python_code\myBlog\astro-web
```

Restart Astro: `pnpm dev --host 127.0.0.1 --port 4321`

Verify: `http://127.0.0.1:4321/blog/` and `/blog/1/`

Markdown: `@astrojs/markdown-remark` `createMarkdownProcessor` (no new deps).
