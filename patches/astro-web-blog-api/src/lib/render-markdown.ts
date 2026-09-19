import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { MarkdownHeading } from "@astrojs/internal-helpers/markdown";

let rendererPromise: ReturnType<typeof createMarkdownProcessor> | null = null;

async function getRenderer() {
  if (!rendererPromise) {
    rendererPromise = createMarkdownProcessor({
      shikiConfig: {
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      },
    });
  }
  return rendererPromise;
}

export type RenderedMarkdown = {
  html: string;
  headings: MarkdownHeading[];
};

export async function renderMarkdownContent(source: string): Promise<RenderedMarkdown> {
  const markdown = (source ?? "").trim();
  if (!markdown) {
    return { html: "", headings: [] };
  }
  const renderer = await getRenderer();
  const result = await renderer.render(markdown);
  return {
    html: result.code,
    headings: result.metadata.headings ?? [],
  };
}
