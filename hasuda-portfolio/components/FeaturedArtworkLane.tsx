"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "@/app/page.module.css";

export default function FeaturedArtworkLane({ artworks }: { artworks: ArtworkData[] }) {
  const laneArtworks = [...artworks, ...artworks];
  const laneRef = useRef<HTMLDivElement>(null);
  const artworkLaneRef = useRef<HTMLUListElement>(null);
  const startXRef = useRef(0);
  const dragOffsetStartRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const draggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const setDragOffset = (offset: number) => {
    dragOffsetRef.current = offset;
    artworkLaneRef.current?.style.setProperty("--drag-offset", `${offset}px`);
  };

  return (
    <div
      ref={laneRef}
      className={`${styles.artworkMarquee} ${isDragging ? styles.isDragging : ""}`}
      aria-label="最近の作品"
      onPointerDown={(event) => {
        const lane = laneRef.current;
        if (!lane) return;
        lane.setPointerCapture(event.pointerId);
        startXRef.current = event.clientX;
        dragOffsetStartRef.current = dragOffsetRef.current;
        draggedRef.current = false;
        setIsDragging(true);
      }}
      onPointerMove={(event) => {
        if (!isDragging) return;
        const distance = event.clientX - startXRef.current;
        if (Math.abs(distance) > 4) draggedRef.current = true;
        setDragOffset(dragOffsetStartRef.current + distance);
      }}
      onPointerUp={(event) => {
        laneRef.current?.releasePointerCapture(event.pointerId);
        setIsDragging(false);
      }}
      onPointerCancel={() => {
        setIsDragging(false);
      }}
    >
      <ul className={styles.artworkLane} ref={artworkLaneRef}>
        {laneArtworks.map((artwork, index) => (
          <li className={styles.featuredCard} key={`${artwork.id}-${index}`}>
            <Link
              href={`/artworks/${artwork.id}`}
              aria-label={`${artwork.title} の詳細を見る`}
              onClick={(event) => {
                if (!draggedRef.current) return;
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div className={styles.featuredImage}>
                <Image
                  src={artwork.thumbnailPath}
                  alt={artwork.title}
                  width={220}
                  height={220}
                  quality={90}
                  draggable={false}
                />
              </div>
              <h3>{artwork.title}</h3>
              <small className="W3">{artwork.date}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
