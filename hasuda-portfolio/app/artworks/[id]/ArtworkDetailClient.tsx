"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { ArtworkData } from "@/lib/getArtworks";
import styles from "./page.module.css";

function CopyLinkButton({ artworkId, artworkTitle }: { artworkId: string; artworkTitle: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag?.("event", "copy_link", {
      artwork_id: artworkId,
      artwork_title: artworkTitle,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`glass-container-type2 ${styles.CopyLinkButton} ${copied ? styles.CopyLinkButtonCopied : ""}`}
      onClick={handleCopyLink}
    >
      {copied ? "Copied!!" : "Copy Link"}
    </button>
  );
}

export default function ArtworkDetailClient({ artwork }: { artwork: ArtworkData }) {
  const [modalOpen, setModalOpen] = useState(false);

  const hasTwitter = artwork.sections?.some((s) => s.includes("twitter-tweet")) ?? false;

  // widgets.js がすでにロード済みの場合（クライアントサイドナビゲーション時）は
  // twttr.widgets.load() を手動で呼んで新しい blockquote を処理させる
  useEffect(() => {
    if (!hasTwitter) return;
    const twttr = (window as Window & { twttr?: { widgets?: { load: () => void } } }).twttr;
    twttr?.widgets?.load();
  }, [hasTwitter, artwork.sections]);

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
                  width={1200}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 600px"
                  quality={100}
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
                <div className={styles.ShareButtons}>
                  <CopyLinkButton artworkId={artwork.id} artworkTitle={artwork.title} />
                </div>
                <small>Comment :</small>
                <div
                  className="W3"
                  dangerouslySetInnerHTML={{ __html: artwork.sections?.[0] ?? "" }}
                />
              </div>
            </section>

            {/* 追加セクション */}
            {artwork.sections?.slice(1).map((sectionHtml, i) => (
              <section className={`W3 ${styles.additionalSection}`} key={i} dangerouslySetInnerHTML={{ __html: sectionHtml }} />
            ))}

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
              sizes="100vw"
              unoptimized
              className={styles.modalContent}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
