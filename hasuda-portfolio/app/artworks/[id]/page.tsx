import type { Metadata } from "next";
import { getArtwork, getAllArtworkIds } from "@/lib/getArtworks";
import ArtworkDetailClient from "./ArtworkDetailClient";
import { defaultOpenGraph } from "@/lib/metadata";

export async function generateStaticParams() {
  return getAllArtworkIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtwork(id);
  return {
    title: `${artwork.title} - hasuda.org`,
    openGraph: { siteName: defaultOpenGraph.siteName, type: defaultOpenGraph.type, url: `https://hasuda.org/artworks/${id}` },
    twitter: {
      card: "summary_large_image",
      images: [`/artworks/${id}/opengraph-image`],
    },
    alternates: { canonical: `https://hasuda.org/artworks/${id}` },
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  return <ArtworkDetailClient artwork={artwork} />;
}
