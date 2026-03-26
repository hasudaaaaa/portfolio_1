import type { Metadata } from "next";
import { getAllArtworks } from "@/lib/getArtworks";
import ArtworkCard from "@/components/ArtworkCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Artworks - hasuda.org",
  alternates: { canonical: "https://hasuda.org/artworks" },
  openGraph: { url: "https://hasuda.org/artworks" },
};

export default function ArtworksPage() {
  const artworks = getAllArtworks();

  return (
    <main>
      <div className="layout">
        <div className="main-section">
          <hgroup className="page-head">
            <h1>作品一覧</h1>
            <small>ARTWORKS</small>
          </hgroup>
          <article>
            <ul className={styles.artworksList} id="gallery-container">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </ul>
          </article>
        </div>
      </div>
    </main>
  );
}
