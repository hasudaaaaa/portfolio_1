import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";

const contentDir = path.join(process.cwd(), "content/artworks");

function remarkEmbeds() {
  return (tree: any) => {
    visit(tree, "leafDirective", (node: any) => {
      if (node.name === "youtube") {
        const url = node.attributes?.url ?? "";
        Object.assign(node, {
          type: "html",
          value: `<div class="YT-widget"><iframe width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
        });
        delete node.name;
        delete node.attributes;
        delete node.children;
      } else if (node.name === "twitter") {
        const url = node.attributes?.url ?? "";
        Object.assign(node, {
          type: "html",
          value: `<div class="tweet-widget"><blockquote class="twitter-tweet"><a href="${url}"></a></blockquote></div>`,
        });
        delete node.name;
        delete node.attributes;
        delete node.children;
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
    sectionTexts.map(async (s) => (await processor.process(s)).toString())
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
