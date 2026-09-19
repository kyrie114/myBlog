/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MYBLOG_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    myBlogMarkdownHtml?: string;
  }
}
