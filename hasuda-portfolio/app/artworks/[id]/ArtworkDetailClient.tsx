"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "./page.module.css";

export default function ArtworkDetailClient({ artwork }: { artwork: ArtworkData }) {
  const [modalOpen, setModalOpen] = useState(false);

  // widgets.js がすでにロード済みの場合（クライアントサイドナビゲーション時）は
  // twttr.widgets.load() を手動で呼んで新しい blockquote を処理させる
  useEffect(() => {
    if (!artwork.twitterUrl) return;
    const twttr = (window as Window & { twttr?: { widgets?: { load: () => void } } }).twttr;
    twttr?.widgets?.load();
  }, [artwork.twitterUrl]);

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
                  </div>
                )}
              </div>
            </section>

            {/* YouTube埋め込み */}
            {artwork.youtubeUrl && (
              <section>
                <div className="YT-widget">
                  <iframe
                    width="560"
                    height="315"
                    src={artwork.youtubeUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

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

      {/* Twitter widgets.js — 条件外で常にロード、onLoadで初回処理 */}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          const twttr = (window as Window & { twttr?: { widgets?: { load: () => void } } }).twttr;
          twttr?.widgets?.load();
        }}
      />

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
