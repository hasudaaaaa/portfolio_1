import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "content/artworks");

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
  twitterUrl?: string;
  contentHtml?: string;
}

export async function getArtwork(id: string): Promise<ArtworkData> {
  const filePath = path.join(contentDir, `${id}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return { id, ...(data as Omit<ArtworkData, "id" | "contentHtml">), contentHtml: processed.toString() };
}

export function getAllArtworks(): ArtworkData[] {
  return getAllArtworkIds()
    .map((id) => {
      const raw = fs.readFileSync(path.join(contentDir, `${id}.md`), "utf-8");
      return { id, ...(matter(raw).data as Omit<ArtworkData, "id">) };
    })
    .sort((a, b) => Number(b.number) - Number(a.number));
}
