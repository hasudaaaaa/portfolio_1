import { readFileSync } from "fs";
import path from "path";
import sharp from "sharp";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svgBuffer = readFileSync(
    path.join(process.cwd(), "app", "icon.svg")
  );

  const pngBuffer = await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
}
