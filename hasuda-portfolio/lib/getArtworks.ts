import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { LeafDirective } from "mdast-util-directive";

const contentDir = path.join(process.cwd(), "content/artworks");

type EmbedDirectiveNode = Omit<Partial<LeafDirective>, "type"> & {
  type: LeafDirective["type"] | "html";
  value?: string;
};

function replaceDirectiveWithHtml(node: LeafDirective, value: string) {
  const htmlNode = node as EmbedDirectiveNode;

  Object.assign(htmlNode, {
    type: "html",
    value,
  });
  delete htmlNode.name;
  delete htmlNode.attributes;
  delete htmlNode.children;
}

function remarkEmbeds() {
  return (tree: Root) => {
    visit(tree, "leafDirective", (node: LeafDirective) => {
      if (node.name === "youtube") {
        const url = node.attributes?.url ?? "";
        replaceDirectiveWithHtml(
          node,
          `<div class="YT-widget"><iframe width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`
        );
      } else if (node.name === "twitter") {
        const url = node.attributes?.url ?? "";
        replaceDirectiveWithHtml(
          node,
          `<div class="tweet-widget"><blockquote class="twitter-tweet"><a href="${url}"></a></blockquote></div>`
        );
      }
    });
  };
}

const processor = remark()
  .use(remarkDirective)
  .use(remarkEmbeds)
  .use(html, { sanitize: false });

export function getAllArtworkIds(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export interface ArtworkData {
  id: string;
  number: string;
  title: string;
  date: string;
  imagePath: string;
  thumbnailPath: string;
  sections?: string[];
}

export async function getArtwork(id: string): Promise<ArtworkData> {
  const filePath = path.join(contentDir, `${id}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const sectionTexts = content.split(/\r?\n---\r?\n/);
  const sections = await Promise.all(
    sectionTexts.map(async (s) => {
      const html = (await processor.process(s)).toString();
      return html.replace(
        /<a href="(https?:\/\/[^"]+)"/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer"'
      );
    })
  );
  return { id, ...(data as Omit<ArtworkData, "id" | "sections">), sections };
}

export function getAllArtworks(): ArtworkData[] {
  return getAllArtworkIds()
    .map((id) => {
      const raw = fs.readFileSync(path.join(contentDir, `${id}.md`), "utf-8");
      return { id, ...(matter(raw).data as Omit<ArtworkData, "id">) };
    })
    .sort((a, b) => Number(b.number) - Number(a.number));
}
