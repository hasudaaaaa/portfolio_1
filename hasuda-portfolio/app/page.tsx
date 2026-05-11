import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { defaultOpenGraph } from "@/lib/metadata";
import { getAllArtworks } from "@/lib/getArtworks";
import FeaturedArtworkLane from "@/components/FeaturedArtworkLane";
import DraggableProfileCard from "@/components/DraggableProfileCard";
import { HasudaIcon } from "@/components/icons/hasuda-icon";
import TopPageLoadingGate from "@/components/TopPageLoadingGate";

export const metadata: Metadata = {
  alternates: { canonical: "https://hasuda.org" },
  openGraph: { ...defaultOpenGraph, url: "https://hasuda.org" },
};

export default function Home() {
  const featuredArtworks = getAllArtworks().slice(0, 8);

  return (
    <main>
      <TopPageLoadingGate />
      <section className={styles.hero}>
        <div className={styles.keyvisualBG}>
          <Image src="/images/index/155-1-kv.jpg" alt="keyvisual Illustration" fill priority quality={100}/>
        </div> {/*  
        <div className={styles.keyvisualCharacter}>
          <Image src="/images/index/keyvisual_character2.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualEffect1}>
          <Image src="/images/index/keyvisual_effect1.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualFrontObj}>
          <Image src="/images/index/keyvisual_front-obj.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualEffect2}>
          <Image src="/images/index/keyvisual_effect2.webp" alt="keyvisual Illustration" fill />
        </div>*/}
      </section>{/* 
      <h1 className={styles.pageTitle}>
        HASUDA&apos;s<br />PORTFOLIO
      </h1>*/}
      <DraggableProfileCard
        className={`${styles.profileCard} glass-container-type2`}
        draggingClassName={styles.profileCardDragging}
      >
        <div className={styles.profileContents}>
          <div className={styles.profileRow1}>
            <div className={styles.profileAvater}>
              <Image src="/images/index/151-2icon.jpg" alt="profile avatar" fill />
            </div>
            <div>
              <h1 className={styles.profileDisplayName}>蓮田</h1>
              <p className={styles.profileHandle}>@hasuda.org</p>
            </div>
            <div className={styles.hasudaIcon}>
              <HasudaIcon />
            </div>
          </div>
          <div className={styles.profileDetail}>
            <p>graduate student <span className="W3">/</span> Illustration, 3DCG</p>
            {/*<div className={styles.profileLinks}>
              <Link href="/about">
                <div className="button-type1">
                  プロフィール
                </div>
              </Link>
              <Link href="/artworks">
                <div className="button-type1">
                  作品一覧
                </div>
              </Link>
            </div>*/}
          </div>
        </div>
      </DraggableProfileCard>
      <div className={styles.spacer}></div>
      <div className={styles.homeSections}>
        <section className={styles.featuredSection} aria-labelledby="featured-artworks">
          <div className={styles.sectionHead}>
            <div>
              <small>FEATURED ARTWORKS</small>
              <h2 id="featured-artworks">最近の作品</h2>
            </div>
          </div>
          <FeaturedArtworkLane artworks={featuredArtworks} />
          <div className={styles.sectionAction}>
            <Link href="/artworks" className="button-type1 forward">
              作品一覧
            </Link>
          </div>
        </section>
        <div className="main-section">
        <section className={styles.aboutPreview} aria-labelledby="about-preview">
          <div className={styles.aboutImage}>
            <Image src="/images/index/151-2icon.jpg" alt="蓮田のプロフィール画像" fill quality={100} />
          </div>
          <div className={styles.aboutText}>
            <small>ABOUT</small>
            <h2 id="about-preview">蓮田</h2>
            <ul className={styles.snsLinks} aria-label="SNSリンク">
              <li>
                <a href="https://twitter.com/hasudaaaaaaa" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/icons/brand-twitter1.svg" alt="twitter" width={32} height={32} className={styles.snsIcon} />
                </a>
              </li>
              <li>
                <a href="https://www.pixiv.net/users/46313245" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/icons/pixiv.svg" alt="pixiv" width={32} height={32} className={styles.snsIcon} />
                </a>
              </li>
              <li>
                <a href="https://bsky.app/profile/hasuda.org" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/icons/brand-bluesky.svg" alt="Bluesky" width={32} height={32} className={styles.snsIcon} />
                </a>
              </li>
            </ul>
            <p className="W3">
              2023年2月ごろから、ケモ耳の女の子をメインに据えた一次創作を中心にイラストを描いています。
              3DCGで背景を作り、ペイントソフトで背景の着彩とキャラクターの描画を行っています。
            </p>
            
            <div className={styles.linkRow}>
              <Link href="/about" className="button-type1 forward">
                詳しく見る
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.processPreview} aria-labelledby="process-preview">
          <div className={styles.sectionHead}>
            <div>
              <small>PROCESS</small>
              <h2 id="process-preview">3DCGと作るイラスト</h2>
            </div>
          </div>
          <div className={styles.processGrid}>
            {[
              { img: "/images/about/104-making1.webp", label: "Modeling", text: "構図ラフをもとにBlenderで背景を組み立てます。" },
              { img: "/images/about/104-making5.webp", label: "Painting", text: "レンダー画像を下地に、背景の色を塗ります。" },
              { img: "/images/artworks/No-104/104-2s-thumb.png", label: "Finish", text: "キャラクターを描き、色調補正して完成させます。" },
            ].map((item) => (
              <article className={styles.processCard} key={item.label}>
                <div className={styles.processImage}>
                  <Image src={item.img} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <h3>{item.label}</h3>
                <p className="W3">{item.text}</p>
              </article>
            ))}
          </div>
          <div className={styles.sectionAction}>
            <Link href="/about#making" className="button-type1 forward">
              詳しく見る
            </Link>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
