import type { Metadata } from "next";
import { getArtwork, getAllArtworkIds } from "@/lib/getArtworks";
import ArtworkDetailClient from "./ArtworkDetailClient";

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
    openGraph: { url: `https://hasuda.org/artworks/${id}` },
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
