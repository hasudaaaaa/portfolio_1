"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "./page.module.css";

export default function ArtworkDetailClient({ artwork }: { artwork: ArtworkData }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main>
      <div className="layout">
        <div className="main-section">
          <article>
            <section className={styles.artworkDetail}>
              {/* メイン画像（クリックでモーダル） */}
              <button
                className={styles.mainArtwork}
                onClick={() => setModalOpen(true)}
                aria-label="画像を拡大"
              >
                <Image
                  src={artwork.imagePath}
                  alt={artwork.title}
                  width={600}
                  height={800}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </button>

              {/* キャプション */}
              <div className={styles.artworkCaption}>
                <small>Title :</small>
                <hgroup className={styles.artworkTitle}>
                  <h1>{artwork.title}</h1>
                  <small>{artwork.date}</small>
                </hgroup>
                <small>Comment :</small>
                <div
                  className="W3"
                  dangerouslySetInnerHTML={{ __html: artwork.contentHtml ?? "" }}
                />

                {/* Twitter埋め込み */}
                {artwork.twitterUrl && (
                  <div className="tweet-widget">
                    <blockquote className="twitter-tweet">
                      <a href={artwork.twitterUrl}></a>
                    </blockquote>
                    <Script
                      src="https://platform.twitter.com/widgets.js"
                      strategy="lazyOnload"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className={styles.backToArtworks}>
              <Link href="/artworks#gallery-container">
                <div className="button-type1 glass-container-type2">
                  <div>一覧に戻る</div>
                </div>
              </Link>
            </section>
          </article>
        </div>
      </div>

      {/* モーダル */}
      {modalOpen && (
        <div
          className={`${styles.imageModal} glass-container-type3 ${styles.imageModalActive}`}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className={styles.modalContainer}>
            <button
              className={styles.closeBtn}
              onClick={() => setModalOpen(false)}
              aria-label="閉じる"
            >
              <Image
                src="/images/icons/close_24dp_5F6368_FILL0_wght300_GRAD0_opsz24.svg"
                alt="閉じる"
                width={24}
                height={24}
              />
            </button>
            <Image
              src={artwork.imagePath}
              alt={`${artwork.title} - 拡大表示`}
              width={1200}
              height={1600}
              className={styles.modalContent}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
