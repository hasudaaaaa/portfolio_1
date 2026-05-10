"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "./FeaturedArtworkLane.module.css";

export default function FeaturedArtworkLane({ artworks }: { artworks: ArtworkData[] }) {
  const router = useRouter();
  const artworkGroups = [artworks, artworks, artworks, artworks];
  const laneRef = useRef<HTMLDivElement>(null);
  const artworkLaneRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const dragOffsetStartRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const draggedRef = useRef(false);
  const pointerLinkRef = useRef<HTMLAnchorElement | null>(null);
  const suppressNextClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const setDragOffset = (offset: number) => {
    const artworkLane = artworkLaneRef.current;
    const secondGroup = artworkLane?.children[1] as HTMLElement | undefined;
    const loopWidth = secondGroup?.offsetLeft ?? 0;
    const normalizedOffset = loopWidth
      ? ((offset % loopWidth) + loopWidth) % loopWidth - loopWidth
      : offset;

    dragOffsetRef.current = normalizedOffset;
    artworkLane?.style.setProperty("--drag-offset", `${normalizedOffset}px`);
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
        pointerLinkRef.current = (event.target as HTMLElement).closest("a");
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

        const link = pointerLinkRef.current;
        pointerLinkRef.current = null;

        if (!link || draggedRef.current || event.button !== 0) return;
        const href = link.getAttribute("href");
        if (href) {
          suppressNextClickRef.current = true;
          router.push(href);
        }
      }}
      onPointerCancel={() => {
        pointerLinkRef.current = null;
        setIsDragging(false);
      }}
    >
      <div className={styles.artworkLane} ref={artworkLaneRef}>
        {artworkGroups.map((group, groupIndex) => (
          <ul className={styles.artworkGroup} key={groupIndex} aria-hidden={groupIndex === 0 ? undefined : true}>
            {group.map((artwork) => (
              <li className={styles.featuredCard} key={`${artwork.id}-${groupIndex}`}>
                <Link
                  href={`/artworks/${artwork.id}`}
                  aria-label={`${artwork.title} の詳細を見る`}
                  tabIndex={groupIndex === 0 ? undefined : -1}
                  onClick={(event) => {
                    if (!draggedRef.current && !suppressNextClickRef.current) return;

                    event.preventDefault();
                    event.stopPropagation();
                    suppressNextClickRef.current = false;
                  }}
                >
                  <div className={styles.featuredImage}>
                    <Image
                      src={artwork.thumbnailPath}
                      alt={artwork.title}
                      width={400}
                      height={400}
                      quality={90}
                      draggable={false}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
