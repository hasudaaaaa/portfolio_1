import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { getArtwork, getAllArtworkIds } from "@/lib/getArtworks";

export const alt = "hasuda.org artwork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return getAllArtworkIds().map((id) => ({ id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);

  const imgPath = join(process.cwd(), "public", artwork.imagePath);
  const raw = await readFile(imgPath);
  const jpeg = await sharp(raw).jpeg({ quality: 85 }).toBuffer();
  const imgSrc = `data:image/jpeg;base64,${jpeg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1a1a1a",
        }}
      >
        <img
          src={imgSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
