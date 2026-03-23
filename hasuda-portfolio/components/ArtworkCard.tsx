import Link from "next/link";
import Image from "next/image";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "./ArtworkCard.module.css";

export default function ArtworkCard({ artwork }: { artwork: ArtworkData }) {
  const href = artwork.number === "000" ? "/coming-soon" : `/artworks/${artwork.id}`;

  return (
    <li className={styles.artworksItem}>
      <Link href={href}>
        <div className={styles.thumbnailFrame}>
          <Image
            src={artwork.thumbnailPath}
            alt={artwork.title}
            width={180}
            height={180}
            className={styles.thumbnail}
          />
        </div>
        <h3>{artwork.title}</h3>
        <small className="W3">{artwork.date}</small>
      </Link>
    </li>
  );
}
